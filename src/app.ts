// external imports
import cookiePraser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
// internal imports
import errorHandler from './middlewares/errorHandler';
import authRouter from './routes/auth.route';

const app = express();

// load environment variables
dotenv.config();

// body and cookie parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookiePraser());

// prevent cors issue
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);

// log request information
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

// mount routes
app.use('/v1/auth', authRouter);

// handle errors
app.use(errorHandler);

// connect to database and start the app
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log('Database Connected Successfully');

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
