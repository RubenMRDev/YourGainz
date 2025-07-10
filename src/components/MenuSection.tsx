import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MenuCard } from './MenuCard';
import { MenuOption } from '../types';
import { spacing } from '../constants/theme';

interface MenuSectionProps {
  menuOptions: MenuOption[];
}

export const MenuSection: React.FC<MenuSectionProps> = ({ menuOptions }) => {
  const insets = useSafeAreaInsets();
  
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingBottom: insets.bottom + spacing.xl }
      ]}
      showsVerticalScrollIndicator={false}
    >
      {menuOptions.map((option) => (
        <MenuCard key={option.id} option={option} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: spacing.md,
  },
});
