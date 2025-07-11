import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useNutrition } from '../contexts/NutritionContext';
import { SimpleHeader } from './SimpleHeader';

interface WeeklySummaryScreenProps {
  onBack: () => void;
}

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 32;
const CHART_HEIGHT = 200;

const WeeklySummaryScreen: React.FC<WeeklySummaryScreenProps> = ({ onBack }) => {
  const { theme } = useTheme();
  const { nutritionGoals } = useNutrition();
  
  const [selectedWeek, setSelectedWeek] = useState(0); // 0 = current week, 1 = last week, etc.

  // Generate empty data for weekly summary - user will fill this by adding food entries
  const generateWeeklyData = (weekOffset: number) => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() - (weekOffset * 7));
    
    const weekData = {
      startDate: startOfWeek.toISOString().split('T')[0],
      endDate: new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dailyCalories: [] as number[],
      dailyProtein: [] as number[],
      dailyCarbs: [] as number[],
      dailyFat: [] as number[],
      averageMacros: { calories: 0, protein: 0, carbs: 0, fat: 0 },
      adherencePercentage: 0,
    };

    // Generate 7 days of empty data - user will fill this by tracking food
    for (let i = 0; i < 7; i++) {
      weekData.dailyCalories.push(0);
      weekData.dailyProtein.push(0);
      weekData.dailyCarbs.push(0);
      weekData.dailyFat.push(0);
    }

    // All averages start at 0
    weekData.averageMacros.calories = 0;
    weekData.averageMacros.protein = 0;
    weekData.averageMacros.carbs = 0;
    weekData.averageMacros.fat = 0;

    // Adherence starts at 0
    weekData.adherencePercentage = 0;

    return weekData;
  };

  const currentWeekData = generateWeeklyData(selectedWeek);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short'
    });
  };

  const getWeekTitle = (weekOffset: number) => {
    if (weekOffset === 0) return 'Esta semana';
    if (weekOffset === 1) return 'Semana pasada';
    return `Hace ${weekOffset} semanas`;
  };

  const renderCaloriesChart = () => {
    const maxCalories = Math.max(...currentWeekData.dailyCalories, nutritionGoals.dailyCalories);
    const chartPadding = 40;
    const barWidth = (CHART_WIDTH - chartPadding * 2) / 7;
    const chartContentHeight = CHART_HEIGHT - 60;

    return (
      <View style={[styles.chartContainer, { backgroundColor: theme.surface }]}>
        <Text style={[styles.chartTitle, { color: theme.text.primary }]}>
          Calorías diarias
        </Text>
        
        <View style={styles.chart}>
          <View style={[styles.chartArea, { width: CHART_WIDTH, height: CHART_HEIGHT }]}>
            {/* Target line */}
            <View
              style={[
                styles.targetLine,
                {
                  position: 'absolute',
                  top: 30 + (chartContentHeight * (1 - nutritionGoals.dailyCalories / maxCalories)),
                  left: chartPadding,
                  right: chartPadding,
                  borderColor: theme.primary,
                }
              ]}
            />
            
            {/* Bars */}
            {currentWeekData.dailyCalories.map((calories, index) => {
              const barHeight = (calories / maxCalories) * chartContentHeight;
              const isAboveTarget = calories > nutritionGoals.dailyCalories;
              
              return (
                <View
                  key={index}
                  style={[
                    styles.chartBar,
                    {
                      position: 'absolute',
                      left: chartPadding + index * barWidth + barWidth * 0.1,
                      bottom: 30,
                      width: barWidth * 0.8,
                      height: barHeight,
                      backgroundColor: isAboveTarget ? '#10b981' : theme.error,
                    }
                  ]}
                />
              );
            })}
            
            {/* Day labels */}
            <View style={styles.chartLabels}>
              {['D', 'L', 'M', 'X', 'J', 'V', 'S'].map((day, index) => (
                <Text
                  key={index}
                  style={[
                    styles.chartLabel,
                    { 
                      color: theme.text.secondary,
                      width: barWidth,
                      textAlign: 'center',
                    }
                  ]}
                >
                  {day}
                </Text>
              ))}
            </View>
          </View>
        </View>
        
        <View style={styles.chartLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: theme.primary }]} />
            <Text style={[styles.legendText, { color: theme.text.secondary }]}>
              Objetivo: {nutritionGoals.dailyCalories} kcal
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderMacroCard = (
    title: string,
    current: number,
    target: number,
    unit: string,
    color: string
  ) => {
    const percentage = target > 0 ? Math.round((current / target) * 100) : 0;
    const difference = current - target;
    
    return (
      <View style={[styles.macroCard, { backgroundColor: theme.surface }]}>
        <View style={styles.macroHeader}>
          <Text style={[styles.macroTitle, { color: theme.text.primary }]}>
            {title}
          </Text>
          <View style={[styles.macroIndicator, { backgroundColor: color }]} />
        </View>
        
        <Text style={[styles.macroValue, { color: theme.text.primary }]}>
          {current} {unit}
        </Text>
        
        <Text style={[styles.macroTarget, { color: theme.text.secondary }]}>
          Objetivo: {target} {unit}
        </Text>
        
        <View style={styles.macroProgress}>
          <View style={[styles.macroProgressBackground, { backgroundColor: theme.cardBackground }]}>
            <View
              style={[
                styles.macroProgressFill,
                {
                  width: `${Math.min(percentage, 100)}%`,
                  backgroundColor: color,
                }
              ]}
            />
          </View>
          <Text style={[styles.macroPercentage, { color }]}>
            {percentage}%
          </Text>
        </View>
        
        <Text
          style={[
            styles.macroDifference,
            { color: difference >= 0 ? theme.success : theme.error }
          ]}
        >
          {difference >= 0 ? '+' : ''}{difference} {unit}
        </Text>
      </View>
    );
  };

  const targetMacros = {
    protein: Math.round((nutritionGoals.dailyCalories * nutritionGoals.proteinPercentage / 100) / 4),
    carbs: Math.round((nutritionGoals.dailyCalories * nutritionGoals.carbsPercentage / 100) / 4),
    fat: Math.round((nutritionGoals.dailyCalories * nutritionGoals.fatPercentage / 100) / 9),
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={theme.background === '#ffffff' ? 'dark-content' : 'light-content'}
        backgroundColor={theme.background}
      />
      
      <SimpleHeader
        title="Resumen semanal"
        subtitle={`${formatDate(currentWeekData.startDate)} - ${formatDate(currentWeekData.endDate)}`}
        onBack={onBack}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Week Selector */}
        <View style={[styles.weekSelector, { backgroundColor: theme.surface }]}>
          <TouchableOpacity
            style={styles.weekButton}
            onPress={() => setSelectedWeek(selectedWeek + 1)}
          >
            <MaterialIcons name="chevron-left" size={24} color={theme.text.primary} />
          </TouchableOpacity>
          
          <Text style={[styles.weekTitle, { color: theme.text.primary }]}>
            {getWeekTitle(selectedWeek)}
          </Text>
          
          <TouchableOpacity
            style={[styles.weekButton, { opacity: selectedWeek === 0 ? 0.3 : 1 }]}
            onPress={() => selectedWeek > 0 && setSelectedWeek(selectedWeek - 1)}
            disabled={selectedWeek === 0}
          >
            <MaterialIcons name="chevron-right" size={24} color={theme.text.primary} />
          </TouchableOpacity>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryGrid}>
          <View style={[styles.summaryCard, { backgroundColor: theme.surface }]}>
            <MaterialIcons name="local-fire-department" size={32} color="#ef4444" />
            <Text style={[styles.summaryValue, { color: theme.text.primary }]}>
              {currentWeekData.averageMacros.calories}
            </Text>
            <Text style={[styles.summaryLabel, { color: theme.text.secondary }]}>
              Calorías promedio
            </Text>
          </View>

          <View style={[styles.summaryCard, { backgroundColor: theme.surface }]}>
            <MaterialIcons name="trending-up" size={32} color={theme.primary} />
            <Text style={[styles.summaryValue, { color: theme.text.primary }]}>
              {currentWeekData.adherencePercentage}%
            </Text>
            <Text style={[styles.summaryLabel, { color: theme.text.secondary }]}>
              Adherencia
            </Text>
          </View>

          <View style={[styles.summaryCard, { backgroundColor: theme.surface }]}>
            <MaterialIcons name="fitness-center" size={32} color="#3b82f6" />
            <Text style={[styles.summaryValue, { color: theme.text.primary }]}>
              {currentWeekData.averageMacros.protein}g
            </Text>
            <Text style={[styles.summaryLabel, { color: theme.text.secondary }]}>
              Proteína promedio
            </Text>
          </View>

          <View style={[styles.summaryCard, { backgroundColor: theme.surface }]}>
            <MaterialIcons name="grain" size={32} color="#10b981" />
            <Text style={[styles.summaryValue, { color: theme.text.primary }]}>
              {Math.round((currentWeekData.averageMacros.carbs + currentWeekData.averageMacros.fat) * 100) / 100}g
            </Text>
            <Text style={[styles.summaryLabel, { color: theme.text.secondary }]}>
              Carbs + Grasas
            </Text>
          </View>
        </View>

        {/* Calories Chart */}
        {renderCaloriesChart()}

        {/* Macro Cards */}
        <View style={styles.macrosSection}>
          <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
            Macronutrientes promedio
          </Text>
          
          <View style={styles.macroCardsGrid}>
            {renderMacroCard(
              'Proteína',
              currentWeekData.averageMacros.protein,
              targetMacros.protein,
              'g',
              '#3b82f6'
            )}
            {renderMacroCard(
              'Carbohidratos',
              currentWeekData.averageMacros.carbs,
              targetMacros.carbs,
              'g',
              '#10b981'
            )}
            {renderMacroCard(
              'Grasas',
              currentWeekData.averageMacros.fat,
              targetMacros.fat,
              'g',
              '#f59e0b'
            )}
          </View>
        </View>

        {/* Insights */}
        <View style={[styles.insightsSection, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
            Análisis semanal
          </Text>
          
          <View style={styles.insight}>
            <MaterialIcons name="insights" size={20} color={theme.primary} />
            <Text style={[styles.insightText, { color: theme.text.primary }]}>
              Tu adherencia promedio fue del {currentWeekData.adherencePercentage}%
            </Text>
          </View>
          
          <View style={styles.insight}>
            <MaterialIcons 
              name={currentWeekData.averageMacros.calories > nutritionGoals.dailyCalories ? "trending-up" : "trending-down"} 
              size={20} 
              color={currentWeekData.averageMacros.calories > nutritionGoals.dailyCalories ? theme.success : theme.error} 
            />
            <Text style={[styles.insightText, { color: theme.text.primary }]}>
              Consumiste {Math.abs(currentWeekData.averageMacros.calories - nutritionGoals.dailyCalories)} kcal {
                currentWeekData.averageMacros.calories > nutritionGoals.dailyCalories ? 'por encima' : 'por debajo'
              } de tu objetivo diario
            </Text>
          </View>
          
          <View style={styles.insight}>
            <MaterialIcons name="restaurant" size={20} color="#3b82f6" />
            <Text style={[styles.insightText, { color: theme.text.primary }]}>
              Tu ingesta de proteína fue {currentWeekData.averageMacros.protein >= targetMacros.protein ? 'adecuada' : 'insuficiente'}
            </Text>
          </View>
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
  weekSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  weekButton: {
    padding: 8,
  },
  weekTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  summaryLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  chartContainer: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  chart: {
    alignItems: 'center',
  },
  chartArea: {
    position: 'relative',
  },
  targetLine: {
    height: 1,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  chartBar: {
    borderRadius: 4,
  },
  chartLabels: {
    position: 'absolute',
    bottom: 0,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chartLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  chartLegend: {
    marginTop: 16,
    alignItems: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendColor: {
    width: 12,
    height: 2,
    borderRadius: 1,
  },
  legendText: {
    fontSize: 12,
  },
  macrosSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  macroCardsGrid: {
    gap: 12,
  },
  macroCard: {
    borderRadius: 16,
    padding: 16,
  },
  macroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  macroTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  macroIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  macroValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  macroTarget: {
    fontSize: 12,
    marginBottom: 12,
  },
  macroProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  macroProgressBackground: {
    flex: 1,
    height: 6,
    borderRadius: 3,
  },
  macroProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  macroPercentage: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 35,
  },
  macroDifference: {
    fontSize: 12,
    fontWeight: '500',
  },
  insightsSection: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  insight: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});

export default WeeklySummaryScreen;
