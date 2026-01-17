import 'dotenv/config';
import app from './app.js';

app.listen(process.env.EXPRESS_PORT, () => {
  console.log(`Express app is listening to ${process.env.EXPRESS_PORT}`);
});
