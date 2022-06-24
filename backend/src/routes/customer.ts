import AsyncLock from 'async-lock';
import { Router } from 'express';

import connection from '../database';
import logger from "../utils/logger";
import { authCustomer } from '../middleware/auth';
import { customerFlights, spendingTotal, spendingInterval } from '../database/queries/customer';
import { escape, toDateString } from "../utils/zod";
import { z } from "zod";


const router = Router();

const lock = new AsyncLock();

router.get('/flights', authCustomer, async (req, res) => {
    const email = req.user as string;
    res.status(200).send({success: true, data: await customerFlights(email), msg: ''});
});

// eslint-disable-next-line require-await
router.post('/purchase_flight', authCustomer, async (req, res) => {
    const Purchase = z.object({
        airline_name: z.string(),
        flight_num: z.number().int(),
        dep_datetime: z.string(),
        payment: z.object({
            card_number: z.preprocess((v) => parseInt(v as string).toString(), z.string()),
            type: z.enum(["credit", "debit"]),
            cardholder_name: z.preprocess(escape, z.string().max(30)),
            card_exp: z.preprocess(toDateString, z.string()),
        })
    });

    const purchase = Purchase.safeParse(req.body);
    const email = req.user as string;

    if (!purchase.success) {
        res.status(400).json({success: false, msg: 'User input format is incorrect.'});
    } else {
        if (new Date(purchase.data.dep_datetime).getTime() < new Date().getTime()) {
            res.status(200).json({success: false, msg: 'You cannot buy flight that already departed.'});
        } else {
            lock.acquire(`customerPurchaseTicket`, async () => {
                const [rows1] = await connection.promise().query(
                    'SELECT COUNT(*) as count FROM ticket WHERE airline_name = ? AND flight_num = ? AND dep_datetime = ?',
                    [purchase.data.airline_name, purchase.data.flight_num, purchase.data.dep_datetime]);
                const boughtCount = JSON.parse(JSON.stringify(rows1));

                const [rows] = await connection.promise().query(
                    'SELECT base_price, capacity FROM flight WHERE airline = ? AND flight_num = ? AND dep_datetime = ? AND capacity > ?',
                    [purchase.data.airline_name, purchase.data.flight_num, purchase.data.dep_datetime, boughtCount[0].count]);
                const ticketResult = JSON.parse(JSON.stringify(rows));

                if (ticketResult.length === 0) {
                    res.status(200).json({success: false, msg: "You cannot purchase this flight, either because it does not exist or it's full."});
                } else {
                    const [rows] = await connection.promise().query(
                        'SELECT COUNT(*) as count FROM payment WHERE card_number = ?',
                    [purchase.data.payment.card_number]);
                    const cardResult = JSON.parse(JSON.stringify(rows));
                    if (cardResult[0].count > 0) {
                        await connection.promise().query(
                            'UPDATE payment SET ? WHERE ?',
                            [purchase.data.payment, {card_number: purchase.data.payment.card_number}]);
                    } else {
                        await connection.promise().query(
                            'INSERT INTO payment SET ?',
                            purchase.data.payment);
                    }

                    const sold_price = boughtCount[0].count / ticketResult[0].capacity < 0.6 ? ticketResult[0].base_price : ticketResult[0].base_price * 1.2;
                    const [insert] = await connection.promise().query(
                        'INSERT INTO ticket SET ?',
                        {
                            email,
                            airline_name: purchase.data.airline_name,
                            flight_num: purchase.data.flight_num,
                            dep_datetime: purchase.data.dep_datetime,
                            sold_price,
                            purchase_datetime: new Date()
                        });
                    const result = JSON.parse(JSON.stringify(insert));

                    await connection.promise().query(
                        'INSERT INTO customer_ticket SET ?',
                        {
                            email,
                            ticket_id: result.insertId,
                            payment_method: purchase.data.payment.card_number
                        });

                    res.status(200).json({success: true, msg: ''});
                }
            }).catch((err) => {
                logger.error(err);
                res.status(500).json({success: false, msg: 'Book Flight Error'});
            });
        }
    }
});

