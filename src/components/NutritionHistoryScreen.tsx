import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useNutrition } from '../contexts/NutritionContext';
import { SimpleHeader } from './SimpleHeader';

interface NutritionHistoryScreenProps {
  onBack: () => void;
}

const NutritionHistoryScreen: React.FC<NutritionHistoryScreenProps> = ({ onBack }) => {
  const { theme } = useTheme();
  const { currentDate, setCurrentDate, getDailyProgress } = useNutrition();
  
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  // Generate empty history data - in a real app, this would come from storage
  const generateEmptyHistory = () => {
    const history = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      // Empty data - user will fill this
      history.push({
        date: dateString,
        calories: 0,
        target: 2000,
        percentage: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      });
    }
    
    return history;
  };

  const mockHistory = generateEmptyHistory();

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

  const getProgressColor = (percentage: number) => {
    if (percentage < 80) return theme.error;
    if (percentage > 120) return '#ff9800';
    return theme.success;
  };

  const renderHistoryItem = (item: any) => (
    <TouchableOpacity
      key={item.date}
      style={[styles.historyItem, { backgroundColor: theme.surface }]}
      onPress={() => {
        setCurrentDate(item.date);
        onBack();
      }}
    >
      <View style={styles.historyContent}>
        <View style={styles.historyInfo}>
          <Text style={[styles.historyDate, { color: theme.text.primary }]}>
            {formatDate(item.date)}
          </Text>
          <Text style={[styles.historyCalories, { color: getProgressColor(item.percentage) }]}>
            {item.calories} / {item.target} kcal
          </Text>
        </View>
        
        <View style={styles.historyMacros}>
          <View style={styles.macroItem}>
            <Text style={[styles.macroLabel, { color: theme.text.secondary }]}>P</Text>
            <Text style={[styles.macroValue, { color: theme.text.primary }]}>{item.protein}g</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={[styles.macroLabel, { color: theme.text.secondary }]}>C</Text>
            <Text style={[styles.macroValue, { color: theme.text.primary }]}>{item.carbs}g</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={[styles.macroLabel, { color: theme.text.secondary }]}>G</Text>
            <Text style={[styles.macroValue, { color: theme.text.primary }]}>{item.fat}g</Text>
          </View>
        </View>
        
        <View style={styles.progressIndicator}>
          <View style={[styles.progressCircle, { backgroundColor: getProgressColor(item.percentage) }]}>
            <Text style={styles.progressText}>{item.percentage}%</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCalendarView = () => {
    // Simple week view for demonstration
    const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());

    return (
      <View style={[styles.calendarContainer, { backgroundColor: theme.cardBackground }]}>
        <Text style={[styles.calendarTitle, { color: theme.text.primary }]}>
          Esta semana
        </Text>
        
        <View style={styles.weekHeader}>
          {weekDays.map((day, index) => (
            <Text key={index} style={[styles.weekDay, { color: theme.text.secondary }]}>
              {day}
            </Text>
          ))}
        </View>
        
        <View style={styles.weekDays}>
          {Array.from({ length: 7 }, (_, index) => {
            const date = new Date(weekStart);
            date.setDate(weekStart.getDate() + index);
            const dateString = date.toISOString().split('T')[0];
            const dayData = mockHistory.find(h => h.date === dateString);
            const isToday = date.toDateString() === today.toDateString();
            const isSelected = dateString === selectedDate;

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.calendarDay,
                  {
                    backgroundColor: isSelected ? theme.primary : theme.surface,
                    borderColor: isToday ? theme.primary : 'transparent',
                  }
                ]}
                onPress={() => setSelectedDate(dateString)}
              >
                <Text
                  style={[
                    styles.calendarDayText,
                    {
                      color: isSelected ? '#white' : theme.text.primary,
                      fontWeight: isToday ? '600' : '400',
                    }
                  ]}
                >
                  {date.getDate()}
                </Text>
                {dayData && (
                  <View
                    style={[
                      styles.calendarDot,
                      { backgroundColor: getProgressColor(dayData.percentage) }
                    ]}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={theme.background === '#ffffff' ? 'dark-content' : 'light-content'}
        backgroundColor={theme.background}
      />
      
      <SimpleHeader
        title="Historial nutricional"
        subtitle="Revisa tus días anteriores"
        onBack={onBack}
      />

      <View style={styles.content}>
        {/* View Mode Toggle */}
        <View style={[styles.toggleContainer, { backgroundColor: theme.surface }]}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              { backgroundColor: viewMode === 'calendar' ? theme.primary : 'transparent' }
            ]}
            onPress={() => setViewMode('calendar')}
          >
            <MaterialIcons
              name="calendar-today"
              size={16}
              color={viewMode === 'calendar' ? '#white' : theme.text.primary}
            />
            <Text
              style={[
                styles.toggleText,
                { color: viewMode === 'calendar' ? '#white' : theme.text.primary }
              ]}
            >
              Calendario
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.toggleButton,
              { backgroundColor: viewMode === 'list' ? theme.primary : 'transparent' }
            ]}
            onPress={() => setViewMode('list')}
          >
            <MaterialIcons
              name="list"
              size={16}
              color={viewMode === 'list' ? '#white' : theme.text.primary}
            />
            <Text
              style={[
                styles.toggleText,
                { color: viewMode === 'list' ? '#white' : theme.text.primary }
              ]}
            >
              Lista
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {viewMode === 'calendar' ? renderCalendarView() : null}
          
          {/* History List */}
          <View style={styles.historyContainer}>
            <Text style={[styles.historyTitle, { color: theme.text.primary }]}>
              Últimos 7 días
            </Text>
            {mockHistory.reverse().map(renderHistoryItem)}
          </View>
        </ScrollView>
      </View>
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
  toggleContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    marginVertical: 16,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
  },
  calendarContainer: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  weekDay: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    flex: 1,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
  },
  calendarDay: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  calendarDayText: {
    fontSize: 14,
  },
  calendarDot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  historyContainer: {
    marginBottom: 20,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  historyItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  historyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  historyInfo: {
    flex: 1,
  },
  historyDate: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  historyCalories: {
    fontSize: 14,
    fontWeight: '500',
  },
  historyMacros: {
    flexDirection: 'row',
    gap: 12,
  },
  macroItem: {
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginBottom: 2,
  },
  macroValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressIndicator: {
    width: 50,
    alignItems: 'center',
  },
  progressCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    color: '#white',
    fontSize: 10,
    fontWeight: '600',
  },
});

export default NutritionHistoryScreen;
