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
            return res.status(403).send({success: false, msg: 'Permission denied.'});
        } else {
            req.user = user.user;
        }
    } catch (err) {
        res.clearCookie('token');
        return res.status(401).send({success: false, msg: 'Token invalid or expired.'});
    }
    return next();
};

const authStaff = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({success: false, msg: 'Not logged in.'});
    }

    try {
        const user = verify(token, env.JWT_SECRET) as { role: string, user: string, airline: string };
        if (user.role !== 'staff') {
            return res.status(403).send({success: false, msg: 'Permission denied.'});
        } else {
            req.user = user.user;
            req.airline = user.airline;
        }
    } catch (err) {
        res.clearCookie('token');
        return res.status(401).send({success: false, msg: 'Token invalid or expired.'});
    }
    return next();
};

export { authCustomer, authStaff };
