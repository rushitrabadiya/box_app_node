import bcrypt from 'bcryptjs';
import { sign, Secret, verify, SignOptions, VerifyOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { randomString } from './common';

dotenv.config();

// Environment variables
const JWT_SECRET: Secret = process.env.JWT_SECRET || 'your-secret-key';
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || '15m';
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '7d';
const SALT_ROUNDS = process.env.SALT_ROUNDS || 10;

// Hash password
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

// Compare plain password with hash
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

// Sign access token
export const signAccessToken = (userId: string | number): string => {
  const payload = { sub: userId, type: 'access' };
  const options: SignOptions = {
    expiresIn: ACCESS_TOKEN_EXPIRY as unknown as number,
    algorithm: 'HS256',
  };
  return sign(payload, JWT_SECRET, options);
};

// Sign refresh token
export const signRefreshToken = (userId: string | number): string => {
  const payload = { sub: userId, type: 'refresh' };
  const options: SignOptions = {
    expiresIn: REFRESH_TOKEN_EXPIRY as unknown as number,
    algorithm: 'HS256',
  };
  return sign(payload, JWT_SECRET, options);
};

// Verify any token (access or refresh)
export const verifyToken = <T = any>(token: string): T | null => {
  try {
    const options: VerifyOptions = { algorithms: ['HS256'] };
    return verify(token, JWT_SECRET, options) as T;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
        return null;
      }
    }
    throw error;
  }
};

// Generate tokens for email verification or password reset
export const generateEmailVerificationToken = (): string => randomString(32);
export const generatePasswordResetToken = (): string => randomString(32);
