import { IUser } from '../models/User';

export const calculateLevel = (xp: number): number => {
    // Simple formula: Level = floor(sqrt(XP / 50)) + 1
    return Math.floor(Math.sqrt(xp / 50)) + 1;
};

export const checkStreak = (user: IUser): IUser => {
    const now = new Date();
    const lastLogin = new Date(user.lastLoginDate);

    // Reset time to midnight for comparison
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const last = new Date(lastLogin.getFullYear(), lastLogin.getMonth(), lastLogin.getDate());

    const diffTime = Math.abs(today.getTime() - last.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
        // Consecutive day
        user.streak += 1;
    } else if (diffDays > 1) {
        // Streak broken
        user.streak = 1; // Reset to 1 (today is the new start)
    }
    // If diffDays === 0, same day login, do nothing to streak

    user.lastLoginDate = now;
    return user;
};
