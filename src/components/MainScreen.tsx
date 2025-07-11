import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from './Header';
import { WelcomeSection } from './WelcomeSection';
import { MenuSection } from './MenuSection';
import { createMenuOptions } from '../utils/menuOptions';
import { NavigationRoute } from '../types';
import { spacing } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';

interface MainScreenProps {
  userName?: string;
  onProfilePress?: () => void;
  onProgressPress?: () => void;
  onTrainingPress?: () => void;
  onNutritionPress?: () => void;
}

export const MainScreen: React.FC<MainScreenProps> = ({ 
  userName = 'John Doe',
  onProfilePress,
  onProgressPress,
  onTrainingPress,
  onNutritionPress
}) => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  
  const styles = createStyles(theme);
  
  const handleNavigation = (route: NavigationRoute) => {
    switch (route) {
      case 'Training':
        if (onTrainingPress) {
          onTrainingPress();
        }
        break;
      case 'Progress':
        if (onProgressPress) {
          onProgressPress();
        }
        break;
      case 'Nutrition':
        if (onNutritionPress) {
          onNutritionPress();
        }
        break;
      default:
        // For other routes, show an alert for now
        Alert.alert(
          'Navegación',
          `Navegando a: ${route}`,
          [{ text: 'OK' }]
        );
        break;
    }
  };

  const menuOptions = createMenuOptions(handleNavigation, theme);

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <Header userName={userName} onProfilePress={onProfilePress} />
      <WelcomeSection userName={userName} />
      <MenuSection menuOptions={menuOptions} />
    </View>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
});
