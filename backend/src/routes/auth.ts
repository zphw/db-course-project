import AsyncLock from 'async-lock';
import bcrypt from 'bcryptjs';
import { Router } from 'express';
import { sign } from 'jsonwebtoken';
import { z } from 'zod';

import connection from '../database';
import env from '../utils/env';
import logger from '../utils/logger';
import { escape, toDateString } from "../utils/zod";

const router = Router();

const lock = new AsyncLock();

router.post('/customer/login', async (req, res) => {
    const Customer = z.object({
        email: z.string().email(),
        password: z.string(),
    });
    const user = Customer.safeParse(req.body);

    if (!user.success) {
        res.status(400).json({success: false, msg: 'User input format is incorrect.'});
    } else {
        const [rows] = await connection.promise().query(
            'SELECT password FROM customer WHERE email = ?',
            [user.data.email]);
        const result = JSON.parse(JSON.stringify(rows));

        if (result.length > 0 && bcrypt.compareSync(req.body.password, result[0].password)) {
            res.cookie('token', sign({ user: user.data.email, role: 'customer' }, env.JWT_SECRET, {
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

// eslint-disable-next-line require-await
router.post('/customer/register', async (req, res) => {
    const NewCustomer = z.object({
        email: z.string().email().max(50),
        name: z.preprocess(escape, z.string().max(50)),
        password: z.string().max(72),
        address: z.preprocess(escape, z.string().max(50).optional().nullable().default(null)),
        address_2: z.preprocess(escape, z.string().max(50).optional().nullable().default(null)),
        city: z.preprocess(escape, z.string().max(30).optional().nullable().default(null)),
        state: z.preprocess(escape, z.string().length(2).optional().nullable().default(null)),
        passport_num: z.preprocess(escape, z.string().max(20).optional().nullable().default(null)),
        passport_exp: z.preprocess(toDateString, z.string().optional().nullable().default(null)),
        passport_country: z.preprocess(escape, z.string().max(20).optional().nullable().default(null)),
        birthday: z.preprocess(toDateString, z.string().optional().nullable().default(null)),
    });
    const user = NewCustomer.safeParse(req.body);

    if (!user.success) {
        res.status(400).json({success: false, msg: 'User input format is incorrect.'});
    } else {
        lock.acquire('customerReg', async () => {
            const [rows] = await connection.promise().query(
                'SELECT email FROM customer WHERE email = ?',
                [user.data.email]);
            const result = JSON.parse(JSON.stringify(rows));

            if (result.length !== 0) {
                res.status(200).json({success: false, msg: 'Email already exists.'});
            } else {
                user.data.password = bcrypt.hashSync(user.data.password, 10);

                await connection.promise().query(
                    'INSERT INTO customer SET ?',
                    user.data);

                res.cookie('token', sign({ user: user.data.email, role: 'customer' }, env.JWT_SECRET, {
                    expiresIn: '1h',
                }), {
                    httpOnly: true,
                    // expires: new Date().setMonth(new Date().getMonth() + 6)
                    // secure: true
                });
                res.status(200).json({success: true, msg: ''});

            }
        }).catch((err) => {
            logger.error(err);
            res.status(500).json({success: false, msg: 'Registration Error'});
        });
    }
});

router.post('/staff/login', async (req, res) => {
    const Staff = z.object({
        username: z.string(),
        password: z.string(),
    });
    const staff = Staff.safeParse(req.body);

    if (!staff.success) {
        res.status(400).json({success: false, msg: 'User input format is incorrect.'});
    } else {
        const [rows] = await connection.promise().query(
            'SELECT password, affiliation FROM airline_staff WHERE username = ?',
            [staff.data.username]);
        const result = JSON.parse(JSON.stringify(rows));

        if (result.length > 0 && bcrypt.compareSync(req.body.password, result[0].password)) {
            res.cookie('token', sign({ user: staff.data.username, role: 'staff', airline: result[0].affiliation }, env.JWT_SECRET, {
                expiresIn: '1h',
            }), {
                httpOnly: true,
                // expires: new Date().setMonth(new Date().getMonth() + 6)
                // secure: true
            });
            res.status(200).json({success: true, msg: ''});
        } else {
            res.status(200).json({success: false, msg: 'Username or password incorrect.'});
        }
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie('token').status(200).json({success:true, msg:''});
});

export default router;
