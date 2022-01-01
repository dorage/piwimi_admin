import express from 'express';
import helmet from 'helmet';
import session from 'express-session';
import swaggerUI from 'swagger-ui-express';
import path from 'path';

import mainRouter from './routers/main';
import reviewRouter from './routers/review';
import psychotestRouter from './routers/psychotest';
import apiRouter from './routers/api';
import morgan from 'morgan';
import { swaggerDocument } from './configs/swagger';
import pool from './db';
import { ENV } from './configs';
import connectPgSimple from 'connect-pg-simple';

const app = express();

app.set('view engine', 'pug');
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
    session({
        cookie: {
            secure: true,
            maxAge: 90 * 24 * 60 * 60 * 1000,
        },
        secret: ENV.cookieSecret,
        resave: true,
        saveUninitialized: true,
        store: new (connectPgSimple(session))({
            pool: pool,
            conString: ENV.databaseURL,
        }),
    }),
);
app.use(morgan('dev'));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(mainRouter);
app.use('/psychotest', psychotestRouter);
app.use('/review', reviewRouter);
app.use('/api', apiRouter);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

export default app;
