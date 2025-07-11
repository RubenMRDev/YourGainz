import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { spacing, typography, borderRadius } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';

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
  exercises: RoutineExercise[];
  duration: string;
}

interface ExerciseTrackingState {
  id: string;
  completed: boolean;
  completedSets: number;
}

interface RoutineTrackingScreenProps {
  routine: Routine;
  onGoBack: () => void;
  onFinishRoutine: (exerciseStates: ExerciseTrackingState[], totalTime: string) => void;
}

export const RoutineTrackingScreen: React.FC<RoutineTrackingScreenProps> = ({ 
  routine, 
  onGoBack, 
  onFinishRoutine 
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();
  const [exerciseStates, setExerciseStates] = useState<ExerciseTrackingState[]>([]);
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Inicializar estados de ejercicios
  useEffect(() => {
    const initialStates: ExerciseTrackingState[] = routine.exercises.map(exercise => ({
      id: exercise.id,
      completed: false,
      completedSets: 0
    }));
    setExerciseStates(initialStates);
  }, [routine]);

  // Timer para el tiempo transcurrido
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const toggleExerciseComplete = (exerciseId: string) => {
    setExerciseStates(prev => 
      prev.map(state => 
        state.id === exerciseId 
          ? { 
              ...state, 
              completed: !state.completed,
              completedSets: !state.completed ? routine.exercises.find(ex => ex.id === exerciseId)?.sets || 0 : 0
            }
          : state
      )
    );
  };

  const incrementSet = (exerciseId: string) => {
    const exercise = routine.exercises.find(ex => ex.id === exerciseId);
    if (!exercise) return;

    setExerciseStates(prev => 
      prev.map(state => 
        state.id === exerciseId 
          ? { 
              ...state, 
              completedSets: Math.min(state.completedSets + 1, exercise.sets),
              completed: state.completedSets + 1 >= exercise.sets
            }
          : state
      )
    );
  };

  const decrementSet = (exerciseId: string) => {
    setExerciseStates(prev => 
      prev.map(state => 
        state.id === exerciseId 
          ? { 
              ...state, 
              completedSets: Math.max(state.completedSets - 1, 0),
              completed: false
            }
          : state
      )
    );
  };

  const getElapsedTime = () => {
    const diff = currentTime.getTime() - startTime.getTime();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getCompletedExercisesCount = () => {
    return exerciseStates.filter(state => state.completed).length;
  };

  const getProgressPercentage = () => {
    if (routine.exercises.length === 0) return 0;
    return Math.round((getCompletedExercisesCount() / routine.exercises.length) * 100);
  };

  const handleFinishRoutine = () => {
    const completedCount = getCompletedExercisesCount();
    const totalExercises = routine.exercises.length;
    
    if (completedCount === 0) {
      Alert.alert(
        'Rutina incompleta',
        '¿Estás seguro que quieres terminar sin completar ningún ejercicio?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Terminar', 
            style: 'destructive',
            onPress: () => onFinishRoutine(exerciseStates, getElapsedTime())
          }
        ]
      );
      return;
    }

    if (completedCount < totalExercises) {
      Alert.alert(
        'Rutina incompleta',
        `Has completado ${completedCount} de ${totalExercises} ejercicios. ¿Quieres terminar la rutina?`,
        [
          { text: 'Continuar', style: 'cancel' },
          { 
            text: 'Terminar', 
            onPress: () => onFinishRoutine(exerciseStates, getElapsedTime())
          }
        ]
      );
      return;
    }

    // Rutina completada al 100%
    Alert.alert(
      '¡Felicitaciones!',
      `Has completado toda la rutina en ${getElapsedTime()}. ¡Excelente trabajo!`,
      [
        { 
          text: 'Terminar', 
          onPress: () => onFinishRoutine(exerciseStates, getElapsedTime())
        }
      ]
    );
  };

  const handleGoBack = () => {
    if (getCompletedExercisesCount() > 0) {
      Alert.alert(
        'Salir de la rutina',
        '¿Estás seguro que quieres salir? Perderás el progreso actual.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Salir', style: 'destructive', onPress: onGoBack }
        ]
      );
    } else {
      onGoBack();
    }
  };

  const renderExerciseCard = (exercise: RoutineExercise, index: number) => {
    const state = exerciseStates.find(s => s.id === exercise.id);
    if (!state) return null;

    return (
      <View key={exercise.id} style={[
        styles.exerciseCard,
        state.completed && styles.exerciseCardCompleted
      ]}>
        <View style={styles.exerciseHeader}>
          <View style={styles.exerciseNumber}>
            <Text style={styles.exerciseNumberText}>{index + 1}</Text>
          </View>
          <View style={styles.exerciseInfo}>
            <Text style={[
              styles.exerciseName,
              state.completed && styles.exerciseNameCompleted
            ]}>
              {exercise.name}
            </Text>
            <View style={styles.exerciseDetails}>
              <Text style={styles.exerciseDetailText}>
                {exercise.sets} series • {exercise.reps} reps
                {exercise.weight && ` • ${exercise.weight}`}
              </Text>
              <Text style={styles.exerciseRestText}>Descanso: {exercise.rest}</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={[
              styles.completeButton,
              state.completed && styles.completeButtonActive
            ]}
            onPress={() => toggleExerciseComplete(exercise.id)}
          >
            <Ionicons 
              name={state.completed ? "checkmark" : "ellipse-outline"} 
              size={24} 
              color={state.completed ? theme.background : theme.text.secondary} 
            />
          </TouchableOpacity>
        </View>

        {/* Sets tracking */}
        <View style={styles.setsContainer}>
          <Text style={styles.setsLabel}>Series completadas:</Text>
          <View style={styles.setsControls}>
            <TouchableOpacity 
              style={styles.setButton}
              onPress={() => decrementSet(exercise.id)}
              disabled={state.completedSets === 0}
            >
              <Ionicons 
                name="remove" 
                size={16} 
                color={state.completedSets === 0 ? theme.text.secondary : theme.primary} 
              />
            </TouchableOpacity>
            <Text style={styles.setsCount}>
              {state.completedSets} / {exercise.sets}
            </Text>
            <TouchableOpacity 
              style={styles.setButton}
              onPress={() => incrementSet(exercise.id)}
              disabled={state.completedSets >= exercise.sets}
            >
              <Ionicons 
                name="add" 
                size={16} 
                color={state.completedSets >= exercise.sets ? theme.text.secondary : theme.primary} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={24} color={theme.text.primary} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{routine.name}</Text>
          <Text style={styles.headerSubtitle}>
            {getCompletedExercisesCount()}/{routine.exercises.length} ejercicios • {getElapsedTime()}
          </Text>
        </View>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>{getProgressPercentage()}%</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <View 
            style={[
              styles.progressBarFill,
              { width: `${getProgressPercentage()}%` }
            ]} 
          />
        </View>
      </View>

      {/* Exercises List */}
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {routine.exercises.map((exercise, index) => 
          renderExerciseCard(exercise, index)
        )}
      </ScrollView>

      {/* Finish Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <TouchableOpacity 
          style={styles.finishButton}
          onPress={handleFinishRoutine}
        >
          <Ionicons name="checkmark-circle" size={24} color={theme.background} />
          <Text style={styles.finishButtonText}>Terminar Rutina</Text>
        </TouchableOpacity>
      </View>
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
  headerInfo: {
    flex: 1,
    marginHorizontal: spacing.md,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: theme.text.primary,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: typography.sizes.sm,
    color: theme.text.secondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  progressContainer: {
    width: 40,
    alignItems: 'center',
  },
  progressText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: theme.primary,
  },
  progressBarContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: theme.surface,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: theme.primary,
    borderRadius: 3,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  exerciseCard: {
    backgroundColor: theme.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  exerciseCardCompleted: {
    borderColor: theme.primary,
    backgroundColor: theme.primary + '10',
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  exerciseNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  exerciseNumberText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: theme.background,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: theme.text.primary,
    marginBottom: spacing.xs,
  },
  exerciseNameCompleted: {
    textDecorationLine: 'line-through',
    color: theme.text.secondary,
  },
  exerciseDetails: {
    marginBottom: spacing.xs,
  },
  exerciseDetailText: {
    fontSize: typography.sizes.sm,
    color: theme.text.secondary,
    marginBottom: spacing.xs / 2,
  },
  exerciseRestText: {
    fontSize: typography.sizes.xs,
    color: theme.primary,
    fontWeight: typography.weights.medium,
  },
  completeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.text.secondary,
  },
  completeButtonActive: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  setsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.background,
  },
  setsLabel: {
    fontSize: typography.sizes.sm,
    color: theme.text.secondary,
    fontWeight: typography.weights.medium,
  },
  setsControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  setButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  setsCount: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: theme.text.primary,
    minWidth: 50,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.surface,
  },
  finishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  finishButtonText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: theme.background,
  },
});
