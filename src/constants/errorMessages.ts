export enum ErrorMessage {
  NAME_REQUIRED = 'Name is required',
  INTERNAL_ERROR = 'Internal server error',
  // add more error messages here
}
export enum USER_ERROR_MESSAGES {
  USER_NOT_FOUND = 'User not found',
  USER_ALREADY_EXISTS = 'User already exists',
}
export enum AUTH_ERROR_MESSAGES {
  INVALID_OTP = 'Invalid OTP',
  OTP_EXPIRED = 'OTP expired',
  INVALID_CREDENTIALS = 'Invalid credentials',
  PLEASE_VERIFY_YOUR_EMAIL_AND_PHONE = 'Please verify your email and phone',
  MISSING_TOKEN = 'Missing token',
  INVALID_TOKEN = 'Invalid token',
}
