import bcrypt from 'bcryptjs';
import mongoose, { Document } from 'mongoose';

interface IOTP extends Document {
    number: string;
    OTP: string;
    createdAt: number | Date;
    matchOTP: (enteredOTP: string) => Promise<boolean>;
}

const OTPSchema = new mongoose.Schema<IOTP>(
    {
        number: {
            type: String,
            required: [true, 'Please input your number'],
        },
        OTP: {
            type: String,
            required: [true, 'Please input your OTP'],
        },
        createdAt: {
            type: Date,
            // expires: 180,
            default: Date.now,
            // index: {
            //     expires: 180,
            //     expireAfterSeconds: 180,
            // },
        },
    },
    { timestamps: true }
);

OTPSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 });

// hash otp before saving in database
OTPSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10);
    this.OTP = await bcrypt.hash(this.OTP, salt);
});

// match user given otp for access
OTPSchema.methods.matchOTP = async function (enteredOTP: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(enteredOTP, this.OTP);
    return isMatch;
};

const OTP = mongoose.model('Otp', OTPSchema);

export default OTP;
