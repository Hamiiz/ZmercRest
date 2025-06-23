import { JwtPayload } from 'jose';

export {}; // Ensures this file is treated as a module

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        iat?: number;
        iss?: string;
        aud?: string;
        exp?: number;
        sub?: string;
        role?: any;
      };
    }
  }
}
