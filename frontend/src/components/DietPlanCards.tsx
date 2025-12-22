

interface Meal {
    type: string;
    food: string;
    calories: string;
}

interface DayPlan {
    day_label: string;
    meals: Meal[];
}

interface DietPlanData {
    plan_name: string;
    analysis: string;
    estimated_stats?: {
        age: string;
        gender: string;
        height: string;
        weight: string;
    };
    days: DayPlan[];
}

const DietPlanCards = ({ plan, userProfile }: { plan: DietPlanData; userProfile?: any }) => {
    if (!plan) return null;

    return (
        <div className="space-y-8">
            <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-500 shadow-sm">
                <h2 className="text-xl font-bold text-blue-900 mb-2">{plan.plan_name}</h2>
                <p className="text-blue-800/80 leading-relaxed">{plan.analysis}</p>
            </div>

            {/* Stats Comparison */}
            {plan.estimated_stats && userProfile && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <span>📊</span> Stats Comparison
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Your Input</h4>
                            <ul className="space-y-2 text-sm text-slate-700">
                                <li className="flex justify-between border-b border-slate-50 py-1">
                                    <span>Age</span>
                                    <span className="font-semibold">{userProfile.age}</span>
                                </li>
                                <li className="flex justify-between border-b border-slate-50 py-1">
                                    <span>Weight</span>
                                    <span className="font-semibold">{userProfile.weight} kg</span>
                                </li>
                                <li className="flex justify-between border-b border-slate-50 py-1">
                                    <span>Height</span>
                                    <span className="font-semibold">{userProfile.height} cm</span>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-blue-500 uppercase tracking-wider mb-3">AI Estimate (from Image)</h4>
                            <ul className="space-y-2 text-sm text-slate-700">
                                <li className="flex justify-between border-b border-slate-50 py-1">
                                    <span>Age</span>
                                    <span className="font-semibold text-blue-600">{plan.estimated_stats.age}</span>
                                </li>
                                <li className="flex justify-between border-b border-slate-50 py-1">
                                    <span>Weight</span>
                                    <span className="font-semibold text-blue-600">{plan.estimated_stats.weight}</span>
                                </li>
                                <li className="flex justify-between border-b border-slate-50 py-1">
                                    <span>Height</span>
                                    <span className="font-semibold text-blue-600">{plan.estimated_stats.height}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-4">
                        * The AI designs the plan based on a hybrid analysis of your input and the visual data.
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plan.days.map((day, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="bg-emerald-500 text-white p-4 text-center font-bold text-lg">
                            {day.day_label}
                        </div>

                        <div className="p-4 space-y-4">
                            {day.meals.map((meal, mIndex) => (
                                <div key={mIndex} className={`flex items-start gap-3 pb-3 ${mIndex !== day.meals.length - 1 ? 'border-b border-slate-50' : ''}`}>
                                    <div className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                                        {meal.type}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium text-slate-800 text-sm">{meal.food}</div>
                                        <div className="text-xs text-slate-400 mt-0.5">{meal.calories}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DietPlanCards;
