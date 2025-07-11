import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  TextInput,
  Modal,
  Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../constants/theme';
import { RoutineHistory, CompletedExercise } from '../types/history';

interface EditRoutineHistoryScreenProps {
  routineHistory: RoutineHistory;
  onGoBack: () => void;
  onSave: (updatedHistory: RoutineHistory) => void;
}

export const EditRoutineHistoryScreen: React.FC<EditRoutineHistoryScreenProps> = ({ 
  routineHistory, 
  onGoBack, 
  onSave 
}) => {
  const insets = useSafeAreaInsets();
  const [editedHistory, setEditedHistory] = useState<RoutineHistory>({ ...routineHistory });
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [tempDuration, setTempDuration] = useState(routineHistory.duration);

  const handleSave = () => {
    // Validar que la duración tenga el formato correcto
    const durationRegex = /^\d{1,2}:\d{2}$/;
    if (!durationRegex.test(editedHistory.duration)) {
      Alert.alert('Error', 'El formato de duración debe ser MM:SS (ej: 45:30)');
      return;
    }

    // Recalcular estadísticas
    const completedExercises = editedHistory.exercises.filter(ex => ex.completed).length;
    const completionPercentage = Math.round((completedExercises / editedHistory.totalExercises) * 100);

    const updatedHistory: RoutineHistory = {
      ...editedHistory,
      completedExercises,
      completionPercentage
    };

    onSave(updatedHistory);
  };

  const toggleExerciseCompletion = (exerciseId: string) => {
    setEditedHistory(prev => ({
      ...prev,
      exercises: prev.exercises.map(exercise =>
        exercise.id === exerciseId
          ? { 
              ...exercise, 
              completed: !exercise.completed,
              completedSets: !exercise.completed ? exercise.totalSets : 0
            }
          : exercise
      )
    }));
  };

  const updateExerciseSets = (exerciseId: string, completedSets: number) => {
    setEditedHistory(prev => ({
      ...prev,
      exercises: prev.exercises.map(exercise =>
        exercise.id === exerciseId
          ? { 
              ...exercise, 
              completedSets: Math.max(0, Math.min(completedSets, exercise.totalSets)),
              completed: completedSets === exercise.totalSets
            }
          : exercise
      )
    }));
  };

  const handleDurationSave = () => {
    const durationRegex = /^\d{1,2}:\d{2}$/;
    if (!durationRegex.test(tempDuration)) {
      Alert.alert('Error', 'El formato de duración debe ser MM:SS (ej: 45:30)');
      return;
    }
    
    setEditedHistory(prev => ({ ...prev, duration: tempDuration }));
    setShowTimeModal(false);
  };

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

  const renderExerciseCard = (exercise: CompletedExercise, index: number) => {
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
              exercise.completed && styles.exerciseNameCompleted
            ]}>
              {exercise.name}
            </Text>
            <Text style={styles.exerciseDetails}>
              {exercise.totalSets} series • {exercise.reps} reps
              {exercise.weight && ` • ${exercise.weight}`}
            </Text>
          </View>
          <TouchableOpacity 
            style={[
              styles.completeToggle,
              exercise.completed && styles.completeToggleActive
            ]}
            onPress={() => toggleExerciseCompletion(exercise.id)}
          >
            <Ionicons 
              name={exercise.completed ? "checkmark" : "ellipse-outline"} 
              size={20} 
              color={exercise.completed ? colors.background : colors.text.secondary} 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.setsEditor}>
          <Text style={styles.setsLabel}>Series completadas:</Text>
          <View style={styles.setsControls}>
            <TouchableOpacity 
              style={styles.setButton}
              onPress={() => updateExerciseSets(exercise.id, exercise.completedSets - 1)}
              disabled={exercise.completedSets === 0}
            >
              <Ionicons 
                name="remove" 
                size={16} 
                color={exercise.completedSets === 0 ? colors.text.secondary : colors.primary} 
              />
            </TouchableOpacity>
            <Text style={styles.setsCount}>
              {exercise.completedSets} / {exercise.totalSets}
            </Text>
            <TouchableOpacity 
              style={styles.setButton}
              onPress={() => updateExerciseSets(exercise.id, exercise.completedSets + 1)}
              disabled={exercise.completedSets >= exercise.totalSets}
            >
              <Ionicons 
                name="add" 
                size={16} 
                color={exercise.completedSets >= exercise.totalSets ? colors.text.secondary : colors.primary} 
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
        <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Rutina</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Guardar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Basic Info */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Información Básica</Text>
          <Text style={styles.routineName}>{editedHistory.routineName}</Text>
          <Text style={styles.routineDate}>{formatDate(editedHistory.completedAt)}</Text>
          
          <TouchableOpacity 
            style={styles.durationButton}
            onPress={() => setShowTimeModal(true)}
          >
            <Text style={styles.durationLabel}>Duración:</Text>
            <View style={styles.durationValue}>
              <Text style={styles.durationText}>{editedHistory.duration}</Text>
              <Ionicons name="create-outline" size={16} color={colors.primary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Exercises */}
        <View style={styles.exercisesSection}>
          <Text style={styles.sectionTitle}>
            Ejercicios ({editedHistory.exercises.length})
          </Text>
          
          {editedHistory.exercises.map((exercise, index) => 
            renderExerciseCard(exercise, index)
          )}
        </View>

        {/* Stats Preview */}
        <View style={styles.statsPreview}>
          <Text style={styles.cardTitle}>Vista Previa</Text>
          <View style={styles.previewStats}>
            <View style={styles.previewStat}>
              <Text style={styles.previewStatValue}>
                {editedHistory.exercises.filter(ex => ex.completed).length}
              </Text>
              <Text style={styles.previewStatLabel}>Ejercicios</Text>
            </View>
            <View style={styles.previewStat}>
              <Text style={[
                styles.previewStatValue,
                { color: Math.round((editedHistory.exercises.filter(ex => ex.completed).length / editedHistory.totalExercises) * 100) === 100 ? colors.success : colors.primary }
              ]}>
                {Math.round((editedHistory.exercises.filter(ex => ex.completed).length / editedHistory.totalExercises) * 100)}%
              </Text>
              <Text style={styles.previewStatLabel}>Completado</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Duration Edit Modal */}
      <Modal
        visible={showTimeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTimeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.timeModal}>
            <Text style={styles.modalTitle}>Editar Duración</Text>
            <Text style={styles.modalSubtitle}>Formato: MM:SS (ej: 45:30)</Text>
            
            <TextInput
              style={styles.timeInput}
              value={tempDuration}
              onChangeText={setTempDuration}
              placeholder="00:00"
              placeholderTextColor={colors.text.secondary}
              keyboardType="numeric"
              maxLength={5}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={() => {
                  setTempDuration(editedHistory.duration);
                  setShowTimeModal(false);
                }}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalSaveButton}
                onPress={handleDurationSave}
              >
                <Text style={styles.modalSaveText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  saveButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
  },
  saveButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginVertical: spacing.lg,
  },
  cardTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  routineName: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  routineDate: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
    textTransform: 'capitalize',
  },
  durationButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  durationLabel: {
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
  },
  durationValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  durationText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  exercisesSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  exerciseCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  exerciseCardCompleted: {
    borderColor: colors.success + '40',
    backgroundColor: colors.success + '10',
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
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  exerciseNumberText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.background,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  exerciseNameCompleted: {
    color: colors.success,
  },
  exerciseDetails: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  completeToggle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.text.secondary,
  },
  completeToggleActive: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  setsEditor: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.background,
  },
  setsLabel: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
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
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  setsCount: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    minWidth: 50,
    textAlign: 'center',
  },
  statsPreview: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  previewStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  previewStat: {
    alignItems: 'center',
  },
  previewStatValue: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  previewStatLabel: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  bottomPadding: {
    height: spacing.xl,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  timeModal: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  modalSubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  timeInput: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: typography.sizes.lg,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.text.secondary,
  },
  modalSaveButton: {
    flex: 1,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  modalSaveText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.background,
  },
});
