// external imports
import cookiePraser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

const app = express();

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

const PORT = process.env.PORT || 5000;
app.listen(+PORT, () => {
    console.log(`app is running on port: ${PORT}`);
});
