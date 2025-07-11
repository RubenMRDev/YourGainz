import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { typography, spacing } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';

interface WelcomeSectionProps {
  userName: string;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({ userName }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>¡Hola, {userName}!</Text>
      <Text style={styles.subtitle}>Continúa con tu progreso de entrenamiento</Text>
    </View>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  greeting: {
    fontSize: typography.sizes['3xl'],
    fontWeight: typography.weights.bold,
    color: theme.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.sizes.base,
    color: theme.text.secondary,
    lineHeight: 22,
  },
});
