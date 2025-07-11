import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useNutrition } from '../contexts/NutritionContext';
import { NutritionGoals } from '../types/nutrition';
import { SimpleHeader } from './SimpleHeader';

interface NutritionSettingsScreenProps {
  onBack: () => void;
}

const ACTIVITY_LEVELS = [
  {
    id: 'sedentary',
    title: 'Sedentario',
    description: 'Poco o ningún ejercicio',
    multiplier: 1.2,
  },
  {
    id: 'light',
    title: 'Ligeramente activo',
    description: 'Ejercicio ligero 1-3 días/semana',
    multiplier: 1.375,
  },
  {
    id: 'moderate',
    title: 'Moderadamente activo',
    description: 'Ejercicio moderado 3-5 días/semana',
    multiplier: 1.55,
  },
  {
    id: 'very',
    title: 'Muy activo',
    description: 'Ejercicio intenso 6-7 días/semana',
    multiplier: 1.725,
  },
  {
    id: 'extra',
    title: 'Extremadamente activo',
    description: 'Ejercicio muy intenso, trabajo físico',
    multiplier: 1.9,
  },
];

const GOALS = [
  {
    id: 'lose',
    title: 'Perder peso',
    description: 'Déficit calórico del 20%',
    adjustment: -0.2,
  },
  {
    id: 'maintain',
    title: 'Mantener peso',
    description: 'Calorías de mantenimiento',
    adjustment: 0,
  },
  {
    id: 'gain',
    title: 'Ganar peso',
    description: 'Superávit calórico del 15%',
    adjustment: 0.15,
  },
];

