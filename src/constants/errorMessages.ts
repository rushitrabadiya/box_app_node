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
  INVALID_RESET_TOKEN = 'Invalid reset token',
}

export const CATEGORY_ERROR_MESSAGES = {
  CATEGORY_ALREADY_EXISTS: 'Category with this name already exists.',
  CATEGORY_NOT_FOUND: 'Category not found.',
};

export const GROUND_REGISTRATION_ERROR_MESSAGES = {
  NOT_FOUND: 'Ground registration not found.',
};

export const GROUND_HAS_CATEGORIES_ERROR_MESSAGES = {
  NOT_FOUND: 'Ground category not found.',
  ALREADY_EXISTS: 'Ground category with this name already exists.',
  INVALID_CATEGORY: 'Invalid category ID provided.',
  INVALID_GROUND: 'Invalid ground ID provided.',
  INVALID_WORKING_DAY: 'Invalid working day data provided.',
};

export const SAMPLE_ERROR_MESSAGES = {
  NOT_FOUND: 'Sample not found.',
  ALREADY_EXISTS: 'Sample with this name already exists.',
  INVALID_DATA: 'Invalid data provided for sample.',
};
export const SLOT_ERROR_MESSAGES = {
  NOT_FOUND: 'Slot not found.',
  ALREADY_EXISTS: 'Slot already exists for this ground and time.',
  INVALID_DATA: 'Invalid data provided for slot.',
  INVALID_GROUND: 'Invalid ground ID provided.',
};
export const MEDIA_ERROR_MESSAGES = {
  FILE_REQUIRED: 'No file was uploaded',
  FILE_PATH_REQUIRED: 'File path is required',
  FILE_NOT_FOUND: 'File not found',
};
