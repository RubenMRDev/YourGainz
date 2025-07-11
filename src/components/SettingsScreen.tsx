import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { typography, spacing } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';

interface SettingsScreenProps {
  onGoBack: () => void;
  onEditProfile?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ 
  onGoBack,
  onEditProfile
}) => {
  const insets = useSafeAreaInsets();
  const { theme, isDarkMode, toggleTheme } = useTheme();

  const styles = createStyles(theme);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header con botón de regreso */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
          <Ionicons name="arrow-back" size={24} color={theme.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configuración General</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Sección de Perfil */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Perfil</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={onEditProfile}>
            <Ionicons name="person-outline" size={20} color={theme.text.secondary} />
            <Text style={styles.settingText}>Editar datos del perfil</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.text.secondary} />
          </TouchableOpacity>
        </View>

        {/* Sección de Apariencia */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Apariencia</Text>
          
          <View style={styles.settingItem}>
            <Ionicons name="moon-outline" size={20} color={theme.text.secondary} />
            <Text style={styles.settingText}>Modo oscuro</Text>
            <Switch
              trackColor={{ false: theme.surface, true: theme.primary }}
              thumbColor={isDarkMode ? theme.primary : theme.text.secondary}
              ios_backgroundColor={theme.surface}
              onValueChange={toggleTheme}
              value={isDarkMode}
            />
          </View>
        </View>

        {/* Sección de Configuración */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configuración</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="notifications-outline" size={20} color={theme.text.secondary} />
            <Text style={styles.settingText}>Notificaciones</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.text.secondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="shield-outline" size={20} color={theme.text.secondary} />
            <Text style={styles.settingText}>Privacidad</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.text.secondary} />
          </TouchableOpacity>
        </View>

        {/* Sección de Soporte */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Soporte</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="help-circle-outline" size={20} color={theme.text.secondary} />
            <Text style={styles.settingText}>Ayuda y soporte</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.text.secondary} />
          </TouchableOpacity>
        </View>
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
    paddingTop: spacing.lg,
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
});
