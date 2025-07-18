import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  Modal,
  Alert,
  FlatList 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { spacing, typography, borderRadius } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import routinesData from '../data/routines.json';
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

interface RoutineExercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  weight: string | null;
  rest: string;
}

interface Routine {
  id: string;
  name: string;
  description: string;
  muscleGroups: string[];
  exercises: RoutineExercise[];
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  lastPerformed: string | null;
  isActive: boolean;
  createdDate: string;
}

interface RoutinesScreenProps {
  onBackPress: () => void;
  onStartRoutine?: (routine: Routine) => void;
}

const muscleGroups = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];

export const RoutinesScreen: React.FC<RoutinesScreenProps> = ({ 
  onBackPress,
  onStartRoutine 
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();

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

  const [routines, setRoutines] = useState<Routine[]>(routinesData as Routine[]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Estados para crear rutina
  const [newRoutineName, setNewRoutineName] = useState('');
  const [newRoutineDescription, setNewRoutineDescription] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<RoutineExercise[]>([]);
  const [modalMuscleFilter, setModalMuscleFilter] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');

  const filteredRoutines = useMemo(() => {
    let filtered = routines;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(routine =>
        routine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        routine.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [routines, searchQuery]);

  const filteredExercises = useMemo(() => {
    const exercises = exercisesData as Exercise[];
    if (modalMuscleFilter !== 'All') {
      return exercises.filter(exercise => 
        exercise.muscleGroup === modalMuscleFilter
      );
    }
    return exercises;
  }, [modalMuscleFilter]);

  const createRoutine = () => {
    if (!newRoutineName.trim()) {
      Alert.alert('Error', 'El nombre de la rutina es obligatorio');
      return;
    }
    if (selectedExercises.length === 0) {
      Alert.alert('Error', 'Debes agregar al menos un ejercicio');
      return;
    }

    const newRoutine: Routine = {
      id: Date.now().toString(),
      name: newRoutineName.trim(),
      description: newRoutineDescription.trim() || 'Rutina personalizada',
      muscleGroups: [...new Set(selectedExercises.map(ex => {
        const exercise = exercisesData.find(e => e.id === ex.id);
        return exercise?.muscleGroup || 'Other';
      }))],
      exercises: selectedExercises,
      duration: '45 min', // Calculado aproximadamente
      difficulty: selectedDifficulty,
      lastPerformed: null,
      isActive: false,
      createdDate: new Date().toISOString().split('T')[0]
    };

    setRoutines(prev => [...prev, newRoutine]);
    setNewRoutineName('');
    setNewRoutineDescription('');
    setSelectedExercises([]);
    setSelectedDifficulty('Intermediate');
    setShowCreateModal(false);
    Alert.alert('Éxito', 'Rutina creada correctamente');
  };

  const addExerciseToRoutine = (exercise: Exercise) => {
    const routineExercise: RoutineExercise = {
      id: exercise.id,
      name: exercise.name,
      sets: 3,
      reps: '10-12',
      weight: null,
      rest: '60s'
    };

    setSelectedExercises(prev => {
      if (prev.find(ex => ex.id === exercise.id)) {
        return prev; // Ya existe
      }
      return [...prev, routineExercise];
    });
  };

  const removeExerciseFromRoutine = (exerciseId: string) => {
    setSelectedExercises(prev => prev.filter(ex => ex.id !== exerciseId));
  };

  const deleteRoutine = (routineId: string) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que quieres eliminar esta rutina?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => setRoutines(prev => prev.filter(routine => routine.id !== routineId))
        }
      ]
    );
  };

  const toggleRoutineActive = (routineId: string) => {
    const routine = routines.find(r => r.id === routineId);
    if (routine && onStartRoutine) {
      onStartRoutine(routine);
    }
  };

  const renderRoutineCard = ({ item }: { item: Routine }) => (
    <View style={styles.routineCard}>
      <View style={styles.routineHeader}>
        <View style={styles.routineInfo}>
          <Text style={styles.routineName}>{item.name}</Text>
          <View style={styles.routineMeta}>
            <View style={[
              styles.difficultyBadge, 
              { backgroundColor: getDifficultyColor(item.difficulty) }
            ]}>
              <Text style={styles.difficultyText}>{item.difficulty}</Text>
            </View>
            <Text style={styles.routineDuration}>{item.duration}</Text>
          </View>
        </View>
        
        <View style={styles.routineActions}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: theme.surface }]}
            onPress={() => toggleRoutineActive(item.id)}
          >
            <Ionicons 
              name="play" 
              size={16} 
              color={theme.text.primary} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: theme.error + '20' }]}
            onPress={() => deleteRoutine(item.id)}
          >
            <Ionicons name="trash-outline" size={16} color={theme.error} />
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={styles.routineDescription}>{item.description}</Text>
      
      <View style={styles.routineDetails}>
        <View style={styles.muscleGroups}>
          {item.muscleGroups.slice(0, 3).map((group, index) => (
            <View key={group} style={styles.muscleGroupChip}>
              <Text style={styles.muscleGroupText}>{group}</Text>
            </View>
          ))}
          {item.muscleGroups.length > 3 && (
            <Text style={styles.moreGroups}>+{item.muscleGroups.length - 3}</Text>
          )}
        </View>
        
        <View style={styles.routineStats}>
          <Text style={styles.exerciseCount}>{item.exercises.length} ejercicios</Text>
          {item.lastPerformed && (
            <Text style={styles.lastPerformed}>
              Último: {new Date(item.lastPerformed).toLocaleDateString('es-ES')}
            </Text>
          )}
        </View>
      </View>
    </View>
  );

  const renderExerciseCard = ({ item }: { item: Exercise }) => {
    const isSelected = selectedExercises.find(ex => ex.id === item.id);
    
    return (
      <TouchableOpacity 
        style={[styles.exerciseCard, isSelected && styles.exerciseCardSelected]}
        onPress={() => isSelected ? removeExerciseFromRoutine(item.id) : addExerciseToRoutine(item)}
      >
        <View style={styles.exerciseHeader}>
          <Text style={styles.exerciseName}>{item.name}</Text>
          <View style={styles.exerciseActions}>
            <Ionicons 
              name={isSelected ? "checkmark-circle" : "add-circle-outline"} 
              size={24} 
              color={isSelected ? theme.primary : theme.text.secondary} 
            />
          </View>
        </View>
        
        <Text style={styles.muscleGroup}>{item.muscleGroup}</Text>
        <Text style={styles.exerciseDescription}>{item.description}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
          <Ionicons name="arrow-back" size={24} color={theme.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rutinas</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Ionicons name="add" size={24} color={theme.background} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={theme.text.secondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar rutinas..."
          placeholderTextColor={theme.text.secondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Results Count */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {filteredRoutines.length} rutinas encontradas
        </Text>
      </View>

      {/* Routines List */}
      <FlatList
        data={filteredRoutines}
        renderItem={renderRoutineCard}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />

      {/* Create Routine Modal */}
      <Modal
        visible={showCreateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Crear Nueva Rutina</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nombre de la rutina</Text>
              <TextInput
                style={styles.input}
                value={newRoutineName}
                onChangeText={setNewRoutineName}
                placeholder="Ej: Push Day"
                placeholderTextColor={theme.text.secondary}
                autoFocus
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Descripción (opcional)</Text>
              <TextInput
                style={styles.input}
                value={newRoutineDescription}
                onChangeText={setNewRoutineDescription}
                placeholder="Describe tu rutina..."
                placeholderTextColor={theme.text.secondary}
                multiline
                numberOfLines={2}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Dificultad</Text>
              <View style={styles.difficultySelector}>
                {(['Beginner', 'Intermediate', 'Advanced'] as const).map((difficulty) => (
                  <TouchableOpacity
                    key={difficulty}
                    style={[
                      styles.difficultyOption,
                      selectedDifficulty === difficulty && styles.difficultyOptionActive,
                      { backgroundColor: selectedDifficulty === difficulty ? getDifficultyColor(difficulty) : theme.surface }
                    ]}
                    onPress={() => setSelectedDifficulty(difficulty)}
                  >
                    <Text style={[
                      styles.difficultyOptionText,
                      selectedDifficulty === difficulty && styles.difficultyOptionTextActive
                    ]}>
                      {difficulty === 'Beginner' ? 'Principiante' : 
                       difficulty === 'Intermediate' ? 'Intermedio' : 'Avanzado'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.exercisesHeader}>
                <Text style={styles.inputLabel}>
                  Ejercicios ({selectedExercises.length})
                </Text>
                <TouchableOpacity 
                  style={styles.addExerciseButton}
                  onPress={() => setShowExerciseModal(true)}
                >
                  <Ionicons name="add" size={16} color={theme.primary} />
                  <Text style={styles.addExerciseText}>Agregar</Text>
                </TouchableOpacity>
              </View>
              
              {selectedExercises.length > 0 ? (
                <ScrollView style={styles.selectedExercisesList} nestedScrollEnabled>
                  {selectedExercises.map((exercise) => (
                    <View key={exercise.id} style={styles.selectedExerciseItem}>
                      <Text style={styles.selectedExerciseName}>{exercise.name}</Text>
                      <TouchableOpacity onPress={() => removeExerciseFromRoutine(exercise.id)}>
                        <Ionicons name="close-circle" size={20} color={theme.error} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              ) : (
                <Text style={styles.noExercisesText}>
                  No has agregado ejercicios aún
                </Text>
              )}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowCreateModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={createRoutine}
              >
                <Text style={styles.saveButtonText}>Crear Rutina</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Exercise Selection Modal */}
      <Modal
        visible={showExerciseModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowExerciseModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.exerciseModalContent}>
            <View style={styles.exerciseModalHeader}>
              <Text style={styles.modalTitle}>Seleccionar Ejercicios</Text>
              <TouchableOpacity onPress={() => setShowExerciseModal(false)}>
                <Ionicons name="close" size={24} color={theme.text.primary} />
              </TouchableOpacity>
            </View>

            {/* Muscle Group Filters for Exercise Modal */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.modalFiltersContainer}
              contentContainerStyle={styles.modalFiltersContent}
            >
              {muscleGroups.map((group) => (
                <TouchableOpacity
                  key={group}
                  style={[
                    styles.filterChip,
                    modalMuscleFilter === group && styles.filterChipActive
                  ]}
                  onPress={() => setModalMuscleFilter(group)}
                >
                  <Text style={[
                    styles.filterChipText,
                    modalMuscleFilter === group && styles.filterChipTextActive
                  ]}>
                    {group}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <FlatList
              data={filteredExercises}
              renderItem={renderExerciseCard}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.exerciseModalList}
            />
          </View>
        </View>
      </Modal>
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.primary,
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
  resultsContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginTop: spacing.md,
  },
  resultsText: {
    fontSize: typography.sizes.sm,
    color: theme.text.secondary,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  routineCard: {
    backgroundColor: theme.cardBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  routineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  routineInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  routineName: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: theme.text.primary,
    marginBottom: spacing.xs,
  },
  routineMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  difficultyBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 20,
  },
  difficultyText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: theme.background,
  },
  routineDuration: {
    fontSize: typography.sizes.sm,
    color: theme.text.secondary,
  },
  routineActions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  routineDescription: {
    fontSize: typography.sizes.sm,
    color: theme.text.secondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  routineDetails: {
    gap: spacing.sm,
  },
  muscleGroups: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  muscleGroupChip: {
    backgroundColor: theme.primary + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  muscleGroupText: {
    fontSize: typography.sizes.xs,
    color: theme.primary,
    fontWeight: typography.weights.medium,
  },
  moreGroups: {
    fontSize: typography.sizes.xs,
    color: theme.text.secondary,
  },
  routineStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exerciseCount: {
    fontSize: typography.sizes.sm,
    color: theme.text.primary,
    fontWeight: typography.weights.medium,
  },
  lastPerformed: {
    fontSize: typography.sizes.xs,
    color: theme.text.secondary,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  modalContent: {
    backgroundColor: theme.cardBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    width: '100%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: theme.text.primary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: theme.text.primary,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: theme.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: typography.sizes.base,
    color: theme.text.primary,
    textAlignVertical: 'top',
  },
  exercisesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  addExerciseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  addExerciseText: {
    fontSize: typography.sizes.sm,
    color: theme.primary,
    fontWeight: typography.weights.medium,
  },
  selectedExercisesList: {
    maxHeight: 120,
    backgroundColor: theme.surface,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
  },
  selectedExerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.background,
  },
  selectedExerciseName: {
    fontSize: typography.sizes.sm,
    color: theme.text.primary,
    flex: 1,
  },
  noExercisesText: {
    fontSize: typography.sizes.sm,
    color: theme.text.secondary,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: spacing.md,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: theme.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: typography.sizes.base,
    color: theme.text.primary,
    fontWeight: typography.weights.medium,
  },
  saveButton: {
    flex: 1,
    backgroundColor: theme.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: typography.sizes.base,
    color: theme.background,
    fontWeight: typography.weights.semibold,
  },
  // Exercise Modal Styles
  exerciseModalContent: {
    backgroundColor: theme.cardBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    paddingTop: spacing.lg, // Espacio reducido en la parte superior
    width: '100%',
    height: '80%',
  },
  exerciseModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalFiltersContainer: {
    // Quitar altura fija que está causando el corte
    marginBottom: spacing.md,
  },
  modalFiltersContent: {
    paddingLeft: spacing.lg, // Padding suficiente para evitar cortes
    paddingRight: spacing.lg, // Padding suficiente para evitar cortes
    paddingVertical: spacing.lg, // Más padding vertical
    gap: spacing.sm,
    alignItems: 'flex-start', // Cambiar de center a flex-start para evitar cortes
    // Quitar altura fija que está causando el corte
  },
  exerciseModalList: {
    paddingBottom: spacing.xl,
  },
  exerciseCard: {
    backgroundColor: theme.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  exerciseCardSelected: {
    borderColor: theme.primary,
    backgroundColor: theme.primary + '10',
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  exerciseName: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: theme.text.primary,
    flex: 1,
  },
  exerciseActions: {
    marginLeft: spacing.sm,
  },
  muscleGroup: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: theme.primary,
    marginBottom: spacing.xs,
  },
  exerciseDescription: {
    fontSize: typography.sizes.sm,
    color: theme.text.secondary,
    lineHeight: 18,
  },
  // Modal Filter Styles
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
    minWidth: 80,
    maxWidth: 120,
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
  // Difficulty Selector Styles
  difficultySelector: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  difficultyOption: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.surface,
    minHeight: 44,
  },
  difficultyOptionActive: {
    borderColor: 'transparent',
  },
  difficultyOptionText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    color: theme.text.primary,
    textAlign: 'center',
    flexWrap: 'nowrap',
  },
  difficultyOptionTextActive: {
    color: theme.background,
    fontWeight: typography.weights.semibold,
  },
});
