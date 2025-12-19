import express from 'express';
import dotenv from 'dotenv';
import { connectToDatabase } from './db.js';
import authRouter from './routes/auth.js';
import signupRouter from './routes/signup.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/auth', authRouter);
app.use('/api/signup', signupRouter);

const PORT = process.env.PORT ?? 3001;

export async function startServer() {
  await connectToDatabase(process.env.MONGODB_URI);
  return app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

// For tests, we export the app without starting the listener
export default app;

if (process.env.NODE_ENV !== 'test') {
  startServer().catch((err) => {
    console.error('Failed to start', err);
    process.exit(1);
  });
}

