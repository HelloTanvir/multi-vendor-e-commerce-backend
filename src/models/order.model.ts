import mongoose, { Document } from 'mongoose';

export interface IOrder extends Document {
    customerId: typeof mongoose.Types.ObjectId;
    products: {
        vendorId: typeof mongoose.Types.ObjectId;
        productId: typeof mongoose.Types.ObjectId;
        quantity: number;
    }[];
    status: string;
    isCheckedOut: boolean;
}

const OrderSchema = new mongoose.Schema<IOrder>(
    {
        customerId: {
            type: mongoose.Types.ObjectId,
            required: [true, 'customer id is required'],
        },

        products: {
            type: [
                {
                    vendorId: {
                        type: mongoose.Types.ObjectId,
                        required: [true, 'vendor id is required'],
                    },
                    productId: {
                        type: mongoose.Types.ObjectId,
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

        status: {
            type: String,
            enum: ['pending', 'delivered', 'cancelled'],
            default: 'pending',
        },

        isCheckedOut: {
            type: Boolean,
            default: false,
            select: false,
        },
    },
    { timestamps: true }
);

const Order = mongoose.model('Order', OrderSchema);

export default Order;
