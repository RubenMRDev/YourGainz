import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  FlatList
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../constants/theme';
import { RoutineHistory } from '../types/history';

interface RoutineHistoryScreenProps {
  onGoBack: () => void;
  onViewRoutineDetail: (routineHistory: RoutineHistory) => void;
  routineHistory: RoutineHistory[];
}

export const RoutineHistoryScreen: React.FC<RoutineHistoryScreenProps> = ({ 
  onGoBack, 
  onViewRoutineDetail,
  routineHistory 
}) => {
  const insets = useSafeAreaInsets();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Hoy, ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Ayer, ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const getCompletionIcon = (percentage: number) => {
    if (percentage === 100) {
      return { icon: 'checkmark-circle', color: colors.success };
    } else if (percentage >= 75) {
      return { icon: 'checkmark-circle-outline', color: colors.primary };
    } else if (percentage >= 50) {
      return { icon: 'remove-circle-outline', color: colors.primary };
    } else {
      return { icon: 'close-circle-outline', color: colors.error };
    }
  };

  const renderHistoryCard = ({ item }: { item: RoutineHistory }) => {
    const completionIcon = getCompletionIcon(item.completionPercentage);
    
    return (
      <TouchableOpacity 
        style={styles.historyCard}
        onPress={() => onViewRoutineDetail(item)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.routineInfo}>
            <Text style={styles.routineName}>{item.routineName}</Text>
            <Text style={styles.routineDate}>{formatDate(item.completedAt)}</Text>
          </View>
          <View style={styles.completionContainer}>
            <Ionicons 
              name={completionIcon.icon as any} 
              size={24} 
              color={completionIcon.color} 
            />
          </View>
        </View>

        <View style={styles.cardStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{item.duration}</Text>
            <Text style={styles.statLabel}>Duración</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {item.completedExercises}/{item.totalExercises}
            </Text>
            <Text style={styles.statLabel}>Ejercicios</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[
              styles.statValue,
              { color: completionIcon.color }
            ]}>
              {item.completionPercentage}%
            </Text>
            <Text style={styles.statLabel}>Completado</Text>
          </View>
        </View>

        {/* Progress bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View 
              style={[
                styles.progressBarFill,
                { 
                  width: `${item.completionPercentage}%`,
                  backgroundColor: completionIcon.color
                }
              ]} 
            />
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.routineDescription} numberOfLines={1}>
            {item.routineDescription}
          </Text>
          <Ionicons name="chevron-forward" size={16} color={colors.text.secondary} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="time-outline" size={64} color={colors.text.secondary} />
      <Text style={styles.emptyTitle}>No hay historial</Text>
      <Text style={styles.emptySubtitle}>
        Completa tu primera rutina para ver el historial aquí
      </Text>
    </View>
  );

  const getStatsOverview = () => {
    if (routineHistory.length === 0) return null;

    const totalRoutines = routineHistory.length;
    const completedRoutines = routineHistory.filter(r => r.completionPercentage === 100).length;
    const totalDuration = routineHistory.reduce((acc, routine) => {
      const [minutes, seconds] = routine.duration.split(':').map(Number);
      return acc + minutes * 60 + seconds;
    }, 0);
    
    const avgDuration = Math.round(totalDuration / totalRoutines / 60);
    const completionRate = Math.round((completedRoutines / totalRoutines) * 100);

    return (
      <View style={styles.statsOverview}>
        <Text style={styles.statsTitle}>Resumen</Text>
        <View style={styles.statsRow}>
          <View style={styles.overviewStat}>
            <Text style={styles.overviewStatValue}>{totalRoutines}</Text>
            <Text style={styles.overviewStatLabel}>Rutinas</Text>
          </View>
          <View style={styles.overviewStat}>
            <Text style={styles.overviewStatValue}>{completedRoutines}</Text>
            <Text style={styles.overviewStatLabel}>Completadas</Text>
          </View>
          <View style={styles.overviewStat}>
            <Text style={styles.overviewStatValue}>{avgDuration}min</Text>
            <Text style={styles.overviewStatLabel}>Promedio</Text>
          </View>
          <View style={styles.overviewStat}>
            <Text style={[
              styles.overviewStatValue,
              { color: completionRate >= 75 ? colors.success : colors.primary }
            ]}>
              {completionRate}%
            </Text>
            <Text style={styles.overviewStatLabel}>Éxito</Text>
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
        <Text style={styles.headerTitle}>Historial de Rutinas</Text>
        <View style={styles.placeholder} />
      </View>

      {routineHistory.length === 0 ? (
        renderEmptyState()
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {getStatsOverview()}
          
          <Text style={styles.sectionTitle}>
            Rutinas Recientes ({routineHistory.length})
          </Text>
          
          <FlatList
            data={routineHistory.sort((a, b) => 
              new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
            )}
            renderItem={renderHistoryCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        </ScrollView>
      )}
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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  statsOverview: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginVertical: spacing.lg,
  },
  statsTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  overviewStat: {
    alignItems: 'center',
  },
  overviewStatValue: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  overviewStatLabel: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  listContainer: {
    paddingBottom: spacing.xl,
  },
  historyCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  routineInfo: {
    flex: 1,
  },
  routineName: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  routineDate: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  completionContainer: {
    marginLeft: spacing.md,
  },
  cardStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs / 2,
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
  },
  progressBarContainer: {
    marginBottom: spacing.md,
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: colors.background,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  routineDescription: {
    flex: 1,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginRight: spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  menuButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  actionModal: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    width: '80%',
    maxWidth: 300,
  },
  actionModalTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  actionButtonText: {
    fontSize: typography.sizes.base,
    color: colors.text.primary,
    marginLeft: spacing.md,
    fontWeight: typography.weights.medium,
  },
});
