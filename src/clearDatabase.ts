import dotenv from 'dotenv';
import mongoose from 'mongoose';
import redis from 'redis';
// models
import RefreshToken from './models/refreshToken.model';
import User from './models/user.model';

// load environment variables
dotenv.config();

// connect to db
mongoose.connect(process.env.MONGO_URL);

// connect to redis
const redisClient = redis.createClient({
    url: process.env.REDIS_URL,
    password: process.env.REDIS_PASSWORD,
});

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
