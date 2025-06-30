import express from 'express';
import routes from './routes';
import { logger } from './middleware/logger';
import { errorHandler } from './middleware/errorHandler';
import { applySecurity } from './middleware/security';

export const app = express();

// security & perf helpers
applySecurity(app);

app.use(express.json());

app.use(logger);
app.use('/api/v1', routes);
app.use(errorHandler);
