import { Router } from 'express';

import { authCustomer } from '../middleware/auth';


const router = Router();

router.get('/flights', authCustomer, async (req, res) => {
    res.status(200).send({success: true, msg: 'ok'});
});

export default router;
