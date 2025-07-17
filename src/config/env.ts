import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
  API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:5000',
};
