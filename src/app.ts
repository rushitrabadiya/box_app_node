import express from 'express';
import routes from './routes';
import cors from 'cors';
import { logger } from './middleware/logger';
import { globalErrorHandler } from './middleware/errorHandler';
import { applySecurity } from './middleware/security';
import { SELF_URL } from './constants/app';
import './helpers/corn-jobs';
import path from 'path';

export const app = express();

app.use(cors());

// security & perf helpers
applySecurity(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(logger);

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api/v1', routes);
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the Box API',
    version: '1.0.0',
  });
});

setInterval(
  () => {
    fetch(SELF_URL)
      .then(() => console.log('✅ Self ping sent'))
      .catch((err) => console.error('❌ Self ping failed:', err.message));
  },
  1000 * 60 * 5,
);

app.use(globalErrorHandler);
// app.use(errorHandler);
