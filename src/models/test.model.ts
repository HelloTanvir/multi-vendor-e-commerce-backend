import mongoose, { Document } from 'mongoose';

export interface ITest extends Document {
    name: string;
    email: string;
}

const TestSchema = new mongoose.Schema<ITest>(
    {
        name: {
            type: String,
            required: [true, 'name is required'],
        },

        email: {
            type: String,
            required: [true, 'email is required'],
        },
    },
    { timestamps: true }
);

const Test = mongoose.model('Test', TestSchema);

export default Test;
