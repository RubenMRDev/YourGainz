import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MainScreen, ProfileScreen, EditProfileScreen, ProgressScreen, OnboardingScreen, ExerciseScreen, ExercisesListScreen } from './src/components';

type Screen = 'onboarding' | 'main' | 'profile' | 'editProfile' | 'progress' | 'exercises' | 'exercisesList';

interface UserData {
  name: string;
  email: string;
  phone: string;
  currentWeight: number;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserData>({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 8900",
    currentWeight: 75,
  });

  // Verificar si el usuario ya completó el onboarding
  useEffect(() => {
    checkOnboardingStatus();
  }, []);

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

  const navigateToProgress = () => {
    setCurrentScreen('progress');
  };

  const navigateToExercises = () => {
    setCurrentScreen('exercises');
  };

  const navigateToExercisesList = () => {
    setCurrentScreen('exercisesList');
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
          />
        );
      case 'exercisesList':
        return (
          <ExercisesListScreen
            onBackPress={navigateToExercises}
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
            onEditProfile={navigateToEditProfile}
          />
        );
      case 'main':
      default:
        return (
          <MainScreen 
            userName={userData.name} 
            onProfilePress={navigateToProfile} 
            onProgressPress={navigateToProgress}
            onTrainingPress={navigateToExercises}
          />
        );
    }
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {renderScreen()}
        <StatusBar style="light" backgroundColor="#1a1a1a" />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
});
