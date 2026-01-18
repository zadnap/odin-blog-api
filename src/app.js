import express from 'express';
import { authRouter, postRouter, userRouter } from './routes/index.js';

const app = express();

app.use(express.json());

app.use('/auth', authRouter);
app.use('/posts', postRouter);
app.use('/users', userRouter);

export default app;
