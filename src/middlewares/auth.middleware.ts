import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import User from '../models/user.model';
import Admin from '../models/admin.model';

export interface AdminRequest extends Request {
    admin?: Admin; // Vous pouvez définir un type plus précis pour `user` si nécessaire
}

export const adminAuth = (req: AdminRequest, res: Response, next: NextFunction) => {
    
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded: any = jwt.verify(token, 'jwtkey');
        if (decoded.isAdmin) {
            req.admin = decoded; // Optionally attach the decoded payload to the request object
            next();
        } else {
            res.status(403).json({ message: 'Forbidden: Requires admin access' });
        }
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
};