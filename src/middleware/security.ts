import { Application } from 'express';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

// Apply common security & performance middleware
export const applySecurity = (app: Application) => {
  // Sets various HTTP headers to help protect the app
  app.use(helmet());

  // Gzip/deflate response bodies for better performance
  app.use(compression());

  // Basic rate-limiting: 100 requests per 15-minute window per IP
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 100,
      standardHeaders: 'draft-7',
      legacyHeaders: false,
    }),
  );
};
