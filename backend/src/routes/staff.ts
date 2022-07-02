import AsyncLock from 'async-lock';
import { Router } from 'express';

import connection from '../database';
import logger from "../utils/logger";
import { authStaff } from '../middleware/auth';
import { escape, toDate, toDateString } from "../utils/zod";
import { z } from "zod";
import {
    allAirplanes, allAirports,
    customersOnlyTakeACertainAirline, flightCustomers,
    flightRatings,
    flights,
    frequentCustomers, revenueTotal, ticketsSoldInterval, ticketsSoldTotal
} from "../database/queries/staff";


const router = Router();

const lock = new AsyncLock();

router.get('/flights/:start?/:end?', authStaff, async (req, res) => {
    const airline = req.airline as string;

    try {
        let start;
        if (req.params.start) {
            start = new Date(req.params.start).toISOString().split('T')[0];
        } else {
            start = new Date().toISOString().split('T')[0];
        }

        let end;
        if (req.params.end) {
            end = new Date(req.params.end).toISOString().split('T')[0];
        } else {
            end = new Date();
            end.setDate(end.getDay() + 30);
            end = end.toISOString().split('T')[0];
        }

        res.status(200).send({success: true, data: {flights: await flights(airline, start, end)}, msg: ''});
    } catch (e) {
        res.status(400).send({success: false, msg: 'Date format is incorrect.'});
    }
});

// eslint-disable-next-line require-await
router.post('/add_flight', authStaff, async (req, res) => {
    const NewFlight = z.object({
        airline: z.string().optional(),
        flight_num: z.number().int(),
        dep_datetime: z.preprocess(toDate, z.date()),
        arr_datetime: z.preprocess(toDate, z.date()),
        base_price: z.number().min(0.01).max(999999.99),
        capacity: z.number().int(),
        status: z.enum(["on-time", "delayed", "arrived"]),
        dep_airport: z.string().length(3),
        arr_airport: z.string().length(3),
        airplane: z.number().int(),
        operator: z.string(),
    });
    const flight = NewFlight.safeParse(req.body);

    if (!flight.success) {
        res.status(400).json({success: false, msg: 'User input format is incorrect.'});
    } else {
        lock.acquire('addFlight', async () => {
            flight.data.airline = req.airline as string;

            const [rows] = await connection.promise().query(
                'SELECT flight_num FROM flight WHERE airline = ? AND flight_num = ?',
                [flight.data.airline, flight.data.flight_num]);
            const result = JSON.parse(JSON.stringify(rows));

            if (result.length !== 0) {
                res.status(200).json({success: false, msg: 'Flight number already exists.'});
            } else {
                await connection.promise().query(
                    'INSERT INTO flight SET ?',
                    flight.data);
                res.status(200).json({success: true, msg: ''});

            }
        }).catch((err) => {
            logger.error(err);
            res.status(500).json({success: false, msg: 'Adding Flight Error'});
        });
    }
});

// eslint-disable-next-line require-await
router.post('/change_flight_status', authStaff, async (req, res) => {
    const Flight = z.object({
        airline: z.string().optional(),
        flight_num: z.number().int(),
        status: z.enum(["on-time", "delayed", "arrived"]),
    });
    const flight = Flight.safeParse(req.body);

    if (!flight.success) {
        res.status(400).json({success: false, msg: 'User input format is incorrect.'});
    } else {
        lock.acquire('changeFlight', async () => {
            flight.data.airline = req.airline as string;

            await connection.promise().query(
                'UPDATE flight SET ? WHERE airline = ? AND flight_num = ?',
                [flight.data, flight.data.airline, flight.data.flight_num]);
            res.status(200).json({success: true, msg: ''});

        }).catch((err) => {
            logger.error(err);
            res.status(500).json({success: false, msg: 'Changing Flight Error'});
        });
    }
});

