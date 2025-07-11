import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useNutrition } from '../contexts/NutritionContext';
import { MealType, FoodEntry } from '../types/nutrition';
import { SimpleHeader } from './SimpleHeader';

interface NutritionMainScreenProps {
  onBack: () => void;
  onNavigate: (route: string, params?: { selectedMeal?: MealType }) => void;
}

const MEAL_NAMES = {
  breakfast: 'Desayuno',
  morning_snack: 'Media Mañana',
  lunch: 'Comida',
  afternoon_snack: 'Merienda',
  dinner: 'Cena'
};

const MEAL_ICONS = {
  breakfast: 'free-breakfast',
  morning_snack: 'coffee',
  lunch: 'restaurant',
  afternoon_snack: 'local-cafe',
  dinner: 'dinner-dining'
};

const NutritionMainScreen: React.FC<NutritionMainScreenProps> = ({
  onBack,
  onNavigate,
}) => {
  const { theme } = useTheme();
  const {
    dailyNutrition,
    foods,
    calculateMacros,
    getDailyProgress,
    removeFoodEntry,
    currentDate
  } = useNutrition();
  
  const [selectedMeal, setSelectedMeal] = useState<MealType>('breakfast');

  const { consumed, target, percentage } = getDailyProgress();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString('es-ES', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      });
    }
  };

  const renderMacroBar = (label: string, current: number, target: number, color: string) => {
    const percentage = target > 0 ? (current / target) * 100 : 0;
    const clampedPercentage = Math.min(percentage, 100);

    return (
      <View style={styles.macroContainer}>
        <View style={styles.macroHeader}>
          <Text style={[styles.macroLabel, { color: theme.text.primary }]}>
            {label}
          </Text>
          <Text style={[styles.macroValues, { color: theme.text.secondary }]}>
            {Math.round(current)}/{Math.round(target)}
          </Text>
        </View>
        <View style={[styles.macroBarBackground, { backgroundColor: theme.surface }]}>
          <View
            style={[
              styles.macroBarFill,
              {
                width: `${clampedPercentage}%`,
                backgroundColor: color,
              },
            ]}
          />
        </View>
      </View>
    );
  };

  const renderFoodEntry = (entry: FoodEntry) => {
    const food = foods.find(f => f.id === entry.foodId);
    if (!food) return null;

    const macros = calculateMacros(entry.foodId, entry.grams);

    return (
      <View key={entry.id}>
        <TouchableOpacity
          style={[styles.foodEntry, { backgroundColor: theme.surface }]}
          onLongPress={() => {
            Alert.alert(
              'Eliminar alimento',
              `¿Eliminar ${food.name}?`,
              [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Eliminar', style: 'destructive', onPress: () => removeFoodEntry(entry.id) }
              ]
            );
          }}
        >
          <View style={styles.foodEntryContent}>
            <View style={styles.foodEntryInfo}>
              <Text style={[styles.foodName, { color: theme.text.primary }]}>
                {food.name}
              </Text>
              <Text style={[styles.foodAmount, { color: theme.text.secondary }]}>
                {entry.grams}g
              </Text>
            </View>
            <View style={styles.foodMacros}>
              <Text style={[styles.caloriesText, { color: theme.primary }]}>
                {macros.calories} kcal
              </Text>
              <View style={styles.macroDetails}>
                <Text style={[styles.macroDetail, { color: theme.text.secondary }]}>
                  P: {macros.protein}g
                </Text>
                <Text style={[styles.macroDetail, { color: theme.text.secondary }]}>
                  C: {macros.carbs}g
                </Text>
                <Text style={[styles.macroDetail, { color: theme.text.secondary }]}>
                  G: {macros.fat}g
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderMealSection = (mealType: MealType) => {
    const entries = dailyNutrition.mealEntries[mealType];
    
    const totalCalories = entries.reduce((sum, entry) => {
      const macros = calculateMacros(entry.foodId, entry.grams);
      return sum + macros.calories;
    }, 0);

    return (
      <View key={mealType} style={[styles.mealSection, { backgroundColor: theme.cardBackground }]}>
        <TouchableOpacity
          style={styles.mealHeader}
          onPress={() => onNavigate('FoodSearch', { selectedMeal: mealType })}
        >
          <View style={styles.mealInfo}>
            <MaterialIcons
              name={MEAL_ICONS[mealType] as any}
              size={24}
              color={theme.primary}
            />
            <Text style={[styles.mealTitle, { color: theme.text.primary }]}>
              {MEAL_NAMES[mealType]}
            </Text>
            <Text style={[styles.mealCalories, { color: theme.text.secondary }]}>
              {totalCalories} kcal
            </Text>
          </View>
          <MaterialIcons name="add" size={24} color={theme.primary} />
        </TouchableOpacity>
        
        {entries.length > 0 ? (
          <View style={styles.mealEntries}>
            {entries.map(renderFoodEntry)}
          </View>
        ) : (
          <View style={styles.emptyMeal}>
            <MaterialIcons name="restaurant" size={32} color={theme.text.secondary} />
            <Text style={[styles.emptyMealText, { color: theme.text.secondary }]}>
              Toca el + para agregar alimentos
            </Text>
          </View>
        )}
      </View>
    );
  };

  const getProgressColor = () => {
    if (percentage < 80) return theme.error;
    if (percentage > 120) return '#ff9800';
    return theme.success;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={theme.background === '#ffffff' ? 'dark-content' : 'light-content'}
        backgroundColor={theme.background}
      />
      
      <SimpleHeader
        title="Nutrición"
        subtitle={formatDate(currentDate)}
        onBack={onBack}
        rightIcon="calendar-today"
        onRightPress={() => onNavigate('NutritionHistory')}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Daily Summary */}
        <View style={[styles.summaryCard, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.summaryHeader}>
            <Text style={[styles.summaryTitle, { color: theme.text.primary }]}>
              Resumen del día
            </Text>
            <Text style={[styles.caloriesCount, { color: getProgressColor() }]}>
              {consumed.calories} / {target.calories} kcal
            </Text>
          </View>
          
          <View style={styles.progressRing}>
            <Text style={[styles.progressPercentage, { color: getProgressColor() }]}>
              {percentage}%
            </Text>
          </View>

          <View style={styles.macrosGrid}>
            {renderMacroBar('Proteína', consumed.protein, target.protein, '#3b82f6')}
            {renderMacroBar('Carbohidratos', consumed.carbs, target.carbs, '#10b981')}
            {renderMacroBar('Grasas', consumed.fat, target.fat, '#f59e0b')}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={[styles.quickActions, { backgroundColor: theme.cardBackground }]}>
          <TouchableOpacity
            style={[styles.quickAction, { borderColor: theme.primary }]}
            onPress={() => onNavigate('FoodSearch', { selectedMeal })}
          >
            <MaterialIcons name="search" size={24} color={theme.primary} />
            <Text style={[styles.quickActionText, { color: theme.primary }]}>
              Buscar alimento
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.quickAction, { borderColor: theme.primary }]}
            onPress={() => onNavigate('CreateFood')}
          >
            <MaterialIcons name="add-circle" size={24} color={theme.primary} />
            <Text style={[styles.quickActionText, { color: theme.primary }]}>
              Crear alimento
            </Text>
          </TouchableOpacity>
        </View>

        {/* Meals */}
        <View style={styles.mealsContainer}>
          {(Object.keys(MEAL_NAMES) as MealType[]).map(renderMealSection)}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  summaryCard: {
    borderRadius: 16,
    padding: 20,
    marginVertical: 16,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  caloriesCount: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressRing: {
    alignItems: 'center',
    marginBottom: 20,
  },
  progressPercentage: {
    fontSize: 32,
    fontWeight: '700',
  },
  macrosGrid: {
    gap: 12,
  },
  macroContainer: {
    gap: 8,
  },
  macroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  macroValues: {
    fontSize: 12,
  },
  macroBarBackground: {
    height: 8,
    borderRadius: 4,
  },
  macroBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  quickActions: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginBottom: 16,
  },
  quickAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    gap: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  mealsContainer: {
    gap: 12,
    paddingBottom: 20,
  },
  mealSection: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  mealInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  mealCalories: {
    fontSize: 14,
  },
  mealEntries: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  foodEntry: {
    borderRadius: 12,
    padding: 12,
  },
  foodEntryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  foodEntryInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 14,
    fontWeight: '500',
  },
  foodAmount: {
    fontSize: 12,
    marginTop: 2,
  },
  foodMacros: {
    alignItems: 'flex-end',
  },
  caloriesText: {
    fontSize: 14,
    fontWeight: '600',
  },
  macroDetails: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  macroDetail: {
    fontSize: 11,
  },
  emptyMeal: {
    alignItems: 'center',
    padding: 20,
    gap: 8,
  },
  emptyMealText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default NutritionMainScreen;
