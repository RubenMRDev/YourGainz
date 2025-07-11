import React from 'react';
import { View, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MenuSection } from './MenuSection';
import { MenuOption } from '../types';
import { colors, spacing, typography } from '../constants/theme';

type ExerciseNavigationRoute = 
  | 'Routines'
  | 'Exercises'
  | 'History';

interface ExerciseScreenProps {
  userName?: string;
  onProfilePress?: () => void;
  onBackPress?: () => void;
}

export const ExerciseScreen: React.FC<ExerciseScreenProps> = ({ 
  userName = 'John Doe',
  onProfilePress,
  onBackPress
}) => {
  const insets = useSafeAreaInsets();
  
  const handleNavigation = (route: ExerciseNavigationRoute) => {
    switch (route) {
      case 'Routines':
        Alert.alert(
          'Rutinas',
          'Gestiona tus rutinas de entrenamiento',
          [{ text: 'OK' }]
        );
        break;
      case 'Exercises':
        Alert.alert(
          'Ejercicios',
          'Explora nuestra biblioteca de ejercicios',
          [{ text: 'OK' }]
        );
        break;
      case 'History':
        Alert.alert(
          'Historial',
          'Revisa tu historial de entrenamientos',
          [{ text: 'OK' }]
        );
        break;
      default:
        Alert.alert(
          'Navegación',
          `Navegando a: ${route}`,
          [{ text: 'OK' }]
        );
        break;
    }
  };

  const menuOptions: MenuOption[] = [
    {
      id: 'routines',
      title: 'Rutinas',
      subtitle: 'Gestiona tus rutinas de entrenamiento',
      icon: 'list',
      color: colors.primary,
      onPress: () => handleNavigation('Routines'),
    },
    {
      id: 'exercises',
      title: 'Ejercicios',
      subtitle: 'Explora nuestra biblioteca de ejercicios',
      icon: 'fitness-center',
      color: colors.primary,
      onPress: () => handleNavigation('Exercises'),
    },
    {
      id: 'history',
      title: 'Historial',
      subtitle: 'Revisa tu historial de entrenamientos',
      icon: 'history',
      color: colors.primary,
      onPress: () => handleNavigation('History'),
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Entrenamiento</Text>
        <TouchableOpacity 
          style={styles.profileButton} 
          onPress={onProfilePress}
        >
          <Text style={styles.profileText}>
            {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Estadísticas */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statLabel}>Entrenamientos</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>5</Text>
          <Text style={styles.statLabel}>Rutinas{'\n'}activas</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>89%</Text>
          <Text style={styles.statLabel}>Objetivos</Text>
        </View>
      </View>

      {/* Título de sección */}
      <View style={styles.sectionTitleContainer}>
        <Text style={styles.sectionTitle}>¿Qué quieres hacer hoy?</Text>
      </View>

      <MenuSection menuOptions={menuOptions} />
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
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.background,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  statValue: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  sectionTitleContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
});