// eslint-disable-next-line require-await
router.post('/add_airplane', authStaff, async (req, res) => {
    const NewAirplane = z.object({
        id: z.number().int(),
        seats_num: z.number().int(),
        manufacture_company: z.preprocess(escape, z.string().max(20)),
        manufacture_date: z.preprocess(toDateString, z.string()),
        owner: z.string().optional(),
    });
    const airplane = NewAirplane.safeParse(req.body);

    if (!airplane.success) {
        res.status(400).json({success: false, msg: 'User input format is incorrect.'});
    } else {
        lock.acquire('addAirplane', async () => {
            airplane.data.owner = req.airline as string;

            await connection.promise().query(
                'INSERT INTO airplane SET ?',
                airplane.data);
            res.status(200).json({success: true, msg: ''});
        }).catch((err) => {
            logger.error(err);
            res.status(500).json({success: false, msg: 'Adding Airplane Error'});
        });
    }
});

// eslint-disable-next-line require-await
router.post('/add_airport', authStaff, async (req, res) => {
    const NewAirport = z.object({
        code: z.string().length(3),
        city: z.preprocess(escape, z.string().max(30)),
        country: z.preprocess(escape, z.string().max(20)),
        type: z.enum(["domestic", "international"]),
    });
    const airport = NewAirport.safeParse(req.body);

    if (!airport.success) {
        res.status(400).json({success: false, msg: 'User input format is incorrect.'});
    } else {
        lock.acquire('addAirport', async () => {
            const [rows] = await connection.promise().query(
                'SELECT * FROM airport WHERE code = ?',
                [airport.data.code]);
            const result = JSON.parse(JSON.stringify(rows));

            if (result.length !== 0) {
                res.status(200).json({success: false, msg: 'Airport code already exists.'});
            } else {
                await connection.promise().query(
                    'INSERT INTO airport SET ?',
                    airport.data);
                res.status(200).json({success: true, msg: ''});
            }
        }).catch((err) => {
            logger.error(err);
            res.status(500).json({success: false, msg: 'Adding Airport Error'});
        });
    }
});

router.post('/flight_ratings', authStaff, async (req, res) => {
    const Flight = z.object({
        flight_num: z.number().int(),
    });
    const flight = Flight.safeParse(req.body);

    if (!flight.success) {
        res.status(400).json({success: false, msg: 'User input format is incorrect.'});
    } else {
        res.status(200).send({success: true, data: await flightRatings(req.airline as string, flight.data.flight_num), msg: ''});
    }
});

router.get('/frequent_customers', authStaff, async (req, res) => {
    res.status(200).json({success: true, data: {
            frequent_customers: await frequentCustomers(req.airline as string),
            only_customers: await customersOnlyTakeACertainAirline(req.airline as string),
        }});
});

router.get('/tickets_sold/:start/:end', authStaff, async (req, res) => {
    const airline = req.airline as string;

    try {
        const start = new Date(req.params.start).toISOString().split('T')[0];
        const end = new Date(req.params.end).toISOString().split('T')[0];

        res.status(200).json({success: true, data: {
                total: await ticketsSoldTotal(start, end, airline),
                interval: await ticketsSoldInterval(start, end, airline),
            }});
    } catch (e) {
        res.status(400).send({success: false, msg: 'Date format is incorrect.'});
    }
});

router.get('/revenue/:start/:end', authStaff, async (req, res) => {
    const airline = req.airline as string;

    try {
        const start = new Date(req.params.start).toISOString().split('T')[0];
        const end = new Date(req.params.end).toISOString().split('T')[0];

        res.status(200).json({success: true, data: {amount: await revenueTotal(start, end, airline)}});
    } catch (e) {
        res.status(400).send({success: false, msg: 'Date format is incorrect.'});
    }
});

router.get('/airports', authStaff, async (req, res) => {
    res.status(200).json({success: true, data: {amount: await allAirports()}});
});

router.get('/airplanes', authStaff, async (req, res) => {
    res.status(200).json({success: true, data: {amount: await allAirplanes(req.airline as string)}});
});

router.post('/flight_customers', authStaff, async (req, res) => {
    const Flight = z.object({
        flight_num: z.number().int(),
    });
    const flight = Flight.safeParse(req.body);

    if (!flight.success) {
        res.status(400).json({success: false, msg: 'User input format is incorrect.'});
    } else {
        res.status(200).send({success: true, data: await flightCustomers(req.airline as string, flight.data.flight_num), msg: ''});
    }
});

export default router;
