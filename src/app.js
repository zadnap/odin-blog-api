import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.routes.js';
import postRouter from './routes/post.routes.js';
import { errorHandler } from './middlewares/index.js';
import { allowedOrigins } from './config/cors.config.js';

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS blocked'));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.use('/auth', authRouter);
app.use('/posts', postRouter);

app.use(errorHandler);

export default app;
