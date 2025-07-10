# YourGainz - Fitness Application

A modern React Native fitness application built with Expo and TypeScript.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # App header with logo and user profile
│   ├── WelcomeSection.tsx  # Welcome message component
│   ├── MenuCard.tsx    # Individual menu item card
│   ├── MenuSection.tsx # Menu container component
│   ├── MainScreen.tsx  # Main screen composition
│   └── index.ts        # Component exports
├── constants/
│   └── theme.ts        # Design system (colors, typography, spacing)
├── types/
│   └── index.ts        # TypeScript interfaces and types
└── utils/
    └── menuOptions.ts  # Menu configuration and navigation logic
```

## Architecture Principles

### 1. **Component-Based Architecture**
- Each UI element is a separate, reusable component
- Components are focused on a single responsibility
- Props are strongly typed with TypeScript interfaces

### 2. **Design System**
- Centralized theme configuration in `constants/theme.ts`
- Consistent colors, typography, and spacing throughout the app
- Easy to maintain and modify design tokens

### 3. **Type Safety**
- Full TypeScript implementation
- Strongly typed interfaces for all data structures
- Type-safe navigation and component props

### 4. **Scalable Structure**
- Modular file organization
- Easy to add new features and components
- Separation of concerns between UI, data, and business logic

## Features

### Main Interface
- **Header**: App branding and user profile
- **Welcome Section**: Personalized greeting and motivation
- **Menu Cards**: Four main application sections:
  - 🏋️ **Entrenamiento**: Access to routines and exercises
  - 📊 **Progreso**: View training statistics
  - ⚖️ **Nutrición**: Manage diet and nutrition
  - 👥 **Comunidad**: Connect with other users

### Design Features
- Dark theme optimized for fitness applications
- Yellow accent color matching the YourGainz branding
- Smooth animations and touch feedback
- Responsive card-based layout
- Modern shadows and rounded corners

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm start
   ```

3. **Run on specific platforms**:
   ```bash
   npm run android  # Android
   npm run ios      # iOS
   npm run web      # Web
   ```

## Next Steps for Extension

### 1. **Navigation Implementation**
Replace the current alert-based navigation with a proper navigation library:
```bash
npm install @react-navigation/native @react-navigation/stack
```

### 2. **State Management**
Add Redux Toolkit or Zustand for global state management:
```bash
npm install @reduxjs/toolkit react-redux
```

### 3. **Authentication**
Implement user authentication and profile management.

### 4. **Data Persistence**
Add AsyncStorage or SQLite for local data storage.

### 5. **API Integration**
Connect to backend services for user data, workouts, and community features.

## Technologies Used

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **TypeScript**: Type-safe JavaScript
- **React Native Paper** (future): Material Design components
- **React Navigation** (future): Navigation library

## Contributing

1. Follow the established folder structure
2. Use TypeScript for all new components
3. Follow the design system defined in `theme.ts`
4. Write reusable, single-responsibility components
5. Add proper type definitions for all data structures
# YourGainz
# YourGainz
