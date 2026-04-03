import { Request, Response, NextFunction } from 'express';
import { supabase } from '../utils/supabase';
import prisma from '../utils/prisma';

export interface AuthRequest extends Request {
    user?: {
        userId: number;
        role: string;
        supabaseId?: string;
    };
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        // 1. First try to verify with Supabase
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (user && !error) {
            // Priority lookup: use supabaseId first, fallback to email
            let localUser = await prisma.user.findUnique({
                where: { supabaseId: user.id }
            });

            if (!localUser) {
                localUser = await prisma.user.findUnique({
                    where: { email: user.email }
                });
                
                // Sync supabaseId if found by email but id is missing
                if (localUser && !localUser.supabaseId) {
                    await prisma.user.update({
                        where: { id: localUser.id },
                        data: { supabaseId: user.id }
                    });
                }
            }

            if (localUser) {
                req.user = {
                    userId: localUser.id,
                    role: localUser.role,
                    supabaseId: user.id
                };
                return next();
            }
        }

        // 2. Fallback to custom JWT if necessary (to avoid breaking things during migration)
        const jwt = require('jsonwebtoken');
        const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ error: 'Invalid or expired token.' });
    }
};

export const authorizeRoles = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Unauthorized access.' });
        }
        next();
    };
};
