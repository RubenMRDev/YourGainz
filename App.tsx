import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, Alert } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MainScreen, ProfileScreen, EditProfileScreen, SettingsScreen, ProgressScreen, OnboardingScreen, ExerciseScreen, ExercisesListScreen, RoutinesScreen, RoutineTrackingScreen, RoutineHistoryScreen, RoutineHistoryDetailScreen, EditRoutineHistoryScreen, NutritionScreen } from './src/components';
import { RoutineHistory, CompletedExercise } from './src/types/history';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';

type Screen = 'onboarding' | 'main' | 'profile' | 'editProfile' | 'settings' | 'progress' | 'exercises' | 'exercisesList' | 'routines' | 'routineTracking' | 'routineHistory' | 'routineHistoryDetail' | 'editRoutineHistory' | 'nutrition';

interface UserData {
  name: string;
  email: string;
  phone: string;
  currentWeight: number;
}

interface Routine {
  id: string;
  name: string;
  description: string;
  exercises: any[];
  duration: string;
}

function AppContent() {
  const { theme } = useTheme();
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
  const [routineHistory, setRoutineHistory] = useState<RoutineHistory[]>([]);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<RoutineHistory | null>(null);
  const [userData, setUserData] = useState<UserData>({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 8900",
    currentWeight: 75,
  });

  // Verificar si el usuario ya completó el onboarding
  useEffect(() => {
    checkOnboardingStatus();
    // Agregar datos de ejemplo al historial para pruebas
    initializeSampleHistory();
  }, []);

  const initializeSampleHistory = () => {
    const sampleHistory: RoutineHistory[] = [
      {
        id: '1',
        routineId: '1',
        routineName: 'Push Day',
        routineDescription: 'Rutina de empuje: pecho, hombros y tríceps',
        completedAt: new Date(Date.now() - 86400000).toISOString(), // Ayer
        duration: '42:15',
        completedExercises: 3,
        totalExercises: 3,
        exercises: [
          {
            id: '1',
            name: 'Push-ups',
            completed: true,
            completedSets: 3,
            totalSets: 3,
            reps: '12-15',
            weight: null,
            rest: '60s'
          },
          {
            id: '4',
            name: 'Shoulder Press',
            completed: true,
            completedSets: 3,
            totalSets: 3,
            reps: '8-10',
            weight: '40kg',
            rest: '90s'
          },
          {
            id: '10',
            name: 'Tricep Dips',
            completed: true,
            completedSets: 3,
            totalSets: 3,
            reps: '10-12',
            weight: null,
            rest: '60s'
          }
        ],
        completionPercentage: 100
      },
      {
        id: '2',
        routineId: '2',
        routineName: 'Pull Day',
        routineDescription: 'Rutina de tracción: espalda y bíceps',
        completedAt: new Date(Date.now() - 172800000).toISOString(), // Hace 2 días
        duration: '38:45',
        completedExercises: 2,
        totalExercises: 3,
        exercises: [
          {
            id: '3',
            name: 'Pull-ups',
            completed: true,
            completedSets: 3,
            totalSets: 3,
            reps: '6-8',
            weight: null,
            rest: '90s'
          },
          {
            id: '2',
            name: 'Bicep Curls',
            completed: true,
            completedSets: 2,
            totalSets: 3,
            reps: '10-12',
            weight: '15kg',
            rest: '60s'
          },
          {
            id: '5',
            name: 'Bent Over Rows',
            completed: false,
            completedSets: 0,
            totalSets: 3,
            reps: '8-10',
            weight: '50kg',
            rest: '90s'
          }
        ],
        completionPercentage: 67
      }
    ];
    setRoutineHistory(sampleHistory);
  };

  const checkOnboardingStatus = async () => {
    try {
      // Siempre mostrar el onboarding (comentado para forzar que aparezca)
      // const hasCompletedOnboarding = await AsyncStorage.getItem('hasCompletedOnboarding');
      // if (hasCompletedOnboarding === 'true') {
      //   setCurrentScreen('main');
      // }
    } catch (error) {
      console.log('Error checking onboarding status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para resetear el onboarding (útil durante desarrollo)
  const resetOnboarding = async () => {
    try {
      await AsyncStorage.removeItem('hasCompletedOnboarding');
      setCurrentScreen('onboarding');
    } catch (error) {
      console.log('Error resetting onboarding:', error);
    }
  };

  const navigateToProfile = () => {
    setCurrentScreen('profile');
  };

  const navigateToEditProfile = () => {
    setCurrentScreen('editProfile');
  };

  const navigateToSettings = () => {
    setCurrentScreen('settings');
  };

  const navigateToProgress = () => {
    setCurrentScreen('progress');
  };

  const navigateToNutrition = () => {
    setCurrentScreen('nutrition');
  };

  const navigateToExercises = () => {
    setCurrentScreen('exercises');
  };

  const navigateToExercisesList = () => {
    setCurrentScreen('exercisesList');
  };

  const navigateToRoutines = () => {
    setCurrentScreen('routines');
  };

  const navigateToRoutineTracking = (routine: Routine) => {
    setSelectedRoutine(routine);
    setCurrentScreen('routineTracking');
  };

  const handleFinishRoutine = (exerciseStates: any[], totalTime: string) => {
    if (!selectedRoutine) return;

    const completedExercises = exerciseStates.filter(state => state.completed).length;

    // Crear entrada de historial
    const historyEntry: RoutineHistory = {
      id: Date.now().toString(),
      routineId: selectedRoutine.id,
      routineName: selectedRoutine.name,
      routineDescription: selectedRoutine.description,
      completedAt: new Date().toISOString(),
      duration: totalTime,
      completedExercises,
      totalExercises: selectedRoutine.exercises.length,
      exercises: selectedRoutine.exercises.map((exercise, index) => {
        const state = exerciseStates.find(s => s.id === exercise.id);
        return {
          id: exercise.id,
          name: exercise.name,
          completed: state ? state.completed : false,
          completedSets: state ? state.completedSets : 0,
          totalSets: exercise.sets,
          reps: exercise.reps,
          weight: exercise.weight,
          rest: exercise.rest
        };
      }),
      completionPercentage: Math.round((completedExercises / selectedRoutine.exercises.length) * 100)
    };

    // Agregar al historial
    setRoutineHistory(prev => [historyEntry, ...prev]);

    console.log(`Rutina completada: ${completedExercises} ejercicios en ${totalTime}`);
    setSelectedRoutine(null);
    setCurrentScreen('routines');
  };

  const navigateToHistory = () => {
    setCurrentScreen('routineHistory');
  };

  const navigateToHistoryDetail = (historyItem: RoutineHistory) => {
    setSelectedHistoryItem(historyItem);
    setCurrentScreen('routineHistoryDetail');
  };

  const navigateToEditHistory = (historyItem: RoutineHistory) => {
    setSelectedHistoryItem(historyItem);
    setCurrentScreen('editRoutineHistory');
  };

  const handleDeleteHistoryItem = (historyId: string) => {
    setRoutineHistory(prev => prev.filter(item => item.id !== historyId));
  };

  const handleSaveHistoryEdit = (updatedHistory: RoutineHistory) => {
    setRoutineHistory(prev => 
      prev.map(item => item.id === updatedHistory.id ? updatedHistory : item)
    );
    setCurrentScreen('routineHistory');
    setSelectedHistoryItem(null);
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      setCurrentScreen('main');
    } catch (error) {
      console.log('Error saving onboarding status:', error);
      setCurrentScreen('main'); // Continuar de todos modos
    }
  };

  const navigateToMain = () => {
    setCurrentScreen('main');
  };

  const handleSaveProfile = (newUserData: UserData) => {
    setUserData(newUserData);
  };

  const renderScreen = () => {
    if (isLoading) {
      return <View style={styles.loadingContainer} />;
    }

    switch (currentScreen) {
      case 'onboarding':
        return <OnboardingScreen onComplete={completeOnboarding} />;
      case 'exercises':
        return (
          <ExerciseScreen
            userName={userData.name}
            onProfilePress={navigateToProfile}
            onBackPress={navigateToMain}
            onExercisesPress={navigateToExercisesList}
            onRoutinesPress={navigateToRoutines}
            onHistoryPress={navigateToHistory}
          />
        );
      case 'exercisesList':
        return (
          <ExercisesListScreen
            onBackPress={navigateToExercises}
          />
        );
      case 'routines':
        return (
          <RoutinesScreen 
            onBackPress={navigateToExercises}
            onStartRoutine={navigateToRoutineTracking}
          />
        );
      case 'progress':
        return (
          <ProgressScreen 
            onGoBack={navigateToMain}
            initialWeight={userData.currentWeight}
            userName={userData.name}
          />
        );
      case 'nutrition':
        return (
          <NutritionScreen 
            onBack={navigateToMain}
          />
        );
      case 'editProfile':
        return (
          <EditProfileScreen 
            userName={userData.name}
            userEmail={userData.email}
            userPhone={userData.phone}
            userWeight={userData.currentWeight}
            onGoBack={() => setCurrentScreen('profile')}
            onSave={handleSaveProfile}
          />
        );
      case 'profile':
        return (
          <ProfileScreen 
            userName={userData.name} 
            userEmail={userData.email}
            userPhone={userData.phone}
            userWeight={userData.currentWeight}
            onGoBack={navigateToMain}
            onOpenSettings={navigateToSettings}
          />
        );
      case 'settings':
        return (
          <SettingsScreen 
            onGoBack={() => setCurrentScreen('profile')}
            onEditProfile={navigateToEditProfile}
          />
        );
      case 'routineTracking':
        return selectedRoutine ? (
          <RoutineTrackingScreen 
            routine={selectedRoutine}
            onGoBack={() => {
              setSelectedRoutine(null);
              setCurrentScreen('routines');
            }}
            onFinishRoutine={handleFinishRoutine}
          />
        ) : null;
      case 'routineHistory':
        return (
          <RoutineHistoryScreen 
            onGoBack={navigateToExercises}
            onViewRoutineDetail={navigateToHistoryDetail}
            routineHistory={routineHistory}
          />
        );
      case 'routineHistoryDetail':
        return selectedHistoryItem ? (
          <RoutineHistoryDetailScreen 
            routineHistory={selectedHistoryItem}
            onGoBack={() => {
              setSelectedHistoryItem(null);
              setCurrentScreen('routineHistory');
            }}
            onEdit={() => navigateToEditHistory(selectedHistoryItem)}
            onDelete={() => {
              Alert.alert(
                'Eliminar del historial',
                '¿Estás seguro de que quieres eliminar esta rutina del historial? Esta acción no se puede deshacer.',
                [
                  { text: 'Cancelar', style: 'cancel' },
                  { 
                    text: 'Eliminar', 
                    style: 'destructive',
                    onPress: () => {
                      handleDeleteHistoryItem(selectedHistoryItem.id);
                      setSelectedHistoryItem(null);
                      setCurrentScreen('routineHistory');
                    }
                  }
                ]
              );
            }}
          />
        ) : null;
      case 'editRoutineHistory':
        return selectedHistoryItem ? (
          <EditRoutineHistoryScreen 
            routineHistory={selectedHistoryItem}
            onGoBack={() => {
              setSelectedHistoryItem(null);
              setCurrentScreen('routineHistory');
            }}
            onSave={handleSaveHistoryEdit}
          />
        ) : null;
      case 'main':
      default:
        return (
          <MainScreen 
            userName={userData.name} 
            onProfilePress={navigateToProfile} 
            onProgressPress={navigateToProgress}
            onTrainingPress={navigateToExercises}
            onNutritionPress={navigateToNutrition}
          />
        );
    }
  };

  return (
    <SafeAreaProvider>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {renderScreen()}
        <StatusBar style={theme.background === '#1a1a1a' ? 'light' : 'dark'} />
      </View>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
  },
});
