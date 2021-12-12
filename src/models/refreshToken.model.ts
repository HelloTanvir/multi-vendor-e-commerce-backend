import bcrypt from 'bcryptjs';
import mongoose, { Document } from 'mongoose';

interface IRefreshToken extends Document {
    userId: string;
    refreshToken: string;
    matchRefreshToken: (reqRefreshToken: string) => Promise<boolean>;
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

// hash refresh token before save
TokenSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10);
    this.refreshToken = await bcrypt.hash(this.refreshToken, salt);
});

// match refresh token
TokenSchema.methods.matchRefreshToken = async function (reqRefreshToken: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(reqRefreshToken, this.refreshToken);
    return isMatch;
};

const RefreshToken = mongoose.model('Token', TokenSchema);

export default RefreshToken;
