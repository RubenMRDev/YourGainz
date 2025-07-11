import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, typography } from '../constants/theme';

interface SimpleHeaderProps {
  title: string;
  subtitle?: string;
  onBack: () => void;
  rightIcon?: string;
  onRightPress?: () => void;
}

export const SimpleHeader: React.FC<SimpleHeaderProps> = ({
  title,
  subtitle,
  onBack,
  rightIcon,
  onRightPress
}) => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  
  const styles = createStyles(theme);

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.md }]}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <MaterialIcons name="arrow-back" size={24} color={theme.text.primary} />
      </TouchableOpacity>
      
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      
      {rightIcon && onRightPress ? (
        <TouchableOpacity style={styles.rightButton} onPress={onRightPress}>
          <MaterialIcons name={rightIcon as any} size={24} color={theme.text.primary} />
        </TouchableOpacity>
      ) : (
        <View style={styles.rightButton} />
      )}
    </View>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: theme.background,
  },
  backButton: {
    padding: spacing.sm,
    marginRight: spacing.sm,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: theme.text.primary,
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    color: theme.text.secondary,
    marginTop: 2,
  },
  rightButton: {
    padding: spacing.sm,
    marginLeft: spacing.sm,
    width: 40, // Fixed width to balance the layout
    alignItems: 'center',
  },
});
