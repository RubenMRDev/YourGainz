export const lightTheme = {
  primary: '#B8860B', // Darker yellow/gold for light mode
  background: '#ffffff', // Light background
  cardBackground: '#f8f9fa', // Light card background
  surface: '#f8f9fa', // Light surface color for cards and components
  error: '#ef4444', // Error color
  success: '#22c55e', // Success color
  text: {
    primary: '#1a1a1a',
    secondary: '#6b7280',
    accent: '#B8860B'
  },
  icons: {
    training: '#B8860B',
    progress: '#B8860B',
    nutrition: '#B8860B',
    community: '#B8860B',
    history: '#B8860B'
  }
};

export const darkTheme = {
  primary: '#FFD700', // Yellow from YourGainz logo
  background: '#1a1a1a', // Dark background
  cardBackground: '#2a2a2a', // Card background
  surface: '#2a2a2a', // Surface color for cards and components
  error: '#ef4444', // Error color
  success: '#22c55e', // Success color
  text: {
    primary: '#ffffff',
    secondary: '#a0a0a0',
    accent: '#FFD700'
  },
  icons: {
    training: '#FFD700',
    progress: '#FFD700',
    nutrition: '#FFD700',
    community: '#FFD700',
    history: '#FFD700'
  }
};

// Para mantener compatibilidad con el código existente
export const colors = darkTheme;

export const typography = {
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36
  },
  weights: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const
  }
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48
};

export const layout = {
  statusBarHeight: 44, // Height for status bar margin
  bottomSafeArea: 34, // Height for bottom safe area (iPhone X+)
  headerPadding: 20, // Additional padding for header
  screenPadding: 16, // General screen padding
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20
};
