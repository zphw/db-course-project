import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import indexRouter from './routes/index';
import authRouter from './routes/auth';
import customerRouter from './routes/customer';
import staffRouter from './routes/staff';
import path from 'path';

const app = express();

const options: cors.CorsOptions = {
    allowedHeaders: [
        'Origin',
        'X-Requested-Width',
        'Content-Type',
        'Accept',
        'X-Access-Token',
    ],
    credentials: true,
    methods: 'GET, HEAD, OPTIONS, PUT, PATCH, POST, DELETE',
    preflightContinue: false,
};

app.use(cors(options));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('*', (req, res) => {
    res.sendFile(path.resolve('client', 'build', 'index.html'));
});
app.get('*', (req, res) => {
    res.sendFile(path.resolve('client', 'build', 'index.html'));
});

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/customer', customerRouter);
app.use('/staff', staffRouter);

export default app;
