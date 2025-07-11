import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { typography, spacing } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';

interface EditProfileScreenProps {
  userName: string;
  userEmail?: string;
  userPhone?: string;
  userWeight?: number;
  onGoBack: () => void;
  onSave: (userData: UserData) => void;
}

interface UserData {
  name: string;
  email: string;
  phone: string;
  currentWeight: number;
}

export const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ 
  userName, 
  userEmail = 'john.doe@example.com',
  userPhone = '+1 234 567 8900',
  userWeight = 75,
  onGoBack, 
  onSave 
}) => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  
  const styles = createStyles(theme);
  
  const [formData, setFormData] = useState<UserData>({
    name: userName,
    email: userEmail,
    phone: userPhone,
    currentWeight: userWeight,
  });

  const handleSave = () => {
    // Validación básica
    if (!formData.name.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return;
    }
    if (!formData.email.trim()) {
      Alert.alert('Error', 'El email es obligatorio');
      return;
    }
    if (formData.currentWeight <= 0) {
      Alert.alert('Error', 'El peso debe ser mayor a 0');
      return;
    }

    onSave(formData);
    Alert.alert('Éxito', 'Perfil actualizado correctamente', [
      { text: 'OK', onPress: onGoBack }
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
          <Ionicons name="arrow-back" size={24} color={theme.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Perfil</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Guardar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {formData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </Text>
          </View>
          <TouchableOpacity style={styles.changePhotoButton}>
            <Ionicons name="camera-outline" size={16} color={theme.primary} />
            <Text style={styles.changePhotoText}>Cambiar foto</Text>
          </TouchableOpacity>
        </View>

        {/* Formulario */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre completo</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color={theme.text.secondary} />
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                placeholder="Ingresa tu nombre completo"
                placeholderTextColor={theme.text.secondary}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color={theme.text.secondary} />
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                placeholder="Ingresa tu email"
                placeholderTextColor={theme.text.secondary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Teléfono</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={20} color={theme.text.secondary} />
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
                placeholder="Ingresa tu teléfono"
                placeholderTextColor={theme.text.secondary}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Peso actual (kg)</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="fitness-outline" size={20} color={theme.text.secondary} />
              <TextInput
                style={styles.input}
                value={formData.currentWeight.toString()}
                onChangeText={(text) => {
                  const weight = parseFloat(text) || 0;
                  setFormData(prev => ({ ...prev, currentWeight: weight }));
                }}
                placeholder="Ingresa tu peso actual"
                placeholderTextColor={theme.text.secondary}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {/* Información adicional */}
        <View style={styles.infoSection}>
          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={20} color={theme.primary} />
            <Text style={styles.infoText}>
              Los cambios en tu peso se reflejarán en tus estadísticas y también podrás actualizarlo desde el apartado de progreso.
            </Text>
          </View>
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
  saveButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: theme.primary,
    borderRadius: 8,
  },
  saveButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: theme.background,
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
  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  changePhotoText: {
    fontSize: typography.sizes.sm,
    color: theme.primary,
    fontWeight: typography.weights.medium,
  },
  form: {
    marginBottom: spacing.xl,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: theme.text.primary,
    marginBottom: spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: typography.sizes.base,
    color: theme.text.primary,
    marginLeft: spacing.sm,
    paddingVertical: spacing.sm,
  },
  infoSection: {
    marginBottom: spacing.xl,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'flex-start',
  },
  infoText: {
    fontSize: typography.sizes.sm,
    color: theme.text.secondary,
    marginLeft: spacing.sm,
    flex: 1,
    lineHeight: 20,
  },
});