const NutritionSettingsScreen: React.FC<NutritionSettingsScreenProps> = ({ onBack }) => {
  const { theme } = useTheme();
  const { nutritionGoals, updateNutritionGoals } = useNutrition();
  
  const [customCalories, setCustomCalories] = useState(nutritionGoals.dailyCalories.toString());
  const [proteinPercentage, setProteinPercentage] = useState(nutritionGoals.proteinPercentage.toString());
  const [carbsPercentage, setCarbsPercentage] = useState(nutritionGoals.carbsPercentage.toString());
  const [fatPercentage, setFatPercentage] = useState(nutritionGoals.fatPercentage.toString());
  
  // Calculator states
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [goal, setGoal] = useState('maintain');
  const [showCalculator, setShowCalculator] = useState(false);

  const calculateBMR = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);

    if (isNaN(w) || isNaN(h) || isNaN(a)) {
      Alert.alert('Error', 'Por favor completa todos los campos del calculador');
      return;
    }

    // Mifflin-St Jeor Equation
    let bmr;
    if (gender === 'male') {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
    }

    const selectedActivity = ACTIVITY_LEVELS.find(level => level.id === activityLevel);
    const selectedGoal = GOALS.find(g => g.id === goal);
    
    if (!selectedActivity || !selectedGoal) return;

    const tdee = bmr * selectedActivity.multiplier;
    const targetCalories = Math.round(tdee * (1 + selectedGoal.adjustment));

    setCustomCalories(targetCalories.toString());
    setShowCalculator(false);
    
    Alert.alert(
      'Cálculo completado',
      `Tu objetivo diario es de ${targetCalories} calorías basado en:\n\n` +
      `• BMR: ${Math.round(bmr)} kcal\n` +
      `• TDEE: ${Math.round(tdee)} kcal\n` +
      `• Objetivo: ${selectedGoal.title}`
    );
  };

  const validateAndSave = () => {
    const calories = parseFloat(customCalories);
    const protein = parseFloat(proteinPercentage);
    const carbs = parseFloat(carbsPercentage);
    const fat = parseFloat(fatPercentage);

    if (isNaN(calories) || calories < 800 || calories > 5000) {
      Alert.alert('Error', 'Las calorías deben estar entre 800 y 5000');
      return;
    }

    if (isNaN(protein) || protein < 10 || protein > 50) {
      Alert.alert('Error', 'El porcentaje de proteínas debe estar entre 10% y 50%');
      return;
    }

    if (isNaN(carbs) || carbs < 20 || carbs > 70) {
      Alert.alert('Error', 'El porcentaje de carbohidratos debe estar entre 20% y 70%');
      return;
    }

    if (isNaN(fat) || fat < 15 || fat > 50) {
      Alert.alert('Error', 'El porcentaje de grasas debe estar entre 15% y 50%');
      return;
    }

    if (Math.abs((protein + carbs + fat) - 100) > 1) {
      Alert.alert('Error', 'Los porcentajes de macronutrientes deben sumar 100%');
      return;
    }

    const newGoals: NutritionGoals = {
      dailyCalories: calories,
      proteinPercentage: protein,
      carbsPercentage: carbs,
      fatPercentage: fat,
    };

    updateNutritionGoals(newGoals);
    
    Alert.alert(
      'Objetivos actualizados',
      'Tus objetivos nutricionales se han guardado correctamente',
      [{ text: 'OK', onPress: onBack }]
    );
  };

  const calculateMacroGrams = () => {
    const calories = parseFloat(customCalories) || 0;
    const protein = Math.round((calories * (parseFloat(proteinPercentage) || 0) / 100) / 4);
    const carbs = Math.round((calories * (parseFloat(carbsPercentage) || 0) / 100) / 4);
    const fat = Math.round((calories * (parseFloat(fatPercentage) || 0) / 100) / 9);
    
    return { protein, carbs, fat };
  };

  const macroGrams = calculateMacroGrams();

  if (showCalculator) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <StatusBar
          barStyle={theme.background === '#ffffff' ? 'dark-content' : 'light-content'}
          backgroundColor={theme.background}
        />
        
        <SimpleHeader
          title="Calculadora de calorías"
          subtitle="Calcula tu objetivo diario"
          onBack={() => setShowCalculator(false)}
        />

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Personal Info */}
          <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
              Información personal
            </Text>
            
            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  {
                    backgroundColor: gender === 'male' ? theme.primary : theme.surface,
                  }
                ]}
                onPress={() => setGender('male')}
              >
                <MaterialIcons
                  name="male"
                  size={20}
                  color={gender === 'male' ? '#white' : theme.text.primary}
                />
                <Text
                  style={[
                    styles.genderText,
                    { color: gender === 'male' ? '#white' : theme.text.primary }
                  ]}
                >
                  Hombre
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  {
                    backgroundColor: gender === 'female' ? theme.primary : theme.surface,
                  }
                ]}
                onPress={() => setGender('female')}
              >
                <MaterialIcons
                  name="female"
                  size={20}
                  color={gender === 'female' ? '#white' : theme.text.primary}
                />
                <Text
                  style={[
                    styles.genderText,
                    { color: gender === 'female' ? '#white' : theme.text.primary }
                  ]}
                >
                  Mujer
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.text.secondary }]}>
                  Edad (años)
                </Text>
                <TextInput
                  style={[styles.numberInput, { backgroundColor: theme.surface, color: theme.text.primary }]}
                  placeholder="25"
                  placeholderTextColor={theme.text.secondary}
                  value={age}
                  onChangeText={setAge}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.text.secondary }]}>
                  Peso (kg)
                </Text>
                <TextInput
                  style={[styles.numberInput, { backgroundColor: theme.surface, color: theme.text.primary }]}
                  placeholder="70"
                  placeholderTextColor={theme.text.secondary}
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.text.secondary }]}>
                  Altura (cm)
                </Text>
                <TextInput
                  style={[styles.numberInput, { backgroundColor: theme.surface, color: theme.text.primary }]}
                  placeholder="175"
                  placeholderTextColor={theme.text.secondary}
                  value={height}
                  onChangeText={setHeight}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {/* Activity Level */}
          <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
              Nivel de actividad
            </Text>
            
            {ACTIVITY_LEVELS.map((level) => (
              <TouchableOpacity
                key={level.id}
                style={[
                  styles.activityOption,
                  {
                    backgroundColor: activityLevel === level.id ? theme.primary : theme.surface,
                  }
                ]}
                onPress={() => setActivityLevel(level.id)}
              >
                <View style={styles.activityInfo}>
                  <Text
                    style={[
                      styles.activityTitle,
                      { color: activityLevel === level.id ? '#white' : theme.text.primary }
                    ]}
                  >
                    {level.title}
                  </Text>
                  <Text
                    style={[
                      styles.activityDescription,
                      { color: activityLevel === level.id ? '#white' : theme.text.secondary }
                    ]}
                  >
                    {level.description}
                  </Text>
                </View>
                {activityLevel === level.id && (
                  <MaterialIcons name="check" size={20} color="#white" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Goal */}
          <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
              Objetivo
            </Text>
            
            {GOALS.map((goalOption) => (
              <TouchableOpacity
                key={goalOption.id}
                style={[
                  styles.goalOption,
                  {
                    backgroundColor: goal === goalOption.id ? theme.primary : theme.surface,
                  }
                ]}
                onPress={() => setGoal(goalOption.id)}
              >
                <View style={styles.goalInfo}>
                  <Text
                    style={[
                      styles.goalTitle,
                      { color: goal === goalOption.id ? '#white' : theme.text.primary }
                    ]}
                  >
                    {goalOption.title}
                  </Text>
                  <Text
                    style={[
                      styles.goalDescription,
                      { color: goal === goalOption.id ? '#white' : theme.text.secondary }
                    ]}
                  >
                    {goalOption.description}
                  </Text>
                </View>
                {goal === goalOption.id && (
                  <MaterialIcons name="check" size={20} color="#white" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.calculateButton, { backgroundColor: theme.primary }]}
            onPress={calculateBMR}
          >
            <MaterialIcons name="calculate" size={20} color="#white" />
            <Text style={styles.calculateButtonText}>Calcular calorías</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={theme.background === '#ffffff' ? 'dark-content' : 'light-content'}
        backgroundColor={theme.background}
      />
      
      <SimpleHeader
        title="Objetivos nutricionales"
        subtitle="Configura tus metas diarias"
        onBack={onBack}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Calculator Button */}
        <TouchableOpacity
          style={[styles.calculatorCard, { backgroundColor: theme.cardBackground }]}
          onPress={() => setShowCalculator(true)}
        >
          <View style={styles.calculatorContent}>
            <MaterialIcons name="calculate" size={32} color={theme.primary} />
            <View style={styles.calculatorInfo}>
              <Text style={[styles.calculatorTitle, { color: theme.text.primary }]}>
                Calculadora de calorías
              </Text>
              <Text style={[styles.calculatorDescription, { color: theme.text.secondary }]}>
                Calcula tu objetivo diario basado en tu información personal
              </Text>
            </View>
            <MaterialIcons name="arrow-forward" size={20} color={theme.text.secondary} />
          </View>
        </TouchableOpacity>

        {/* Manual Settings */}
        <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
            Configuración manual
          </Text>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.text.secondary }]}>
              Calorías diarias objetivo
            </Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: theme.surface, color: theme.text.primary }]}
              placeholder="2000"
              placeholderTextColor={theme.text.secondary}
              value={customCalories}
              onChangeText={setCustomCalories}
              keyboardType="numeric"
            />
          </View>

          <Text style={[styles.macrosTitle, { color: theme.text.primary }]}>
            Distribución de macronutrientes
          </Text>

          <View style={styles.macrosContainer}>
            <View style={styles.macroInputGroup}>
              <Text style={[styles.inputLabel, { color: theme.text.secondary }]}>
                Proteínas (%)
              </Text>
              <TextInput
                style={[styles.macroInput, { backgroundColor: theme.surface, color: theme.text.primary }]}
                placeholder="30"
                placeholderTextColor={theme.text.secondary}
                value={proteinPercentage}
                onChangeText={setProteinPercentage}
                keyboardType="numeric"
              />
              <Text style={[styles.macroGrams, { color: '#3b82f6' }]}>
                {macroGrams.protein}g
              </Text>
            </View>

            <View style={styles.macroInputGroup}>
              <Text style={[styles.inputLabel, { color: theme.text.secondary }]}>
                Carbohidratos (%)
              </Text>
              <TextInput
                style={[styles.macroInput, { backgroundColor: theme.surface, color: theme.text.primary }]}
                placeholder="40"
                placeholderTextColor={theme.text.secondary}
                value={carbsPercentage}
                onChangeText={setCarbsPercentage}
                keyboardType="numeric"
              />
              <Text style={[styles.macroGrams, { color: '#10b981' }]}>
                {macroGrams.carbs}g
              </Text>
            </View>

            <View style={styles.macroInputGroup}>
              <Text style={[styles.inputLabel, { color: theme.text.secondary }]}>
                Grasas (%)
              </Text>
              <TextInput
                style={[styles.macroInput, { backgroundColor: theme.surface, color: theme.text.primary }]}
                placeholder="30"
                placeholderTextColor={theme.text.secondary}
                value={fatPercentage}
                onChangeText={setFatPercentage}
                keyboardType="numeric"
              />
              <Text style={[styles.macroGrams, { color: '#f59e0b' }]}>
                {macroGrams.fat}g
              </Text>
            </View>
          </View>

          <View style={[styles.totalContainer, { backgroundColor: theme.surface }]}>
            <Text style={[styles.totalText, { color: theme.text.primary }]}>
              Total: {(parseFloat(proteinPercentage) || 0) + (parseFloat(carbsPercentage) || 0) + (parseFloat(fatPercentage) || 0)}%
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: theme.primary }]}
          onPress={validateAndSave}
        >
          <MaterialIcons name="save" size={20} color="#white" />
          <Text style={styles.saveButtonText}>Guardar objetivos</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  calculatorCard: {
    borderRadius: 16,
    padding: 20,
    marginVertical: 16,
  },
  calculatorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  calculatorInfo: {
    flex: 1,
  },
  calculatorTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  calculatorDescription: {
    fontSize: 14,
  },
  section: {
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  textInput: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  numberInput: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    textAlign: 'center',
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  genderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  genderText: {
    fontSize: 14,
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  activityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 12,
  },
  goalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  goalDescription: {
    fontSize: 12,
  },
  macrosTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    marginTop: 8,
  },
  macrosContainer: {
    gap: 12,
  },
  macroInputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  macroInput: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    textAlign: 'center',
    width: 60,
  },
  macroGrams: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 40,
  },
  totalContainer: {
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  totalText: {
    fontSize: 14,
    fontWeight: '600',
  },
  calculateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingVertical: 16,
    marginVertical: 20,
    gap: 8,
  },
  calculateButtonText: {
    color: '#white',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingVertical: 16,
    marginVertical: 20,
    gap: 8,
  },
  saveButtonText: {
    color: '#white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NutritionSettingsScreen;
