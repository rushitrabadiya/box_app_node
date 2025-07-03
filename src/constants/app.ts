export const SIXTY = 60 as const;
export const ONE_HUNDRED = 100 as const;
export const ONE_THOUSAND = 1000 as const;

// Common defaults for paginated API responses
export enum PAGINATION {
  LIMIT = 10,
  PAGE = 1,
}

// Time helpers (in milliseconds)
export const SECOND_MS = SIXTY * (ONE_THOUSAND / SIXTY); // 1 second
export const MINUTE_MS = SIXTY * ONE_THOUSAND; // 60 seconds
export const FIFTEEN_MINUTES_MS = 15 * MINUTE_MS;

export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

export const OTP_EXPIRY_MINUTES = 5 as const;

export const GROUND_REGISTRATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;
