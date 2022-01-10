import dotenv from 'dotenv';
import mongoose from 'mongoose';
import redis from 'redis';
import Collection from './models/collection.model';
import Coupon from './models/coupon.model';
import Customer from './models/customer.model';
import Order from './models/order.model';
// models
import Product from './models/product.model';
import RefreshToken from './models/refreshToken.model';
import Vendor from './models/vendor.model';
import s3 from './utils/s3';

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
        // delete all images from aws S3 bucket
        const keys: { Key: string }[] = [];
        const products = await Product.find();
        if (products.length) {
            products.forEach((product) => {
                keys.push({ Key: product.s3Key });
            });
            await s3
                .deleteObjects({ Bucket: 'sellbeez-products', Delete: { Objects: keys } })
                .promise();
            console.log('all images deleted');
        }

        // delete all data from redis
        redisClient.flushall('ASYNC', (err, succeeded) => {
            console.log(`redis collection cleared: ${succeeded}`);
        });

        // delete all users
        await Vendor.deleteMany();

        // delete all refresh tokens
        await RefreshToken.deleteMany();

        // delete all products
        await Product.deleteMany();

        // delete all collection
        await Collection.deleteMany();

        // delete all coupon
        await Coupon.deleteMany();

        // delete all customer
        await Customer.deleteMany();

        // delete all order
        await Order.deleteMany();

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
