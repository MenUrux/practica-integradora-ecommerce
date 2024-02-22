import express from 'express';
import path from 'path';
import hbs from './config/handlebars.config.js';

import sessionConfig from './config/session.config.js';
import initializePassport from './config/passport.config.js';
import passport from 'passport'

import cors from 'cors';
import { addLogger } from './utils/logger.js';

import { init as initPassport } from './config/passport.config olld.js';

import indexRouter from './routers/views/index.router.js';
import usersRouter from './routers/api/users.router.js';
import authRouter from './routers/api/auth.router.js';
import productsRouter from './routers/api/products.router.js';
import productsViewRouter from './routers/views/products.router.js';
import notificationsRouter from './routers/api/notifications.router.js';
import userViewRouter from './routers/views/users.router.js';
import sessionsRouter from './routers/api/sessions.router.js';

import debugRouter from './routers/views/debug.router.js';
import loggersRouter from './routers/api/loggers.router.js';
import mockingRouter from './routers/api/mocking.router.js';

import { __dirname } from './utils/utils.js';
import { errorHandlerMiddleware } from './middlewares/error-handler.middleware.js';

const app = express();
const whiteList = process.env.ORIGINS_ALLOWED.split(',');
console.log(process.env.ORIGINS_ALLOWED);

initializePassport();
app.use(sessionConfig);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));

app.use(cors(
    {
        origin: whiteList,
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
));
app.use(sessionConfig);

initPassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(addLogger)
app.use('/', indexRouter, userViewRouter, debugRouter, productsViewRouter);
app.use('/api/loggerTest', loggersRouter);
app.use('/api/mockingproducts', mockingRouter);
app.use('/api/auth', authRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);
app.use('/api/notifications', notificationsRouter);
// app.use('/api/orders', ordersRouter);

app.use(errorHandlerMiddleware);

export default app;