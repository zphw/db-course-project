import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import indexRouter from './routes/index';
import authRouter from './routes/auth';
import customerRouter from './routes/customer';
import staffRouter from './routes/staff';


const app = express();

app.use(cors());


app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/customer', customerRouter);
app.use('/staff', staffRouter);

export default app;
