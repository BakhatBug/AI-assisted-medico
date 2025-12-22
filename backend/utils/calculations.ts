// BMI Calculation
export const calculateBMI = (weight: number, height: number): string => {
    // Height in meters
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
};

// BMR Calculation (Mifflin-St Jeor Equation)
export const calculateBMR = (weight: number, height: number, age: number, gender: string): number => {
    let bmr: number;
    if (gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    return Math.round(bmr);
};

// Total Daily Energy Expenditure (TDEE)
export const calculateCalories = (bmr: number, activityLevel: string, goal: string): number => {
    const activityMultipliers: { [key: string]: number } = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        very_active: 1.9,
    };

    const maintenanceCalories = bmr * (activityMultipliers[activityLevel] || 1.2);

    let targetCalories = maintenanceCalories;

    if (goal === 'lose_weight') {
        targetCalories -= 500; // Deficit for weight loss
    } else if (goal === 'gain_weight') {
        targetCalories += 500; // Surplus for weight gain
    }

    return Math.round(targetCalories);
};
