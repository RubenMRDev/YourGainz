import { MenuOption, NutritionNavigationRoute } from '../types';

export const createNutritionMenuOptions = (
  onNavigate: (route: NutritionNavigationRoute) => void,
  theme: any
): MenuOption[] => [
  {
    id: 'nutrition_today',
    title: 'Hoy',
    subtitle: 'Registra tus comidas del día',
    icon: 'today',
    color: theme.icons.nutrition,
    onPress: () => onNavigate('NutritionMain'),
  },
  {
    id: 'food_search',
    title: 'Buscar alimentos',
    subtitle: 'Encuentra y añade alimentos',
    icon: 'search',
    color: theme.icons.nutrition,
    onPress: () => onNavigate('FoodSearch'),
  },
  {
    id: 'create_food',
    title: 'Crear alimento',
    subtitle: 'Añade alimentos personalizados',
    icon: 'add-circle',
    color: theme.icons.nutrition,
    onPress: () => onNavigate('CreateFood'),
  },
  {
    id: 'nutrition_history',
    title: 'Historial',
    subtitle: 'Revisa días anteriores',
    icon: 'history',
    color: theme.icons.nutrition,
    onPress: () => onNavigate('NutritionHistory'),
  },
  {
    id: 'weekly_summary',
    title: 'Resumen semanal',
    subtitle: 'Estadísticas y tendencias',
    icon: 'bar-chart',
    color: theme.icons.nutrition,
    onPress: () => onNavigate('WeeklySummary'),
  },
  {
    id: 'nutrition_settings',
    title: 'Objetivos',
    subtitle: 'Configura tus metas nutricionales',
    icon: 'settings',
    color: theme.icons.nutrition,
    onPress: () => onNavigate('NutritionSettings'),
  },
];
