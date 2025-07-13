import cron from 'node-cron';
import { generateSlotsAutomatically } from '../controllers/slot.controller';
import { FlexibleCronJob } from '../interfaces/base.interface';
import { convertToCron } from '../utils/corn-job-time-converter';

const currentEnv = process.env.NODE_ENV || 'development';

const cronJobs: FlexibleCronJob[] = [
  {
    name: 'Slot Generator',
    every: 'day',
    time: '00:00',
    job: () => {
      console.log('⏳ Running daily slot generator...');
      generateSlotsAutomatically();
    },
    allowedEnvironments: ['production', 'staging'],
  },
  {
    name: 'Cleanup Old Slots',
    every: 'day',
    time: '03:00',
    job: () => {
      console.log('🧹 Cleaning up old slots...');
      // cleanupOldSlots();
    },
    allowedEnvironments: ['development', 'production'],
  },
];
cronJobs.forEach((jobConfig) => {
  const { name, every, time, dayOfMonth, job, allowedEnvironments } = jobConfig;

  if (allowedEnvironments.includes(currentEnv)) {
    try {
      const cronExpression = convertToCron({ every, time, dayOfMonth } as FlexibleCronJob);
      cron.schedule(cronExpression, job);
      console.log(`✅ Scheduled: "${name}" (${cronExpression}) in ${currentEnv}`);
    } catch (error) {
      console.error(`❌ Failed to schedule "${name}": ${error}`);
    }
  } else {
    console.log(`⏭️ Skipped: "${name}" (Not allowed in ${currentEnv})`);
  }
});

// // cron/cronJobs.ts
// import cron from 'node-cron';
// import { generateSlotsAutomatically } from '../controllers/slot.controller';
// import { FlexibleCronJob } from '../interfaces/base.interface';

// const currentEnv = process.env.NODE_ENV || 'development';

// const cronJobs: FlexibleCronJob[] = [
//   {
//     name: 'Slot Generator',
//     cronExpression: '0 0 * * *', // every day at midnight
//     job: () => {
//       console.log('⏳ Running daily slot generator...');
//       generateSlotsAutomatically();
//     },
//     allowedEnvironments: ['production', 'staging'],
//   },
//   // {
//   //   name: 'Cleanup Old Slots',
//   //   cronExpression: '0 3 * * *', // every day at 3AM
//   //   job: () => {
//   //     console.log('🧹 Cleaning up old slots...');
//   //     cleanupOldSlots();
//   //   },
//   //   allowedEnvironments: ['development', 'production'],
//   // },
//   // Add more jobs here
// ];

// // Scheduler
// cronJobs.forEach(({ name, cronExpression, job, allowedEnvironments }) => {
//   if (allowedEnvironments.includes(currentEnv)) {
//     cron.schedule(cronExpression, job);
//     console.log(`✅ Scheduled: "${name}" in ${currentEnv}`);
//   } else {
//     console.log(`⏭️ Skipped: "${name}" (Not allowed in ${currentEnv})`);
//   }
// });

// cron/cronJobs.ts
