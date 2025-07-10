import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, spacing } from '../constants/theme';

interface HeaderProps {
  userName: string;
  userAvatar?: string;
  onProfilePress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ userName, userAvatar, onProfilePress }) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.md }]}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>
          Your<Text style={styles.logoAccent}>Gainz</Text>
        </Text>
      </View>
      
      <TouchableOpacity style={styles.profileContainer} onPress={onProfilePress}>
        <Text style={styles.userName}>{userName}</Text>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
  },
  logoContainer: {
    flex: 1,
  },
  logoText: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  logoAccent: {
    color: colors.primary,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  userName: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.background,
  },
});
