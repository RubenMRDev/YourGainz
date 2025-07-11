import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  FlatList 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { spacing, typography, borderRadius } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import exercisesData from '../data/exercises.json';

interface Exercise {
  id: string;
  name: string;
  description: string;
  muscleGroup: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  equipment: string;
  additionalMuscles: string[];
}

interface ExercisesListScreenProps {
  onBackPress: () => void;
}

const muscleGroups = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];

export const ExercisesListScreen: React.FC<ExercisesListScreenProps> = ({ 
  onBackPress 
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return '#22c55e'; // Green
      case 'Intermediate':
        return '#f59e0b'; // Yellow/Orange
      case 'Advanced':
        return '#ef4444'; // Red
      default:
        return theme.text.secondary;
    }
  };
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('All');

  const filteredExercises = useMemo(() => {
    let filtered = exercisesData as Exercise[];

    // Filter by muscle group
    if (selectedMuscleGroup !== 'All') {
      filtered = filtered.filter(exercise => 
        exercise.muscleGroup === selectedMuscleGroup
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(exercise =>
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.muscleGroup.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [searchQuery, selectedMuscleGroup]);

  const renderExerciseCard = ({ item }: { item: Exercise }) => (
    <TouchableOpacity style={styles.exerciseCard}>
      <View style={styles.exerciseHeader}>
        <Text style={styles.exerciseName}>{item.name}</Text>
        <View style={[
          styles.difficultyBadge, 
          { backgroundColor: getDifficultyColor(item.difficulty) }
        ]}>
          <Text style={styles.difficultyText}>{item.difficulty}</Text>
        </View>
      </View>
      
      <Text style={styles.muscleGroup}>{item.muscleGroup}</Text>
      <Text style={styles.exerciseDescription}>{item.description}</Text>
      
      <View style={styles.exerciseFooter}>
        <View style={styles.equipmentContainer}>
          <Ionicons name="fitness" size={16} color={theme.text.secondary} />
          <Text style={styles.equipmentText}>{item.equipment}</Text>
        </View>
        <Text style={styles.additionalMuscles}>
          {item.additionalMuscles.join(', ')} +2 more
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
          <Ionicons name="arrow-back" size={24} color={theme.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Exercises</Text>
        <View style={styles.invisiblePlaceholder} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={theme.text.secondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search exercises..."
          placeholderTextColor={theme.text.secondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Muscle Group Filters */}
      <View style={styles.filtersWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          {muscleGroups.map((group, index) => (
            <TouchableOpacity
              key={group}
              style={[
                styles.filterChip,
                selectedMuscleGroup === group && styles.filterChipActive
              ]}
              onPress={() => setSelectedMuscleGroup(group)}
            >
              <Text style={[
                styles.filterChipText,
                selectedMuscleGroup === group && styles.filterChipTextActive
              ]}>
                {group}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Results Count */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {filteredExercises.length} exercises found
        </Text>
      </View>

      {/* Exercises List */}
      <FlatList
        data={filteredExercises}
        renderItem={renderExerciseCard}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.surface,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: theme.text.primary,
  },
  invisiblePlaceholder: {
    width: 40,
    height: 40,
    backgroundColor: theme.background,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.sizes.base,
    color: theme.text.primary,
    paddingVertical: spacing.xs,
  },
  filtersWrapper: {
    marginHorizontal: spacing.lg, // Agregar margen a los lados
    marginTop: spacing.md,
    marginBottom: 0, // Espacio eliminado completamente
  },
  filtersContainer: {
    // Quitar altura fija que está causando el corte
  },
  filtersContent: {
    paddingLeft: spacing.lg, // Padding suficiente para evitar cortes
    paddingRight: spacing.lg, // Padding suficiente para evitar cortes
    paddingVertical: spacing.sm, // Reducido el padding vertical
    gap: spacing.sm,
    alignItems: 'flex-start', // Cambiar de center a flex-start para evitar cortes
    // Quitar altura fija que está causando el corte
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.surface,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80, // Increased minimum width
    maxWidth: 120, // Added maximum width for consistency
  },
  filterChipActive: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.text.primary,
    textAlign: 'center',
  } as any,
  filterChipTextActive: {
    color: theme.background,
  },
  resultsContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginTop: 4, // Espacio mínimo desde los filtros
  },
  resultsText: {
    fontSize: typography.sizes.sm,
    color: theme.text.secondary,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl * 2, // Más espacio para evitar cortes en la parte inferior
  },
  exerciseCard: {
    backgroundColor: theme.cardBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  exerciseName: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: theme.text.primary,
    flex: 1,
    marginRight: spacing.sm,
  },
  difficultyBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 20, // Full rounded
  },
  difficultyText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: theme.background,
  },
  muscleGroup: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: theme.primary,
    marginBottom: spacing.sm,
  },
  exerciseDescription: {
    fontSize: typography.sizes.sm,
    color: theme.text.secondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  exerciseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  equipmentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  equipmentText: {
    fontSize: typography.sizes.sm,
    color: theme.text.secondary,
  },
  additionalMuscles: {
    fontSize: typography.sizes.sm,
    color: theme.text.secondary,
  },
});