// eslint-disable-next-line require-await
router.post('/cancel_flight', authCustomer, async (req, res) => {
    const Ticket = z.object({
        ticket_id: z.number().int(),
    });

    const ticket = Ticket.safeParse(req.body);
    const email = req.user as string;

    if (!ticket.success) {
        res.status(400).json({success: false, msg: 'User input format is incorrect.'});
    } else {
        lock.acquire(`customerCancelTicket`, async () => {
            const [rows] = await connection.promise().query(
                'SELECT airline_name, flight_num, dep_datetime FROM ticket WHERE id = ? AND email = ?',
                [ticket.data.ticket_id, email]);
            const ticketResult = JSON.parse(JSON.stringify(rows));

            if (ticketResult.length === 0) {
                res.status(200).json({success: false, msg: "You cannot cancel this ticket."});
            } else {
                if (new Date(ticketResult[0].dep_datetime).getTime() - new Date().getTime() < 24 * (60 * 60 * 1000)) {
                    res.status(200).json({success: false, msg: "Ticket may not be cancelled within 24 hours before departure."});
                } else {
                    await connection.promise().query(
                        'DELETE FROM customer_ticket WHERE ticket_id = ?',
                        ticket.data.ticket_id);
                    await connection.promise().query(
                        'DELETE FROM ticket WHERE id = ?',
                        ticket.data.ticket_id);

                    res.status(200).json({success: true, msg: ''});
                }
            }
        }).catch((err) => {
            logger.error(err);
            res.status(500).json({success: false, msg: 'Cancel Flight Error'});
        });
    }
});

// eslint-disable-next-line require-await
router.post('/rate_flight', authCustomer, async (req, res) => {
    const Rate = z.object({
        customer_email: z.string(),
        ticket_id: z.number().int(),
        stars: z.number().int().gte(1).lte(10),
        comment: z.preprocess(escape, z.string().max(250).optional().nullable().default(null)),
    });

    req.body.customer_email = req.user as string;
    const rate = Rate.safeParse(req.body);

    if (!rate.success) {
        res.status(400).json({success: false, msg: 'User input format is incorrect.'});
    } else {
        lock.acquire(`customerRateTicket${rate.data.ticket_id}`, async () => {
            const [rows] = await connection.promise().query(
                'SELECT id FROM ticket WHERE id = ? AND email = ? AND dep_datetime <= ?',
                [rate.data.ticket_id, rate.data.customer_email, new Date().toISOString().split('T')[0]]);
            const result = JSON.parse(JSON.stringify(rows));

            if (result.length === 0) {
                res.status(200).json({success: false, msg: "You cannot rate a future ticket or that you do not own"});
            } else {
                const [rows] = await connection.promise().query(
                    'SELECT customer_email, ticket_id FROM rate WHERE customer_email = ? AND ticket_id = ?',
                    [rate.data.customer_email, rate.data.ticket_id]);
                const result = JSON.parse(JSON.stringify(rows));

                if (result.length !== 0) {
                    res.status(200).json({success: false, msg: "You've already rated this flight."});
                } else {
                    await connection.promise().query(
                        'INSERT INTO rate SET ?',
                        rate.data);
                    res.status(200).json({success: true, msg: ''});

                }
            }
        }).catch((err) => {
            logger.error(err);
            res.status(500).json({success: false, msg: 'Rate Flight Error'});
        });
    }
});

router.get('/spending/:start?/:end?', authCustomer, async (req, res) => {
    const email = req.user as string;

    try {
        let total_start, interval_start;
        if (req.params.start) {
            total_start = interval_start = new Date(req.params.start).toISOString().split('T')[0];
        } else {
            total_start = interval_start = new Date();

            total_start.setMonth(total_start.getMonth() - 12);
            total_start = total_start.toISOString().split('T')[0];
            interval_start.setMonth(interval_start.getMonth() - 6);
            interval_start = interval_start.toISOString().split('T')[0];
        }

        let total_end, interval_end;
        if (req.params.end) {
            total_end = interval_end = new Date(req.params.end).toISOString().split('T')[0];
        } else {
            total_end = interval_end = new Date().toISOString().split('T')[0];
        }

        const data: {total: number, interval_spending: []} = {
            total: await spendingTotal(email, total_start, total_end),
            interval_spending: await spendingInterval(email, interval_start, interval_end),
        };

        res.status(200).send({success: true, data, msg: ''});

    } catch (e) {
        res.status(400).send({success: false, msg: 'Date format is incorrect.'});
    }
});

export default router;
