import type { NextFunction, Request, RequestHandler, Response } from 'express';
import type { UserRole } from '../../../src/types';
import { HttpError } from '../http';
import { verifyToken } from './tokens';
import { findUserById, type UserRecord } from './users';

declare module 'express-serve-static-core' {
  interface Request {
    user?: UserRecord;
  }
}

/** Rejects the request with 401 unless it carries a valid `Authorization: Bearer <token>`. */
export const requireAuth: RequestHandler = (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : undefined;
  if (!token) return next(new HttpError(401, 'Please sign in', 'UNAUTHENTICATED'));

  verifyToken(token)
    .then((claims) => {
      const user = claims && findUserById(claims.sub);
      if (!user) return next(new HttpError(401, 'Your session has expired. Please sign in again.', 'UNAUTHENTICATED'));
      req.user = user;
      next();
    })
    .catch(next);
};

export const requireRole =
  (...roles: UserRole[]): RequestHandler =>
  (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new HttpError(403, 'You do not have access to this', 'FORBIDDEN'));
    }
    next();
  };

/** The signed-in user. Only call in handlers mounted after requireAuth. */
export const currentUser = (req: Request): UserRecord => {
  if (!req.user) throw new HttpError(401, 'Please sign in', 'UNAUTHENTICATED');
  return req.user;
};

export const isAdmin = (req: Request) => req.user?.role === 'admin';
