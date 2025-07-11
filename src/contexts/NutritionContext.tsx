import React, { createContext, useContext, useState, useEffect } from 'react';
import { Food, FoodEntry, DailyNutrition, NutritionGoals, Macros, MealType } from '../types/nutrition';
import foodsData from '../data/foods.json';

interface NutritionContextType {
  // Foods data
  foods: Food[];
  favoriteFoods: Food[];
  searchFoods: (query: string, category?: string) => Food[];
  addCustomFood: (food: Omit<Food, 'id' | 'isCustom'>) => void;
  toggleFavorite: (foodId: string) => void;
  
  // Daily nutrition
  currentDate: string;
  dailyNutrition: DailyNutrition;
  setCurrentDate: (date: string) => void;
  addFoodEntry: (foodId: string, grams: number, meal: MealType) => void;
  removeFoodEntry: (entryId: string) => void;
  updateFoodEntry: (entryId: string, grams: number) => void;
  
  // Goals
  nutritionGoals: NutritionGoals;
  updateNutritionGoals: (goals: NutritionGoals) => void;
  
  // Utilities
  calculateMacros: (foodId: string, grams: number) => Macros;
  getDailyProgress: () => {
    consumed: Macros;
    target: Macros;
    percentage: number;
  };
}

const NutritionContext = createContext<NutritionContextType | undefined>(undefined);

export const useNutrition = () => {
  const context = useContext(NutritionContext);
  if (!context) {
    throw new Error('useNutrition must be used within a NutritionProvider');
  }
  return context;
};

export const NutritionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [foods, setFoods] = useState<Food[]>(foodsData as Food[]);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Usar un objeto más simple para el estado de nutrición diaria
  const [mealEntries, setMealEntries] = useState<{[key in MealType]: FoodEntry[]}>({
    breakfast: [],
    morning_snack: [],
    lunch: [],
    afternoon_snack: [],
    dinner: []
  });
  
  // Crear dailyNutrition dinámicamente
  const dailyNutrition: DailyNutrition = {
    date: currentDate,
    totalMacros: { calories: 0, protein: 0, carbs: 0, fat: 0 }, // Se calcula dinámicamente
    mealEntries: mealEntries
  };
  
  const [nutritionGoals, setNutritionGoals] = useState<NutritionGoals>({
    dailyCalories: 2000,
    proteinPercentage: 30,
    carbsPercentage: 40,
    fatPercentage: 30
  });

  // Update meal entries when date changes
  useEffect(() => {
    // Reset entries when date changes
    setMealEntries({
      breakfast: [],
      morning_snack: [],
      lunch: [],
      afternoon_snack: [],
      dinner: []
    });
  }, [currentDate]);

  const searchFoods = (query: string, category?: string): Food[] => {
    let filteredFoods = foods;
    
    if (category) {
      filteredFoods = filteredFoods.filter(food => food.category === category);
    }
    
    if (query.trim()) {
      const lowercaseQuery = query.toLowerCase();
      filteredFoods = filteredFoods.filter(food =>
        food.name.toLowerCase().includes(lowercaseQuery)
      );
    }
    
    return filteredFoods;
  };

  const addCustomFood = (foodData: Omit<Food, 'id' | 'isCustom'>) => {
    const newFood: Food = {
      ...foodData,
      id: `custom_${Date.now()}`,
      isCustom: true
    };
    setFoods(prev => [...prev, newFood]);
  };

  const toggleFavorite = (foodId: string) => {
    setFoods(prev => prev.map(food =>
      food.id === foodId ? { ...food, isFavorite: !food.isFavorite } : food
    ));
  };

  const addFoodEntry = (foodId: string, grams: number, meal: MealType) => {
    const newEntry: FoodEntry = {
      id: `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      foodId,
      grams,
      meal,
      date: currentDate,
      createdAt: new Date().toISOString()
    };

    // Actualizar directamente el estado de mealEntries
    setMealEntries(prev => {
      const newState = {
        ...prev,
        [meal]: [...prev[meal], newEntry]
      };
      return newState;
    });
  };

  const removeFoodEntry = (entryId: string) => {
    setMealEntries(prev => {
      const newMealEntries = { ...prev };
      Object.keys(newMealEntries).forEach(mealKey => {
        const meal = mealKey as MealType;
        newMealEntries[meal] = newMealEntries[meal].filter(entry => entry.id !== entryId);
      });
      return newMealEntries;
    });
  };

  const updateFoodEntry = (entryId: string, grams: number) => {
    setMealEntries(prev => {
      const newMealEntries = { ...prev };
      Object.keys(newMealEntries).forEach(mealKey => {
        const meal = mealKey as MealType;
        newMealEntries[meal] = newMealEntries[meal].map(entry =>
          entry.id === entryId ? { ...entry, grams } : entry
        );
      });
      return newMealEntries;
    });
  };

  const calculateMacros = (foodId: string, grams: number): Macros => {
    const food = foods.find(f => f.id === foodId);
    if (!food) return { calories: 0, protein: 0, carbs: 0, fat: 0 };

    const ratio = grams / 100; // Food macros are per 100g
    return {
      calories: Math.round(food.macros.calories * ratio),
      protein: Math.round(food.macros.protein * ratio * 10) / 10,
      carbs: Math.round(food.macros.carbs * ratio * 10) / 10,
      fat: Math.round(food.macros.fat * ratio * 10) / 10
    };
  };

  const getDailyProgress = () => {
    // Calcular macros en tiempo real en lugar de almacenarlos
    const consumed = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    
    Object.values(dailyNutrition.mealEntries).flat().forEach(entry => {
      const food = foods.find(f => f.id === entry.foodId);
      if (food) {
        const ratio = entry.grams / 100; // Food macros are per 100g
        consumed.calories += Math.round(food.macros.calories * ratio);
        consumed.protein += Math.round(food.macros.protein * ratio * 10) / 10;
        consumed.carbs += Math.round(food.macros.carbs * ratio * 10) / 10;
        consumed.fat += Math.round(food.macros.fat * ratio * 10) / 10;
      }
    });

    const target: Macros = {
      calories: nutritionGoals.dailyCalories,
      protein: Math.round((nutritionGoals.dailyCalories * nutritionGoals.proteinPercentage / 100) / 4),
      carbs: Math.round((nutritionGoals.dailyCalories * nutritionGoals.carbsPercentage / 100) / 4),
      fat: Math.round((nutritionGoals.dailyCalories * nutritionGoals.fatPercentage / 100) / 9)
    };
    
    const percentage = Math.round((consumed.calories / target.calories) * 100);
    
    return { consumed, target, percentage };
  };

  const updateNutritionGoals = (goals: NutritionGoals) => {
    setNutritionGoals(goals);
  };

  const favoriteFoods = foods.filter(food => food.isFavorite);

  const value: NutritionContextType = {
    foods,
    favoriteFoods,
    searchFoods,
    addCustomFood,
    toggleFavorite,
    currentDate,
    dailyNutrition,
    setCurrentDate,
    addFoodEntry,
    removeFoodEntry,
    updateFoodEntry,
    nutritionGoals,
    updateNutritionGoals,
    calculateMacros,
    getDailyProgress
  };

  return (
    <NutritionContext.Provider value={value}>
      {children}
    </NutritionContext.Provider>
  );
};
