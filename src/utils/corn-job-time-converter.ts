import { FlexibleCronJob } from '../interfaces/base.interface';

export const convertToCron = ({ every, time, dayOfMonth }: FlexibleCronJob): string => {
  const [hour = '0', minute = '0'] = (time ?? '00:00').split(':');

  switch (every) {
    case 'minute':
      return '* * * * *'; // Every minute
    case 'hour':
      return '0 * * * *'; // At minute 0 of every hour
    case 'day':
      return `${minute} ${hour} * * *`; // Daily at given time
    case 'month':
      if (!dayOfMonth || dayOfMonth < 1 || dayOfMonth > 31) {
        throw new Error('Invalid or missing dayOfMonth for monthly job.');
      }
      return `${minute} ${hour} ${dayOfMonth} * *`; // Monthly on given day at given time
    default:
      throw new Error(`Unsupported frequency: ${every}`);
  }
};
