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
import cartsRouter from './routers/api/carts.router.js';
import productsRouter from './routers/api/products.router.js';
import productsViewRouter from './routers/views/products.router.js';
import notificationsRouter from './routers/api/notifications.router.js';
import userViewRouter from './routers/views/users.router.js';
import authViewRouter from './routers/views/auth.router.js';
import sessionsRouter from './routers/api/sessions.router.js';
import documentsRouter from './routers/api/documents.router.js';
import ticketRouter from './routers/api/ticket.router.js';
import paymentsViewRouter from './routers/views/payments.router.js';
import thankyouViewRouter from './routers/views/thankyou.router.js';

import managementViewRouter from './routers/views/management.router.js';

import debugRouter from './routers/views/debug.router.js';
import adminRouter from './routers/views/admin.router.js';
import loggersRouter from './routers/api/loggers.router.js';
import mockingRouter from './routers/api/mocking.router.js';

import { __dirname } from './utils/utils.js';
import { errorHandlerMiddleware } from './middlewares/error-handler.middleware.js';

import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import { swaggerOptions } from './config/swagger.config.js';


const app = express();

const specs = swaggerJsDoc(swaggerOptions);
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

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

initPassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(addLogger)
app.use('/', indexRouter, adminRouter, userViewRouter, debugRouter, productsViewRouter, managementViewRouter, authViewRouter, paymentsViewRouter, thankyouViewRouter);
app.use('/api/loggerTest', loggersRouter);
app.use('/api/mockingproducts', mockingRouter);
app.use('/api/auth', authRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/users', usersRouter);
app.use('/api/documents', documentsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/products', productsRouter);
app.use('/api/tickets', ticketRouter);
app.use('/api/notifications', notificationsRouter);
// app.use('/api/orders', ordersRouter);

app.use(errorHandlerMiddleware);

export default app;
