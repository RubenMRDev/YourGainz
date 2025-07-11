export interface Macros {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Food {
  id: string;
  name: string;
  macros: Macros; // Per 100g
  category: FoodCategory;
  isCustom: boolean;
  isFavorite: boolean;
  commonPortions?: Portion[];
}

export interface Portion {
  name: string;
  grams: number;
}

export interface FoodEntry {
  id: string;
  foodId: string;
  grams: number;
  meal: MealType;
  date: string; // ISO date string
  createdAt: string;
}

export type MealType = 'breakfast' | 'morning_snack' | 'lunch' | 'afternoon_snack' | 'dinner';

export type FoodCategory = 
  | 'proteins'
  | 'carbs'
  | 'vegetables'
  | 'fruits'
  | 'dairy'
  | 'nuts_seeds'
  | 'oils_fats'
  | 'beverages'
  | 'snacks'
  | 'other';

export interface DailyNutrition {
  date: string;
  totalMacros: Macros;
  mealEntries: {
    [key in MealType]: FoodEntry[];
  };
  targetMacros?: Macros;
}

export interface NutritionGoals {
  dailyCalories: number;
  proteinPercentage: number; // 0-100
  carbsPercentage: number; // 0-100
  fatPercentage: number; // 0-100
}

export interface WeeklySummary {
  startDate: string;
  endDate: string;
  averageMacros: Macros;
  targetMacros?: Macros;
  dailyCalories: number[];
  adherencePercentage: number;
}

export type NutritionNavigationRoute = 
  | 'NutritionMain'
  | 'FoodSearch'
  | 'AddFood'
  | 'CreateFood'
  | 'NutritionHistory'
  | 'NutritionSettings'
  | 'WeeklySummary';
