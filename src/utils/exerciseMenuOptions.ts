import { MenuOption } from '../types';
import { colors } from '../constants/theme';

export type ExerciseNavigationRoute = 
  | 'Routines'
  | 'Exercises'
  | 'Workouts'
  | 'Programs';

export const createExerciseMenuOptions = (
  onNavigate: (route: ExerciseNavigationRoute) => void
): MenuOption[] => [
  {
    id: 'routines',
    title: 'Rutinas',
    subtitle: 'Gestiona tus rutinas de entrenamiento',
    icon: 'list',
    color: colors.primary,
    onPress: () => onNavigate('Routines'),
  },
  {
    id: 'exercises',
    title: 'Ejercicios',
    subtitle: 'Explora nuestra biblioteca de ejercicios',
    icon: 'fitness-center',
    color: colors.primary,
    onPress: () => onNavigate('Exercises'),
  },
  {
    id: 'workouts',
    title: 'Entrenamientos',
    subtitle: 'Registra tus entrenamientos actuales',
    icon: 'timer',
    color: colors.primary,
    onPress: () => onNavigate('Workouts'),
  },
  {
    id: 'programs',
    title: 'Programas',
    subtitle: 'Descubre programas de entrenamiento',
    icon: 'library-books',
    color: colors.primary,
    onPress: () => onNavigate('Programs'),
  },
];
