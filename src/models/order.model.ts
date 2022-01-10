import mongoose, { Document } from 'mongoose';
import Product from './product.model';

export interface IOrder extends Document {
    customerId: typeof mongoose.Types.ObjectId;
    vendorId: typeof mongoose.Types.ObjectId;
    products: {
        product: typeof Product;
        quantity: number;
    }[];
    orderStatus: string;
}

const OrderSchema = new mongoose.Schema<IOrder>(
    {
        customerId: {
            type: mongoose.Types.ObjectId,
            required: [true, 'customer id is required'],
        },

        vendorId: {
            type: mongoose.Types.ObjectId,
            required: [true, 'vendor id is required'],
        },

        products: {
            type: [
                {
                    product: {
                        type: Product,
                        required: [true, 'product id is required'],
                    },
                    quantity: {
                        type: Number,
                        required: [true, 'product quantity is required'],
                    },
                },
            ],
            required: [true, 'products are required'],
        },

        orderStatus: {
            type: String,
            enum: ['pending', 'delivered', 'cancelled'],
            default: 'pending',
        },
    },
    { timestamps: true }
);

const Order = mongoose.model('Order', OrderSchema);

export default Order;
