import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { typography, spacing } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';

interface ProfileScreenProps {
  userName: string;
  onGoBack: () => void;
  onOpenSettings?: () => void;
  userEmail?: string;
  userPhone?: string;
  userWeight?: number;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ 
  userName, 
  onGoBack, 
  onOpenSettings,
  userEmail = 'john.doe@example.com',
  userPhone = '+1 234 567 8900',
  userWeight = 75
}) => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  
  const styles = createStyles(theme);

  const userInfo = {
    name: userName,
    email: userEmail,
    phone: userPhone,
    joinDate: 'Enero 2024',
    workoutCount: 45,
    streak: 12,
    currentWeight: userWeight,
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header con botón de regreso */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
          <Ionicons name="arrow-back" size={24} color={theme.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Avatar y nombre */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
            </Text>
          </View>
          <Text style={styles.userName}>{userInfo.name}</Text>
          <Text style={styles.userEmail}>{userInfo.email}</Text>
        </View>

        {/* Estadísticas */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userInfo.workoutCount}</Text>
            <Text style={styles.statLabel}>Entrenamientos</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userInfo.streak}</Text>
            <Text style={styles.statLabel}>Días seguidos</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userInfo.currentWeight}kg</Text>
            <Text style={styles.statLabel}>Peso actual</Text>
          </View>
        </View>

        {/* Información personal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Personal</Text>
          
          <View style={styles.infoItem}>
            <Ionicons name="person-outline" size={20} color={theme.text.secondary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Nombre completo</Text>
              <Text style={styles.infoValue}>{userInfo.name}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="mail-outline" size={20} color={theme.text.secondary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{userInfo.email}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="call-outline" size={20} color={theme.text.secondary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Teléfono</Text>
              <Text style={styles.infoValue}>{userInfo.phone}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="calendar-outline" size={20} color={theme.text.secondary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Miembro desde</Text>
              <Text style={styles.infoValue}>{userInfo.joinDate}</Text>
            </View>
          </View>
        </View>

        {/* Configuración */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configuración</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={onOpenSettings}>
            <Ionicons name="settings-outline" size={20} color={theme.text.secondary} />
            <Text style={styles.settingText}>Configuración general</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.text.secondary} />
          </TouchableOpacity>
        </View>

        {/* Botón de cerrar sesión */}
        <TouchableOpacity style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={20} color={theme.error} />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
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
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: theme.text.primary,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: theme.background,
  },
  userName: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: theme.text.primary,
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: typography.sizes.base,
    color: theme.text.secondary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: theme.surface,
    borderRadius: 16,
    paddingVertical: spacing.lg,
    marginBottom: spacing.xl,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: theme.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.sizes.sm,
    color: theme.text.secondary,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: theme.text.primary,
    marginBottom: spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  infoContent: {
    marginLeft: spacing.md,
    flex: 1,
  },
  infoLabel: {
    fontSize: typography.sizes.sm,
    color: theme.text.secondary,
    marginBottom: spacing.xs,
  },
  infoValue: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: theme.text.primary,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  settingText: {
    fontSize: typography.sizes.base,
    color: theme.text.primary,
    marginLeft: spacing.md,
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  logoutText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: theme.error,
    marginLeft: spacing.sm,
  },
});
