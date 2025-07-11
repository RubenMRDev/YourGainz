import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from './Header';
import { WelcomeSection } from './WelcomeSection';
import { MenuSection } from './MenuSection';
import { createMenuOptions } from '../utils/menuOptions';
import { NavigationRoute } from '../types';
import { colors, spacing } from '../constants/theme';

interface MainScreenProps {
  userName?: string;
  onProfilePress?: () => void;
  onProgressPress?: () => void;
  onTrainingPress?: () => void;
}

export const MainScreen: React.FC<MainScreenProps> = ({ 
  userName = 'John Doe',
  onProfilePress,
  onProgressPress,
  onTrainingPress
}) => {
  const insets = useSafeAreaInsets();
  
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

  const menuOptions = createMenuOptions(handleNavigation);

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <Header userName={userName} onProfilePress={onProfilePress} />
      <WelcomeSection userName={userName} />
      <MenuSection menuOptions={menuOptions} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
