import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import indexRouter from './routes/index';
import authRouter from './routes/auth';
import customerRouter from './routes/customer';
import staffRouter from './routes/staff';


const app = express();

app.use(helmet());

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/customer', customerRouter);
app.use('/staff', staffRouter);

export default app;
