import React, { useState } from 'react';
import { View, StatusBar } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { NutritionProvider } from '../contexts/NutritionContext';
import { NutritionNavigationRoute, MealType } from '../types/nutrition';
import { createNutritionMenuOptions } from '../utils/nutritionMenuOptions';
import { MenuSection } from './MenuSection';
import NutritionMainScreen from './NutritionMainScreen';
import FoodSearchScreen from './FoodSearchScreen';
import CreateFoodScreen from './CreateFoodScreen';
import NutritionHistoryScreen from './NutritionHistoryScreen';
import NutritionSettingsScreen from './NutritionSettingsScreen';
import WeeklySummaryScreen from './WeeklySummaryScreen';

interface NavigationParams {
  route: NutritionNavigationRoute;
  selectedMeal?: MealType;
}

interface NutritionScreenProps {
  onBack: () => void;
}

const NutritionScreen: React.FC<NutritionScreenProps> = ({ onBack }) => {
  const { theme } = useTheme();
  const [currentScreen, setCurrentScreen] = useState<NutritionNavigationRoute>('NutritionMain');
  const [navigationParams, setNavigationParams] = useState<NavigationParams>({ route: 'NutritionMain' });

  const handleNavigate = (route: NutritionNavigationRoute, params?: { selectedMeal?: MealType }) => {
    setCurrentScreen(route);
    setNavigationParams({ route, ...params });
  };

  const handleBackToMenu = () => {
    setCurrentScreen('NutritionMain');
    setNavigationParams({ route: 'NutritionMain' });
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'NutritionMain':
        return (
          <NutritionMainScreen
            onBack={onBack}
            onNavigate={(route: string, params?: { selectedMeal?: MealType }) => 
              handleNavigate(route as NutritionNavigationRoute, params)
            }
          />
        );
      case 'FoodSearch':
        return (
          <FoodSearchScreen
            onBack={handleBackToMenu}
            selectedMeal={navigationParams.selectedMeal || 'breakfast'}
          />
        );
      case 'CreateFood':
        return (
          <CreateFoodScreen
            onBack={handleBackToMenu}
          />
        );
      case 'NutritionHistory':
        return (
          <NutritionHistoryScreen
            onBack={handleBackToMenu}
          />
        );
      case 'NutritionSettings':
        return (
          <NutritionSettingsScreen
            onBack={handleBackToMenu}
          />
        );
      case 'WeeklySummary':
        return (
          <WeeklySummaryScreen
            onBack={handleBackToMenu}
          />
        );
      default:
        return (
          <NutritionMainScreen
            onBack={onBack}
            onNavigate={(route: string, params?: { selectedMeal?: MealType }) => 
              handleNavigate(route as NutritionNavigationRoute, params)
            }
          />
        );
    }
  };

  return (
    <NutritionProvider>
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        <StatusBar
          barStyle={theme.background === '#ffffff' ? 'dark-content' : 'light-content'}
          backgroundColor={theme.background}
        />
        {renderCurrentScreen()}
      </View>
    </NutritionProvider>
  );
};

export default NutritionScreen;
