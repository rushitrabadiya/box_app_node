export const SIXTY = 60 as const;
export const ONE_HUNDRED = 100 as const;
export const ONE_THOUSAND = 1000 as const;

// Time helpers (in milliseconds)
export const SECOND_MS = SIXTY * (ONE_THOUSAND / SIXTY); // 1 second
export const MINUTE_MS = SIXTY * ONE_THOUSAND; // 60 seconds
export const FIFTEEN_MINUTES_MS = 15 * MINUTE_MS;

export const REFRESH_TOKEN_EXPIRY_CALCULATION = MINUTE_MS;
export const ACCESS_TOKEN_EXPIRY_CALCULATION = SIXTY * SIXTY * 24;

// Common defaults for paginated API responses
export enum PAGINATION {
  LIMIT = 10,
  PAGE = 1,
}

export const FRONTEND_URL = 'https://box-app-node.onrender.com/api/v1';
export const SELF_URL = 'https://box-app-node.onrender.com/';

export const OTP_EXPIRY_MINUTES = 5 as const;

export const GROUND_REGISTRATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export const GROUND_HAS_CATEGORIES_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export const WEEK_DAYS_ENUM = {
  MONDAY: 'monday',
  TUESDAY: 'tuesday',
  WEDNESDAY: 'wednesday',
  THURSDAY: 'thursday',
  FRIDAY: 'friday',
  SATURDAY: 'saturday',
  SUNDAY: 'sunday',
};

export const BOOKING_STATUS = {
  BOOKED: 'booked',
  CANCELLED: 'cancelled',
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
};

export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  PAYPAL: 'paypal',
  STRIPE: 'stripe',
  CASH: 'cash',
};

export const TOKEN_TYPES = {
  ACCESS: 'access',
  REFRESH: 'refresh',
  RESET_PASSWORD: 'reset_password',
} as const;
