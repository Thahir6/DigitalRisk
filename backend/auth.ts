import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getDb } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'brandguard-secops-jwt-secret-key-2026';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  companyId: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      companyId: user.companyId,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export async function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Your session has ended. Sign in again.',
    });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    const db = await getDb();
    
    // Check if user still exists in DB
    const stmt = db.prepare('SELECT id, name, email, company_id, role, status FROM users WHERE id = ?');
    stmt.bind([decoded.id]);
    
    if (stmt.step()) {
      const row = stmt.getAsObject() as { id: string; name: string; email: string; company_id: string; role: string; status: string };
      stmt.free();

      if (row.status !== 'active') {
        res.status(403).json({ error: 'Forbidden', message: 'User account is suspended.' });
        return;
      }

      req.user = {
        id: row.id,
        name: row.name,
        email: row.email,
        companyId: row.company_id,
        role: row.role,
      };
      next();
    } else {
      stmt.free();
      res.status(401).json({ error: 'Unauthorized', message: 'Your session has ended. Sign in again.' });
    }
  } catch (err) {
    res.status(401).json({
      error: 'Invalid token',
      message: 'Your session has ended. Sign in again.',
    });
  }
}

export async function optionalAuthMiddleware(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next();
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    const db = await getDb();
    const stmt = db.prepare('SELECT id, name, email, company_id, role, status FROM users WHERE id = ?');
    stmt.bind([decoded.id]);

    if (stmt.step()) {
      const row = stmt.getAsObject() as { id: string; name: string; email: string; company_id: string; role: string; status: string };
      stmt.free();

      if (row.status === 'active') {
        req.user = {
          id: row.id,
          name: row.name,
          email: row.email,
          companyId: row.company_id,
          role: row.role,
        };
      }
    } else {
      stmt.free();
    }
  } catch {
    // Ignore invalid tokens for optional auth
  }

  next();
}
