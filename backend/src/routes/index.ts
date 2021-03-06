import { Router } from 'express';
import { z } from 'zod';

import { searchFlight, findFlight } from '../database/queries/flight';
import { toDateString } from '../utils/zod';

const router = Router();

router.post('/search', async (req, res) => {
    const Flight = z.object({
        dep: z.string(),
        arr: z.string(),
        date: z.preprocess(toDateString, z.string()),
        back_date: z.preprocess(toDateString, z.string().optional()),
    });
    const search = Flight.safeParse(req.body);

    if (!search.success) {
        res.status(400).json({success: false, msg: 'Malformed search format.'});
    } else {
        const data: {flights: [], back_flights?: []} = {flights: []};

        data.flights = await searchFlight(search.data.dep, search.data.arr, search.data.date);
        if (data.flights.length > 0 && search.data.back_date) {
            data.back_flights = await searchFlight(search.data.arr, search.data.dep, search.data.back_date);
        }

        res.status(200).json({success: true, data, msg: ''});
    }
});

router.post('/flight', async (req, res) => {
    const Flight = z.object({
        airline: z.string(),
        flight_num: z.number().int(),
        date: z.preprocess(toDateString, z.string()),
    });

    const flight = Flight.safeParse(req.body);

    if (!flight.success) {
        res.status(400).json({success: false, msg: 'Malformed search format.'});
    } else {
        res.status(200).json({success: true, data: await findFlight(
                flight.data.airline,
                flight.data.flight_num,
                flight.data.date
            ), msg: ''});
    }
});

export default router;
