/*
 * Common helper functions used project-wide.
 * Feel free to extend this file with more domain-specific utilities.
 */

import crypto from 'crypto';

/** Pause execution for a given amount of milliseconds */
export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/** Check whether a value is defined (not null/undefined) */
export const isDefined = <T>(v: T | null | undefined): v is T => v !== null && v !== undefined;

/** Convert a string to Title Case */
export const toTitleCase = (text: string): string =>
  text.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());

/** Safely JSON.parse, returning null on failure */
export const safeJsonParse = <T = any>(str: string): T | null => {
  try {
    return JSON.parse(str) as T;
  } catch {
    return null;
  }
};

/** Simple object.key picker */
export const pick = <T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  keys.forEach((k) => {
    if (k in obj) result[k] = obj[k];
  });
  return result;
};

/** Simple object.key omitter */
export const omit = <T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
  const result = { ...obj } as T;
  keys.forEach((k) => {
    delete (result as any)[k];
  });
  return result as Omit<T, K>;
};

/** Generate a cryptographically-secure random string */
export const randomString = (length = 32): string => crypto.randomBytes(length / 2).toString('hex');

/** Create a SHA-256 hash of a string */
export const createHashString = (token: string) =>
  crypto.createHash('sha256').update(token).digest('hex');

/** Calculate pagination offset */
export const getPagination = (page = 1, limit = 10) => ({
  limit,
  offset: (page - 1) * limit,
});

export const generateOtp = (length = 6): string => {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  const random = crypto.randomInt(min, max + 1);
  return random.toString();
};
