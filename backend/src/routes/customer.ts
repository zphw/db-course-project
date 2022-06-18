import { Router } from 'express';

import { authCustomer } from '../middleware/auth';
import { customerFlights } from '../database/queries/customer';


const router = Router();

router.get('/flights', authCustomer, async (req, res) => {
    const email = req.user as string;
    res.status(200).send({success: true, data: await customerFlights(email), msg: ''});
});

export default router;
