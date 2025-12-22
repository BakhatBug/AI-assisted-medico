import { Response } from 'express';
import HealthProfile from '../models/HealthProfile';
import { calculateBMI, calculateBMR, calculateCalories } from '../utils/calculations';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Get user health profile
// @route   GET /api/health
// @access  Private
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const profile = await HealthProfile.findOne({ user: req.user?._id });

        if (profile) {
            // Calculate stats on the fly
            const bmi = calculateBMI(profile.weight, profile.height);
            const bmr = calculateBMR(profile.weight, profile.height, profile.age, profile.gender);
            const calories = calculateCalories(bmr, profile.activityLevel, profile.goal);

            res.json({
                ...profile.toObject(),
                stats: {
                    bmi,
                    bmr,
                    calories,
                },
            });
        } else {
            res.status(404).json({ message: 'Profile not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create or Update user health profile
// @route   POST /api/health
// @access  Private
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    const { age, gender, height, weight, activityLevel, waterIntake, goal } = req.body;

    try {
        let profile = await HealthProfile.findOne({ user: req.user?._id });

        if (profile) {
            // Save history if weight changed
            if (weight && weight !== profile.weight) {
                profile.history?.push({
                    date: new Date(),
                    weight: profile.weight,
                    height: profile.height,
                    age: profile.age,
                    bmi: parseFloat(calculateBMI(profile.weight, profile.height)),
                    stats: {
                        bmi: parseFloat(calculateBMI(profile.weight, profile.height)),
                        bmr: calculateBMR(profile.weight, profile.height, profile.age, profile.gender),
                        calories: calculateCalories(
                            calculateBMR(profile.weight, profile.height, profile.age, profile.gender),
                            profile.activityLevel,
                            profile.goal
                        )
                    }
                });
            }

            // Update existing
            profile.age = age || profile.age;
            profile.gender = gender || profile.gender;
            profile.height = height || profile.height;
            profile.weight = weight || profile.weight;
            profile.activityLevel = activityLevel || profile.activityLevel;
            profile.waterIntake = waterIntake || profile.waterIntake;
            profile.goal = goal || profile.goal;

            const updatedProfile = await profile.save();
            res.json(updatedProfile);
        } else {
            // Create new
            const newProfile = await HealthProfile.create({
                user: req.user?._id,
                age,
                gender,
                height,
                weight,
                activityLevel,
                waterIntake,
                goal,
                history: [] // Init empty history
            });
            res.status(201).json(newProfile);
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Save generated diet plan to profile
// @route   POST /api/health/save-plan
// @access  Private
export const saveDietPlan = async (req: AuthRequest, res: Response): Promise<void> => {
    const { plan } = req.body;

    try {
        const profile = await HealthProfile.findOne({ user: req.user?._id });

        if (profile) {
            profile.lastDietPlan = plan;
            await profile.save();
            res.json({ message: 'Plan saved successfully', plan: profile.lastDietPlan });
        } else {
            res.status(404).json({ message: 'Profile not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
