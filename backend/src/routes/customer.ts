import { Router } from 'express';

import { authCustomer } from '../middleware/auth';
import { customerFlights, spendingTotal, spendingInterval } from '../database/queries/customer';


const router = Router();

router.get('/flights', authCustomer, async (req, res) => {
    const email = req.user as string;
    res.status(200).send({success: true, data: await customerFlights(email), msg: ''});
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
