import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { spacing, typography, borderRadius } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import { RoutineHistory, CompletedExercise } from '../types/history';

interface RoutineHistoryDetailScreenProps {
  routineHistory: RoutineHistory;
  onGoBack: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const RoutineHistoryDetailScreen: React.FC<RoutineHistoryDetailScreenProps> = ({ 
  routineHistory, 
  onGoBack,
  onEdit,
  onDelete
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long',
      day: '2-digit', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCompletionIcon = (completed: boolean) => {
    return completed 
      ? { icon: 'checkmark-circle', color: theme.success }
      : { icon: 'close-circle', color: theme.error };
  };

  const renderExerciseCard = (exercise: CompletedExercise, index: number) => {
    const completionIcon = getCompletionIcon(exercise.completed);
    
    return (
      <View 
        key={exercise.id} 
        style={[
          styles.exerciseCard,
          exercise.completed && styles.exerciseCardCompleted
        ]}
      >
        <View style={styles.exerciseHeader}>
          <View style={styles.exerciseNumber}>
            <Text style={styles.exerciseNumberText}>{index + 1}</Text>
          </View>
          <View style={styles.exerciseInfo}>
            <Text style={[
              styles.exerciseName,
              !exercise.completed && styles.exerciseNameIncomplete
            ]}>
              {exercise.name}
            </Text>
            <View style={styles.exerciseDetails}>
              <Text style={styles.exerciseDetailText}>
                {exercise.totalSets} series • {exercise.reps} reps
                {exercise.weight && ` • ${exercise.weight}`}
              </Text>
              <Text style={styles.exerciseRestText}>Descanso: {exercise.rest}</Text>
            </View>
          </View>
          <View style={styles.statusContainer}>
            <Ionicons 
              name={completionIcon.icon as any} 
              size={24} 
              color={completionIcon.color} 
            />
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressLabel}>Series completadas:</Text>
            <Text style={[
              styles.progressValue,
              { color: exercise.completed ? theme.success : theme.text.secondary }
            ]}>
              {exercise.completedSets} / {exercise.totalSets}
            </Text>
          </View>
          
          {/* Progress bar for sets */}
          <View style={styles.setsProgressBar}>
            <View style={styles.setsProgressBackground}>
              <View 
                style={[
                  styles.setsProgressFill,
                  { 
                    width: `${(exercise.completedSets / exercise.totalSets) * 100}%`,
                    backgroundColor: exercise.completed ? theme.success : theme.primary
                  }
                ]} 
              />
            </View>
          </View>
        </View>
      </View>
    );
  };

  const getOverallStats = () => {
    const completedExercises = routineHistory.exercises.filter(ex => ex.completed).length;
    const totalSets = routineHistory.exercises.reduce((acc, ex) => acc + ex.totalSets, 0);
    const completedSets = routineHistory.exercises.reduce((acc, ex) => acc + ex.completedSets, 0);
    
    return { completedExercises, totalSets, completedSets };
  };

  const stats = getOverallStats();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
          <Ionicons name="arrow-back" size={24} color={theme.text.primary} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{routineHistory.routineName}</Text>
          <Text style={styles.headerSubtitle}>Detalle de rutina</Text>
        </View>
        <View style={styles.actionButtons}>
          {onEdit && (
            <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
              <Ionicons name="create-outline" size={20} color={theme.text.primary} />
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={onDelete}>
              <Ionicons name="trash-outline" size={20} color={theme.error} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Routine Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Resumen de Entrenamiento</Text>
          <Text style={styles.summaryDate}>{formatDate(routineHistory.completedAt)}</Text>
          
          <View style={styles.summaryStats}>
            <View style={styles.summaryStatItem}>
              <Text style={styles.summaryStatValue}>{routineHistory.duration}</Text>
              <Text style={styles.summaryStatLabel}>Duración total</Text>
            </View>
            
            <View style={styles.summaryStatItem}>
              <Text style={[
                styles.summaryStatValue,
                { color: routineHistory.completionPercentage === 100 ? theme.success : theme.primary }
              ]}>
                {routineHistory.completionPercentage}%
              </Text>
              <Text style={styles.summaryStatLabel}>Completado</Text>
            </View>
          </View>

          <View style={styles.detailedStats}>
            <View style={styles.detailedStatItem}>
              <Text style={styles.detailedStatLabel}>Ejercicios completados:</Text>
              <Text style={styles.detailedStatValue}>
                {stats.completedExercises} de {routineHistory.totalExercises}
              </Text>
            </View>
            
            <View style={styles.detailedStatItem}>
              <Text style={styles.detailedStatLabel}>Series completadas:</Text>
              <Text style={styles.detailedStatValue}>
                {stats.completedSets} de {stats.totalSets}
              </Text>
            </View>
          </View>
        </View>

        {/* Exercise Details */}
        <View style={styles.exercisesSection}>
          <Text style={styles.sectionTitle}>
            Ejercicios ({routineHistory.exercises.length})
          </Text>
          
          {routineHistory.exercises.map((exercise, index) => 
            renderExerciseCard(exercise, index)
          )}
        </View>

        {/* Performance Analysis */}
        {routineHistory.completionPercentage < 100 && (
          <View style={styles.analysisCard}>
            <Text style={styles.analysisTitle}>Análisis de Rendimiento</Text>
            <View style={styles.analysisContent}>
              <Ionicons name="information-circle-outline" size={20} color={theme.primary} />
              <Text style={styles.analysisText}>
                {routineHistory.completionPercentage < 50 
                  ? "Parece que tuviste dificultades con esta rutina. Considera reducir la intensidad o tomarte más descanso."
                  : "¡Buen esfuerzo! La próxima vez intenta completar los ejercicios restantes para maximizar los beneficios."
                }
              </Text>
            </View>
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
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
    alignItems: 'center',
    marginHorizontal: spacing.md,
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
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.xs,
  },
  deleteButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  summaryCard: {
    backgroundColor: theme.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginVertical: spacing.lg,
  },
  summaryTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: theme.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  summaryDate: {
    fontSize: typography.sizes.sm,
    color: theme.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    textTransform: 'capitalize',
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.lg,
  },
  summaryStatItem: {
    alignItems: 'center',
  },
  summaryStatValue: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: theme.primary,
    marginBottom: spacing.xs,
  },
  summaryStatLabel: {
    fontSize: typography.sizes.sm,
    color: theme.text.secondary,
    textAlign: 'center',
  },
  detailedStats: {
    borderTopWidth: 1,
    borderTopColor: theme.background,
    paddingTop: spacing.md,
  },
  detailedStatItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  detailedStatLabel: {
    fontSize: typography.sizes.sm,
    color: theme.text.secondary,
  },
  detailedStatValue: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: theme.text.primary,
  },
  exercisesSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: theme.text.primary,
    marginBottom: spacing.md,
  },
  exerciseCard: {
    backgroundColor: theme.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  exerciseCardCompleted: {
    borderColor: theme.success + '40',
    backgroundColor: theme.success + '10',
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  exerciseNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
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
  exerciseNameIncomplete: {
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
  statusContainer: {
    marginLeft: spacing.md,
  },
  progressContainer: {
    borderTopWidth: 1,
    borderTopColor: theme.background,
    paddingTop: spacing.sm,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  progressLabel: {
    fontSize: typography.sizes.sm,
    color: theme.text.secondary,
    fontWeight: typography.weights.medium,
  },
  progressValue: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
  },
  setsProgressBar: {
    marginBottom: spacing.xs,
  },
  setsProgressBackground: {
    height: 4,
    backgroundColor: theme.background,
    borderRadius: 2,
    overflow: 'hidden',
  },
  setsProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  analysisCard: {
    backgroundColor: theme.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  analysisTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: theme.text.primary,
    marginBottom: spacing.md,
  },
  analysisContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  analysisText: {
    flex: 1,
    fontSize: typography.sizes.sm,
    color: theme.text.secondary,
    marginLeft: spacing.sm,
    lineHeight: 20,
  },
  bottomPadding: {
    height: spacing.xl,
  },
});
