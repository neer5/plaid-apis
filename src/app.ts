import express from 'express';
import plaidRoutes from './routes/plaid';
import { json, urlencoded } from 'body-parser';
import config from 'config';
import cors from 'cors';

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(
  cors({
    origin: (config.get('CORS_ORIGIN') as string).split(',')
  })
);
app.use('/api/plaid', plaidRoutes);

app.use((err: Error, req: express.Request, res: express.Response) => {
  res.status(500).json({ message: err.message });
});

const port = config.get('PORT') || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
