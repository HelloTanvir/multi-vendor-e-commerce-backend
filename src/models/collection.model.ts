import mongoose, { Document } from 'mongoose';

export interface ICollection extends Document {
    vendorId: typeof mongoose.Types.ObjectId;
    name: string;
    productIds: string[];
}

const CollectionSchema = new mongoose.Schema<ICollection>(
    {
        vendorId: {
            type: mongoose.Types.ObjectId,
            required: [true, 'vendor id is required'],
        },

        name: {
            type: String,
            required: [true, 'Collection name is required'],
        },

        productIds: {
            type: [String],
            required: [true, 'Product(s) required'],
        },
    },
    { timestamps: true }
);

const Collection = mongoose.model('Collection', CollectionSchema);

export default Collection;
