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
import { FoodCategory } from '../types/nutrition';
import { SimpleHeader } from './SimpleHeader';

interface CreateFoodScreenProps {
  onBack: () => void;
}

const CATEGORIES: { key: FoodCategory; label: string }[] = [
  { key: 'proteins', label: 'Proteínas' },
  { key: 'carbs', label: 'Carbohidratos' },
  { key: 'vegetables', label: 'Verduras' },
  { key: 'fruits', label: 'Frutas' },
  { key: 'dairy', label: 'Lácteos' },
  { key: 'nuts_seeds', label: 'Frutos secos' },
  { key: 'oils_fats', label: 'Aceites y grasas' },
  { key: 'beverages', label: 'Bebidas' },
  { key: 'snacks', label: 'Snacks' },
  { key: 'other', label: 'Otros' },
];

const CreateFoodScreen: React.FC<CreateFoodScreenProps> = ({ onBack }) => {
  const { theme } = useTheme();
  const { addCustomFood } = useNutrition();
  
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory>('other');
  const [portions, setPortions] = useState([{ name: '', grams: '' }]);

  const addPortion = () => {
    setPortions([...portions, { name: '', grams: '' }]);
  };

  const removePortion = (index: number) => {
    if (portions.length > 1) {
      setPortions(portions.filter((_, i) => i !== index));
    }
  };

  const updatePortion = (index: number, field: 'name' | 'grams', value: string) => {
    const updatedPortions = [...portions];
    updatedPortions[index][field] = value;
    setPortions(updatedPortions);
  };

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'El nombre del alimento es obligatorio');
      return false;
    }

    const caloriesNum = parseFloat(calories);
    const proteinNum = parseFloat(protein);
    const carbsNum = parseFloat(carbs);
    const fatNum = parseFloat(fat);

    if (isNaN(caloriesNum) || caloriesNum < 0) {
      Alert.alert('Error', 'Las calorías deben ser un número válido');
      return false;
    }

    if (isNaN(proteinNum) || proteinNum < 0) {
      Alert.alert('Error', 'Las proteínas deben ser un número válido');
      return false;
    }

    if (isNaN(carbsNum) || carbsNum < 0) {
      Alert.alert('Error', 'Los carbohidratos deben ser un número válido');
      return false;
    }

    if (isNaN(fatNum) || fatNum < 0) {
      Alert.alert('Error', 'Las grasas deben ser un número válido');
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const validPortions = portions
      .filter(p => p.name.trim() && p.grams.trim())
      .map(p => ({
        name: p.name.trim(),
        grams: parseFloat(p.grams)
      }))
      .filter(p => !isNaN(p.grams) && p.grams > 0);

    const newFood = {
      name: name.trim(),
      macros: {
        calories: parseFloat(calories),
        protein: parseFloat(protein),
        carbs: parseFloat(carbs),
        fat: parseFloat(fat)
      },
      category: selectedCategory,
      isFavorite: false,
      commonPortions: validPortions.length > 0 ? validPortions : undefined
    };

    addCustomFood(newFood);
    
    Alert.alert(
      'Éxito',
      'Alimento creado correctamente',
      [{ text: 'OK', onPress: onBack }]
    );
  };

  const renderCategoryOption = (category: { key: FoodCategory; label: string }) => (
    <TouchableOpacity
      key={category.key}
      style={[
        styles.categoryOption,
        {
          backgroundColor: selectedCategory === category.key ? theme.primary : theme.surface,
          borderColor: theme.primary,
        }
      ]}
      onPress={() => setSelectedCategory(category.key)}
    >
      <Text
        style={[
          styles.categoryOptionText,
          {
            color: selectedCategory === category.key ? '#white' : theme.text.primary,
          }
        ]}
      >
        {category.label}
      </Text>
      {selectedCategory === category.key && (
        <MaterialIcons name="check" size={16} color="#white" />
      )}
    </TouchableOpacity>
  );

  const renderPortionInput = (portion: { name: string; grams: string }, index: number) => (
    <View key={index} style={[styles.portionContainer, { backgroundColor: theme.surface }]}>
      <View style={styles.portionInputs}>
        <TextInput
          style={[styles.portionNameInput, { color: theme.text.primary }]}
          placeholder="Nombre de la porción"
          placeholderTextColor={theme.text.secondary}
          value={portion.name}
          onChangeText={(value) => updatePortion(index, 'name', value)}
        />
        <TextInput
          style={[styles.portionGramsInput, { color: theme.text.primary }]}
          placeholder="Gramos"
          placeholderTextColor={theme.text.secondary}
          value={portion.grams}
          onChangeText={(value) => updatePortion(index, 'grams', value)}
          keyboardType="numeric"
        />
      </View>
      {portions.length > 1 && (
        <TouchableOpacity
          style={styles.removePortionButton}
          onPress={() => removePortion(index)}
        >
          <MaterialIcons name="remove-circle" size={20} color={theme.error} />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={theme.background === '#ffffff' ? 'dark-content' : 'light-content'}
        backgroundColor={theme.background}
      />
      
      <SimpleHeader
        title="Crear alimento"
        subtitle="Añade un alimento personalizado"
        onBack={onBack}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Basic Information */}
        <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
            Información básica
          </Text>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.text.secondary }]}>
              Nombre del alimento *
            </Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: theme.surface, color: theme.text.primary }]}
              placeholder="Ej: Mi receta especial"
              placeholderTextColor={theme.text.secondary}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.text.secondary }]}>
              Categoría
            </Text>
            <View style={styles.categoriesGrid}>
              {CATEGORIES.map(renderCategoryOption)}
            </View>
          </View>
        </View>

        {/* Macronutrients */}
        <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
            Macronutrientes (por 100g)
          </Text>
          
          <View style={styles.macrosGrid}>
            <View style={styles.macroInput}>
              <Text style={[styles.inputLabel, { color: theme.text.secondary }]}>
                Calorías *
              </Text>
              <TextInput
                style={[styles.numberInput, { backgroundColor: theme.surface, color: theme.text.primary }]}
                placeholder="0"
                placeholderTextColor={theme.text.secondary}
                value={calories}
                onChangeText={setCalories}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.macroInput}>
              <Text style={[styles.inputLabel, { color: theme.text.secondary }]}>
                Proteína (g) *
              </Text>
              <TextInput
                style={[styles.numberInput, { backgroundColor: theme.surface, color: theme.text.primary }]}
                placeholder="0"
                placeholderTextColor={theme.text.secondary}
                value={protein}
                onChangeText={setProtein}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.macroInput}>
              <Text style={[styles.inputLabel, { color: theme.text.secondary }]}>
                Carbohidratos (g) *
              </Text>
              <TextInput
                style={[styles.numberInput, { backgroundColor: theme.surface, color: theme.text.primary }]}
                placeholder="0"
                placeholderTextColor={theme.text.secondary}
                value={carbs}
                onChangeText={setCarbs}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.macroInput}>
              <Text style={[styles.inputLabel, { color: theme.text.secondary }]}>
                Grasas (g) *
              </Text>
              <TextInput
                style={[styles.numberInput, { backgroundColor: theme.surface, color: theme.text.primary }]}
                placeholder="0"
                placeholderTextColor={theme.text.secondary}
                value={fat}
                onChangeText={setFat}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {/* Portions */}
        <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
              Porciones comunes (opcional)
            </Text>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: theme.primary }]}
              onPress={addPortion}
            >
              <MaterialIcons name="add" size={16} color="#white" />
              <Text style={styles.addButtonText}>Añadir</Text>
            </TouchableOpacity>
          </View>
          
          {portions.map(renderPortionInput)}
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: theme.primary }]}
          onPress={handleSave}
        >
          <MaterialIcons name="save" size={20} color="#white" />
          <Text style={styles.saveButtonText}>Guardar alimento</Text>
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
  section: {
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  categoryOptionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  macrosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  macroInput: {
    flex: 1,
    minWidth: '45%',
  },
  numberInput: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    textAlign: 'center',
  },
  portionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    gap: 12,
  },
  portionInputs: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },
  portionNameInput: {
    flex: 2,
    fontSize: 14,
  },
  portionGramsInput: {
    flex: 1,
    fontSize: 14,
    textAlign: 'center',
  },
  removePortionButton: {
    padding: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  addButtonText: {
    color: '#white',
    fontSize: 12,
    fontWeight: '500',
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

export default CreateFoodScreen;
