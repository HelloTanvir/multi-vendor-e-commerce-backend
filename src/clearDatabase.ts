import dotenv from 'dotenv';
import mongoose from 'mongoose';
// models
import RefreshToken from './models/refreshToken.model';
import User from './models/user.model';
import redisClient from './utils/redisClient';

// load environment variables
dotenv.config();

// connect to db
mongoose.connect(process.env.MONGO_URL);

// delete data
const deleteData = async () => {
    try {
        redisClient.flushall('ASYNC', (err, succeeded) => {
            console.log(`redis collection cleared: ${succeeded}`);
        });
        await User.deleteMany();
        await RefreshToken.deleteMany();
        console.log('data destroyed...');
        process.exit();
    } catch (error) {
        console.error(error);
    }
};

// command:
//      yarn clear-database

if (process.argv[2] === '-d') {
    deleteData();
}
