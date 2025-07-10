import { MenuOption, NavigationRoute } from '../types';
import { colors } from '../constants/theme';

export const createMenuOptions = (
  onNavigate: (route: NavigationRoute) => void
): MenuOption[] => [
  {
    id: 'training',
    title: 'Entrenamiento',
    subtitle: 'Accede a tus rutinas y ejercicios',
    icon: 'fitness-center',
    color: colors.icons.training,
    onPress: () => onNavigate('Training'),
  },
  {
    id: 'progress',
    title: 'Progreso',
    subtitle: 'Visualiza tus estadísticas',
    icon: 'trending-up',
    color: colors.icons.progress,
    onPress: () => onNavigate('Progress'),
  },
  {
    id: 'nutrition',
    title: 'Nutrición',
    subtitle: 'Gestiona tu dieta',
    icon: 'restaurant',
    color: colors.icons.nutrition,
    onPress: () => onNavigate('Nutrition'),
  },
  {
    id: 'community',
    title: 'Comunidad',
    subtitle: 'Conecta con otros usuarios',
    icon: 'people',
    color: colors.icons.community,
    onPress: () => onNavigate('Community'),
  },
];
