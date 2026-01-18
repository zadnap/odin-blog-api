import express from 'express';
import { authRouter, postRouter } from './routes/index.js';

const app = express();

app.use(express.json());

app.use('/auth', authRouter);
app.use('/posts', postRouter);

export default app;
