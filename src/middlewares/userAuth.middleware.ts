// userauth.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

export interface AuthRequest extends Request {
    user?: User; // Assurez-vous que `user` est défini comme étant de type `User`
}

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded: any = jwt.verify(token, 'jwtkey');
        req.user = decoded; // Attachez les informations utilisateur à req.user
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
};
