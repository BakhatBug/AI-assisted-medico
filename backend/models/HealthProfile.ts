import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IHealthProfile extends Document {
    user: mongoose.Types.ObjectId;
    age: number;
    gender: string;
    height: number;
    weight: number;
    activityLevel: string;
    waterIntake: number;
    goal: string;
    lastDietPlan?: any;
    history?: Array<{
        date: Date;
        weight: number;
        height: number;
        age: number;
        bmi: number;
        stats?: any;
    }>;
}

const healthProfileSchema: Schema<IHealthProfile> = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
            unique: true, // One profile per user
        },
        age: {
            type: Number,
            required: true,
        },
        gender: {
            type: String, // 'male', 'female'
            required: true,
        },
        height: {
            type: Number, // in cm
            required: true,
        },
        weight: {
            type: Number, // in kg
            required: true,
        },
        activityLevel: {
            type: String, // 'sedentary', 'light', 'moderate', 'active', 'very_active'
            required: true,
        },
        waterIntake: {
            type: Number, // in liters
            default: 0,
        },
        goal: {
            type: String, // 'lose_weight', 'gain_weight', 'maintain'
            required: true,
        },
        lastDietPlan: {
            type: Object, // Stores the full JSON of the generated plan
            default: null,
        },
        history: [{
            date: {
                type: Date,
                default: Date.now
            },
            weight: Number,
            height: Number,
            age: Number,
            bmi: Number,
            stats: Object, // Store snapshot of calculations (BMR, Calories)
        }],
    },
    {
        timestamps: true,
    }
);

const HealthProfile: Model<IHealthProfile> = mongoose.model<IHealthProfile>('HealthProfile', healthProfileSchema);

export default HealthProfile;
