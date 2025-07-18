export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface MenuOption {
  id: string;
  title: string;
  subtitle: string;
  icon: string; // MaterialIcons name
  color: string;
  onPress: () => void;
}

export type NavigationRoute = 
  | 'Training'
  | 'Progress'
  | 'Nutrition'
  | 'Community'
  | 'History';

export type ExerciseNavigationRoute = 
  | 'Routines'
  | 'Exercises'
  | 'Workouts'
  | 'Programs'
  | 'History';

// Re-export nutrition types
export * from './nutrition';
