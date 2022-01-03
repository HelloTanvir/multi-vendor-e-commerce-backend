import mongoose, { Document } from 'mongoose';

export interface IProduct extends Document {
    vendorId: typeof mongoose.Types.ObjectId;
    image: string;
    s3Key: string;
    name: string;
    regularPrice: number;
    salesPrice: number;
    inventory: number;
    description: string;
    status: boolean;
}

const ProductSchema = new mongoose.Schema<IProduct>(
    {
        vendorId: {
            type: mongoose.Types.ObjectId,
            required: [true, 'vendor id is required'],
        },

        image: {
            type: String,
            required: [true, 'image is required'],
        },

        s3Key: {
            type: String,
            required: [true, 'S3-key is required'],
        },

        name: {
            type: String,
            required: [true, 'product name is required'],
        },

        regularPrice: {
            type: Number,
            required: [true, 'regular price is required'],
        },

        salesPrice: {
            type: Number,
            required: [true, 'sales price is required'],
        },

        inventory: {
            type: Number,
            required: [true, 'product inventory is required'],
        },

        description: {
            type: String,
            required: [true, 'product description is required'],
        },

        status: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Product = mongoose.model('Product', ProductSchema);

export default Product;
