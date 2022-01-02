import mongoose, { Document } from 'mongoose';

export interface IOrder extends Document {
    vendorId: typeof mongoose.Types.ObjectId;
    customerId: typeof mongoose.Types.ObjectId;
    productId: typeof mongoose.Types.ObjectId;
    quantity: number;
    status: string;
}

const OrderSchema = new mongoose.Schema<IOrder>(
    {
        vendorId: {
            type: mongoose.Types.ObjectId,
            required: [true, 'vendor id is required'],
        },

        customerId: {
            type: mongoose.Types.ObjectId,
            required: [true, 'customer id is required'],
        },

        productId: {
            type: mongoose.Types.ObjectId,
            required: [true, 'product id is required'],
        },

        quantity: {
            type: Number,
            required: [true, 'product quantity is required'],
        },

        status: {
            type: String,
            enum: ['pending', 'delivered', 'cancelled'],
            default: 'pending',
        },
    },
    { timestamps: true }
);

const Order = mongoose.model('Order', OrderSchema);

export default Order;
