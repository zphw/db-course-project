import AsyncLock from 'async-lock';
import { Router } from 'express';

import connection from '../database';
import logger from "../utils/logger";
import { authCustomer } from '../middleware/auth';
import { customerFlights, spendingTotal, spendingInterval } from '../database/queries/customer';
import { escape } from "../utils/zod";
import { z } from "zod";


const router = Router();

const lock = new AsyncLock();

router.get('/flights', authCustomer, async (req, res) => {
    const email = req.user as string;
    res.status(200).send({success: true, data: await customerFlights(email), msg: ''});
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
        res.status(200).json({success: false, msg: 'User input format is incorrect.'});
    } else {
        lock.acquire(`customerRateTicket${rate.data.ticket_id}`, async () => {
            const [rows] = await connection.promise().query(
                'SELECT id FROM ticket WHERE id = ? AND email = ? AND dep_datetime <= ?',
                [rate.data.ticket_id, rate.data.customer_email, new Date().toISOString().split('T')[0]]);
            const result = JSON.parse(JSON.stringify(rows));

            if (result.length === 0) {
                res.status(200).json({success: false, msg: "You cannot rate this flight because the flight hasn't yet arrived or you do not own this ticket."});
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
        res.status(200).send({success: false, msg: 'Date format is incorrect.'});
    }
});

export default router;
