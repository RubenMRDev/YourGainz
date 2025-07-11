import { MenuOption, NavigationRoute } from '../types';

export const createMenuOptions = (
  onNavigate: (route: NavigationRoute) => void,
  theme: any
): MenuOption[] => [
  {
    id: 'training',
    title: 'Entrenamiento',
    subtitle: 'Accede a tus rutinas y ejercicios',
    icon: 'fitness-center',
    color: theme.icons.training,
    onPress: () => onNavigate('Training'),
  },
  {
    id: 'progress',
    title: 'Progreso',
    subtitle: 'Visualiza tus estadísticas',
    icon: 'trending-up',
    color: theme.icons.progress,
    onPress: () => onNavigate('Progress'),
  },
  {
    id: 'nutrition',
    title: 'Nutrición',
    subtitle: 'Gestiona tu dieta',
    icon: 'restaurant',
    color: theme.icons.nutrition,
    onPress: () => onNavigate('Nutrition'),
  },
  {
    id: 'community',
    title: 'Comunidad',
    subtitle: 'Conecta con otros usuarios',
    icon: 'people',
    color: theme.icons.community,
    onPress: () => onNavigate('Community'),
  },
];
