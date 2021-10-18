import mongoose, { Document } from 'mongoose';

interface IRefreshToken extends Document {
    userId: string;
    refreshToken: string;
}

const TokenSchema = new mongoose.Schema<IRefreshToken>(
    {
        userId: {
            type: String,
            required: [true, 'user id is required'],
        },

        refreshToken: {
            type: String,
            required: [true, 'refresh token is required'],
        },
    },
    { timestamps: true }
);

const RefreshToken = mongoose.model('Token', TokenSchema);

export default RefreshToken;
