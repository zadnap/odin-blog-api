import express from 'express';
import { authRouter, commentRouter, postRouter, userRouter } from './routes';

const app = express();

app.use('/auth', authRouter);
app.use('/posts', postRouter);
app.use('/users', userRouter);
app.use('/comments', commentRouter);

export default app;
