import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useNutrition } from '../contexts/NutritionContext';
import { Food, FoodCategory, MealType } from '../types/nutrition';
import { SimpleHeader } from './SimpleHeader';
import { spacing, typography, borderRadius } from '../constants/theme';

interface FoodSearchScreenProps {
  onBack: () => void;
  selectedMeal?: MealType;
}

const CATEGORIES: { key: FoodCategory; label: string; icon: string }[] = [
  { key: 'proteins', label: 'Proteínas', icon: 'breakfast-dining' },
  { key: 'carbs', label: 'Carbohidratos', icon: 'grain' },
  { key: 'vegetables', label: 'Verduras', icon: 'eco' },
  { key: 'fruits', label: 'Frutas', icon: 'apple' },
  { key: 'dairy', label: 'Lácteos', icon: 'icecream' },
  { key: 'nuts_seeds', label: 'Frutos secos', icon: 'nature' },
  { key: 'oils_fats', label: 'Aceites y grasas', icon: 'opacity' },
  { key: 'beverages', label: 'Bebidas', icon: 'local-drink' },
  { key: 'snacks', label: 'Snacks', icon: 'cookie' },
  { key: 'other', label: 'Otros', icon: 'more-horiz' },
];

const FoodSearchScreen: React.FC<FoodSearchScreenProps> = ({
  onBack,
  selectedMeal = 'breakfast'
}) => {
  const { theme } = useTheme();
  const { searchFoods, favoriteFoods, addFoodEntry, toggleFavorite, calculateMacros, dailyNutrition } = useNutrition();
  const styles = createStyles(theme);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | undefined>();
  const [searchResults, setSearchResults] = useState<Food[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    if (showFavorites) {
      setSearchResults(favoriteFoods);
    } else {
      const results = searchFoods(searchQuery, selectedCategory);
      setSearchResults(results);
    }
  }, [searchQuery, selectedCategory, showFavorites, favoriteFoods]);

  const handleAddFood = (food: Food) => {
    // MÉTODO DIRECTO - USAR 100g POR DEFECTO
    const defaultAmount = 100;
    
    // AGREGAR EL ALIMENTO DIRECTAMENTE
    addFoodEntry(food.id, defaultAmount, selectedMeal);
    
    // CONFIRMACIÓN PROFESIONAL
    Alert.alert(
      'Alimento agregado',
      `${food.name} (${defaultAmount}g) agregado a ${getMealName(selectedMeal)}`,
      [{ text: 'Continuar', onPress: onBack }]
    );
  };

  const getMealName = (meal: MealType) => {
    const names = {
      breakfast: 'Desayuno',
      morning_snack: 'Media Mañana',
      lunch: 'Comida',
      afternoon_snack: 'Merienda',
      dinner: 'Cena'
    };
    return names[meal];
  };

  const renderFood = ({ item }: { item: Food }) => (
    <TouchableOpacity
      style={[styles.foodCard, { backgroundColor: theme.surface }]}
      onPress={() => handleAddFood(item)}
    >
      <View style={styles.foodCardContent}>
        <View style={styles.foodInfo}>
          <View style={styles.foodHeader}>
            <Text style={[styles.foodName, { color: theme.text.primary }]}>
              {item.name}
            </Text>
            <TouchableOpacity
              onPress={() => toggleFavorite(item.id)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialIcons
                name={item.isFavorite ? 'favorite' : 'favorite-border'}
                size={20}
                color={item.isFavorite ? '#ef4444' : theme.text.secondary}
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.macrosRow}>
            <Text style={[styles.macroText, { color: theme.primary }]}>
              {item.macros.calories} kcal
            </Text>
            <Text style={[styles.macroText, { color: theme.text.secondary }]}>
              P: {item.macros.protein}g
            </Text>
            <Text style={[styles.macroText, { color: theme.text.secondary }]}>
              C: {item.macros.carbs}g
            </Text>
            <Text style={[styles.macroText, { color: theme.text.secondary }]}>
              G: {item.macros.fat}g
            </Text>
          </View>
          
          {item.commonPortions && item.commonPortions.length > 0 && (
            <Text style={[styles.portionsText, { color: theme.text.secondary }]}>
              Porciones: {item.commonPortions.map(p => p.name).join(', ')}
            </Text>
          )}
        </View>
        
        <MaterialIcons name="add-circle" size={24} color={theme.primary} />
      </View>
    </TouchableOpacity>
  );

  const renderCategory = (category: { key: FoodCategory; label: string; icon: string }) => (
    <TouchableOpacity
      key={category.key}
      style={[
        styles.filterChip,
        selectedCategory === category.key && styles.filterChipActive
      ]}
      onPress={() => {
        setSelectedCategory(selectedCategory === category.key ? undefined : category.key);
        setShowFavorites(false);
      }}
    >
      <Text
        style={[
          styles.filterChipText,
          selectedCategory === category.key && styles.filterChipTextActive
        ]}
      >
        {category.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={theme.background === '#ffffff' ? 'dark-content' : 'light-content'}
        backgroundColor={theme.background}
      />
      
      <SimpleHeader
        title="Buscar alimentos"
        subtitle={`Para ${getMealName(selectedMeal)}`}
        onBack={onBack}
      />

      <View style={styles.content}>
        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: theme.surface }]}>
          <MaterialIcons name="search" size={20} color={theme.text.secondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.text.primary }]}
            placeholder="Buscar alimentos..."
            placeholderTextColor={theme.text.secondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialIcons name="clear" size={20} color={theme.text.secondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Quick Filters */}
        <View style={styles.quickFilters}>
          <TouchableOpacity
            style={[
              styles.favoriteButton,
              {
                backgroundColor: showFavorites ? theme.primary : theme.surface,
                borderColor: theme.primary,
              }
            ]}
            onPress={() => {
              setShowFavorites(!showFavorites);
              setSelectedCategory(undefined);
              setSearchQuery('');
            }}
          >
            <MaterialIcons
              name="favorite"
              size={16}
              color={showFavorites ? '#white' : theme.text.primary}
            />
            <Text
              style={[
                styles.favoriteText,
                { color: showFavorites ? '#white' : theme.text.primary }
              ]}
            >
              Favoritos
            </Text>
          </TouchableOpacity>
        </View>

        {/* Categories */}
        {!showFavorites && (
          <View style={styles.filtersWrapper}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filtersContainer}
              contentContainerStyle={styles.filtersContent}
            >
              {CATEGORIES.map(renderCategory)}
            </ScrollView>
          </View>
        )}

        {/* Results */}
        <FlatList
          data={searchResults}
          renderItem={renderFood}
          keyExtractor={(item) => item.id}
          style={styles.resultsList}
          contentContainerStyle={styles.resultsContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialIcons name="search-off" size={48} color={theme.text.secondary} />
              <Text style={[styles.emptyText, { color: theme.text.secondary }]}>
                {showFavorites
                  ? 'No tienes alimentos favoritos'
                  : searchQuery
                  ? 'No se encontraron alimentos'
                  : 'Busca alimentos para añadir'
                }
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  quickFilters: {
    marginBottom: 16,
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 8,
    alignSelf: 'flex-start',
  },
  favoriteText: {
    fontSize: 14,
    fontWeight: '500',
  },
  filtersWrapper: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: 0,
  },
  filtersContainer: {
    // Container styles can be empty like in ExercisesListScreen
  },
  filtersContent: {
    paddingLeft: spacing.lg,
    paddingRight: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.surface,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
    maxWidth: 120,
  },
  filterChipActive: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.text.primary,
    textAlign: 'center',
  } as any,
  filterChipTextActive: {
    color: theme.background,
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesContent: {
    paddingHorizontal: 4,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  resultsList: {
    flex: 1,
  },
  resultsContent: {
    paddingBottom: 20,
  },
  foodCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  foodCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  foodInfo: {
    flex: 1,
  },
  foodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  macrosRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 4,
  },
  macroText: {
    fontSize: 12,
    fontWeight: '500',
  },
  portionsText: {
    fontSize: 11,
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
});

export default FoodSearchScreen;
