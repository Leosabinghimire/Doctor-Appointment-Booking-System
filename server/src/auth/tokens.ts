import { SignJWT, jwtVerify } from 'jose';
import type { UserRole } from '../../../src/types';
import { config } from '../config';

export interface TokenClaims {
  sub: string;
  role: UserRole;
}

const secret = new TextEncoder().encode(config.auth.jwtSecret);

export const signToken = (claims: TokenClaims): Promise<string> =>
  new SignJWT({ role: claims.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(claims.sub)
    .setIssuedAt()
    .setExpirationTime(config.auth.tokenTtl)
    .sign(secret);

/** Returns the claims, or undefined if the token is invalid or expired. */
export const verifyToken = async (token: string): Promise<TokenClaims | undefined> => {
  try {
    const { payload } = await jwtVerify(token, secret, { algorithms: ['HS256'] });
    if (typeof payload.sub !== 'string' || typeof payload.role !== 'string') return undefined;
    return { sub: payload.sub, role: payload.role as UserRole };
  } catch {
    return undefined;
  }
};
