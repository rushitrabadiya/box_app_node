export enum ErrorMessage {
  NAME_REQUIRED = 'Name is required',
  INTERNAL_ERROR = 'Internal server error',
  // add more error messages here
}
export enum USER_ERROR_MESSAGES {
  USER_NOT_FOUND = 'User not found',
  USER_ALREADY_EXISTS = 'User already exists',
  ADMIN_ALREADY_EXITS = 'Admin already exists',
}
export enum AUTH_ERROR_MESSAGES {
  INVALID_OTP = 'Invalid OTP',
  OTP_EXPIRED = 'OTP expired',
  INVALID_CREDENTIALS = 'Invalid credentials',
  PLEASE_VERIFY_YOUR_EMAIL_AND_PHONE = 'Please verify your email and phone',
  MISSING_TOKEN = 'Missing token',
  INVALID_TOKEN = 'Invalid token',
  USER_NOT_VERIFIED = 'User not verified',
  INVALID_REFRESH_TOKEN = 'Invalid refresh token',
  MISSING_REFRESH_TOKEN = 'Missing refresh token',
  NOT_ADMIN = 'You are not an admin',
}

export const CATEGORY_ERROR_MESSAGES = {
  CATEGORY_ALREADY_EXISTS: 'Category with this name already exists.',
  CATEGORY_NOT_FOUND: 'Category not found.',
};

export const GROUND_REGISTRATION_ERROR_MESSAGES = {
  NOT_FOUND: 'Ground registration not found.',
};
