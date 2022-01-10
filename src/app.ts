// external imports
import cookiePraser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import hpp from 'hpp';
import mongoose from 'mongoose';
import morgan from 'morgan';
import redis from 'redis';
import xss from 'xss-clean';
// internal imports
import errorHandler from './middlewares/errorHandler';
import collectionRouter from './routes/collection.route';
import couponRouter from './routes/coupon.route';
import customerRouter from './routes/customer.route';
import orderRouter from './routes/order.route';
import productRouter from './routes/product.route';
import vendorRouter from './routes/vendor.route';

const app = express();

// load environment variables
dotenv.config();

// body and cookie parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookiePraser());

// sanitizes user-supplied data to prevent MongoDB Operator Injection
app.use(ExpressMongoSanitize());

// secure app by setting various HTTP headers
app.use(helmet());

// middleware to sanitize user input coming from POST body, GET queries, and url params
app.use(xss());

// middleware to protect against HTTP Parameter Pollution attacks
app.use(hpp());

// prevent cors issue
// app.use(
//     cors({
//         origin: process.env.FRONTEND_URL,
//         credentials: true,
//     })
// );

// development
app.use(
    cors({
        origin: [
            'http://localhost:3000',
            'http://localhost:8080',
            'https://quirky-meninsky-8c97db.netlify.app',
            'https://sellbeez-git-desktop-knockoutez.vercel.app',
            'https://sellbee-user.netlify.app',
        ],
        credentials: true,
    })
);

// log request information
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

// mount routes
app.use('/v1/vendor', vendorRouter);
app.use('/v1/customer', customerRouter);
app.use('/v1/products', productRouter);
app.use('/v1/coupon', couponRouter);
app.use('/v1/collections', collectionRouter);
app.use('/v1/order', orderRouter);

// handle errors
app.use(errorHandler);

// connect to database and start the app
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log('MongoDB Connected Successfully');

        // for localhost
        // const client = redis.createClient();
        const client = redis.createClient({
            url: process.env.REDIS_URL,
            password: process.env.REDIS_PASSWORD,
        });

        (global as any).redisClient = client;

        const PORT = process.env.PORT || 5000;
        app.listen(+PORT, () => {
            console.log(`app is running on port: ${PORT}`);
        });
    })
    .catch((err: any) => {
        console.error(err);
        console.log('Failed to connect Database');
    });

// called when mongodb is disconnected
mongoose.connection.on('disconnected', () => {
    console.log('Database Disconnected');
});

// called when closing the server (when pressing ctrl + c)
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('server stopped');
    process.exit(0);
});
