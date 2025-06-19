 
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'hi_there_my_name_is_nitin_gupta';

export interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const token = req.headers['token'] as string | undefined;


  if (!token) {
    res.status(401).json({ message: 'Token missing' });
    return; 
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
}
 




