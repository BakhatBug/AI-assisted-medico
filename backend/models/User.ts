import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    xp: number;
    level: number;
    streak: number;
    lastLoginDate: Date;
    matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        xp: {
            type: Number,
            default: 0,
        },
        level: {
            type: Number,
            default: 1,
        },
        streak: {
            type: Number,
            default: 0,
        },
        lastLoginDate: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) {
        next();
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;
