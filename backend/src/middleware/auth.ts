import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import env from '../utils/env';

const authCustomer = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({success: false, msg: 'Not logged in.'});
    }

    try {
        const user = verify(token, env.JWT_SECRET) as { role: string, user: string };
        if (user.role !== 'customer') {
            return res.status(401).send({success: false, msg: 'Permission denied.'});
        } else {
            req.user = user.user;
        }
    } catch (err) {
        res.clearCookie('token');
        return res.status(401).send({success: false, msg: 'Invalid Token.'});
    }
    return next();
};

export { authCustomer };
