import { app } from './app';
import { connectMongo } from './config/mongo';
import { connectPostgres } from './config/postgres';
import dotenv from 'dotenv';
dotenv.config();

(async () => {
  await connectMongo();
  // await connectPostgres();

  const port = process.env.PORT || 4000;
  app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
})();
