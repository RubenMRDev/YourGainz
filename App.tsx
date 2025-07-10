import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MainScreen, ProfileScreen, EditProfileScreen, ProgressScreen } from './src/components';

type Screen = 'main' | 'profile' | 'editProfile' | 'progress';

interface UserData {
  name: string;
  email: string;
  phone: string;
  currentWeight: number;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('main');
  const [userData, setUserData] = useState<UserData>({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 8900",
    currentWeight: 75,
  });

  const navigateToProfile = () => {
    setCurrentScreen('profile');
  };

  const navigateToEditProfile = () => {
    setCurrentScreen('editProfile');
  };

  const navigateToProgress = () => {
    setCurrentScreen('progress');
  };

  const navigateToMain = () => {
    setCurrentScreen('main');
  };

  const handleSaveProfile = (newUserData: UserData) => {
    setUserData(newUserData);
  };

  const renderScreen = () => {
    switch (currentScreen) {
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
        return <MainScreen userName={userData.name} onProfilePress={navigateToProfile} onProgressPress={navigateToProgress} />;
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
});
