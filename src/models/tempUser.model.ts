import mongoose, { Document } from 'mongoose';
import { UserData } from './user.model';

export interface ITempUser extends UserData, Document {
    createdAt: number | Date;
}

const TempUserSchema = new mongoose.Schema<ITempUser>(
    {
        email: {
            type: String,
            required: [true, 'Please input your email'],
            lowercase: true,
            unique: true,
        },
        firstName: {
            type: String,
            required: [true, 'Please input your first name'],
        },
        lastName: {
            type: String,
            required: [true, 'Please input your last name'],
        },
        address: {
            type: String,
            required: [true, 'Please input your address'],
        },
        number: {
            type: String,
            required: [true, 'Please input your number'],
        },
        createdAt: {
            type: Date,
            // expires: 60,
            default: Date.now,
            // index: {
            //     expires: 180,
            //     expireAfterSeconds: 180,
            // },
        },
    },
    { timestamps: true }
);

TempUserSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 });

const TempUser = mongoose.model('Temp-user', TempUserSchema);

export default TempUser;
