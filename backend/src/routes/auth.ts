import bcrypt from 'bcryptjs';
import { Router } from 'express';
import { sign } from 'jsonwebtoken';
import { z } from "zod";

import connection from '../database';
import env from '../utils/env';

const router = Router();

router.post('/customer/login', async (req, res) => {
    const Customer = z.object({
        email: z.string().email(),
        password: z.string(),
    });
    const user = Customer.safeParse(req.body);

    if (!user.success) {
        res.status(200).json({success: false, msg: 'User email format is incorrect.'});
    } else {
        const [rows] = await connection.promise().query(
            'SELECT password FROM customer WHERE email = ?',
            [user.data.email]);
        const result = JSON.parse(JSON.stringify(rows));

        if (result.length > 0 && bcrypt.compareSync(req.body.password, result[0].password)) {
            res.cookie('token', sign({ email: user.data.email, role: 'customer' }, env.JWT_SECRET, {
                expiresIn: '1h',
            }), {
                httpOnly: true,
                // expires: new Date().setMonth(new Date().getMonth() + 6)
                // secure: true
            });
            res.status(200).json({success: true, msg: ''});
        } else {
            res.status(200).json({success: false, msg: 'Email or password incorrect.'});
        }
    }
});

export default router;
