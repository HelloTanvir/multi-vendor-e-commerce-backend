import mongoose, { Document } from 'mongoose';

interface IProduct extends Document {
    vendorId: string;
    image: string;
    name: string;
    weight: string;
    regularPrice: string;
    salesPrice: string;
    inventory: string;
    description: string;
}

const ProductSchema = new mongoose.Schema<IProduct>(
    {
        vendorId: {
            type: String,
            required: [true, 'vendor id is required'],
        },

        image: {
            type: String,
            required: [true, 'image is required'],
        },

        name: {
            type: String,
            required: [true, 'product name is required'],
        },

        weight: {
            type: String,
            required: [true, 'product weight is required'],
        },

        regularPrice: {
            type: String,
            required: [true, 'regular price is required'],
        },

        salesPrice: {
            type: String,
            required: [true, 'sales price is required'],
        },

        inventory: {
            type: String,
            required: [true, 'product inventory is required'],
        },

        description: {
            type: String,
            required: [true, 'product description is required'],
        },
    },
    { timestamps: true }
);

const Product = mongoose.model('Product', ProductSchema);

export default Product;
