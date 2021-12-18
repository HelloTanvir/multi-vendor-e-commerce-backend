import mongoose, { Document } from 'mongoose';

export interface ICoupon extends Document {
    vendorId: typeof mongoose.Types.ObjectId;
    name: string;
    amount: number;
    expiryDate: Date;
    limitPerCoupon: number;
    limitPerUser: number;
    productIds: string[];
}

const CouponSchema = new mongoose.Schema<ICoupon>(
    {
        vendorId: {
            type: mongoose.Types.ObjectId,
            required: [true, 'vendor id is required'],
        },

        name: {
            type: String,
            required: [true, 'Coupon name is required'],
        },

        amount: {
            type: Number,
            required: [true, 'Coupon amount is required'],
        },

        expiryDate: {
            type: Date,
            required: [true, 'Coupon expiry date is required'],
        },

        limitPerCoupon: {
            type: Number,
            required: [true, 'Usage limit per coupon is required'],
        },

        limitPerUser: {
            type: Number,
            required: [true, 'Usage limit per user is required'],
        },

        productIds: {
            type: [String],
            required: [true, 'Product(s) required'],
        },
    },
    { timestamps: true }
);

const Coupon = mongoose.model('Coupon', CouponSchema);

export default Coupon;
