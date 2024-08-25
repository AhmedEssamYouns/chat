import React, { useEffect } from 'react';
import { AppState, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import MainTabNavigator from './Routes/stack.nav';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { setOnlineStatus } from './firebase/onlineStutes'

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Function to load custom fonts
const fetchFonts = () => {
  return Font.loadAsync({
    'title': require('./assets/fonts/Matemasie-Regular.ttf'),
  });
};

const App = () => {
  const [fontsLoaded, setFontsLoaded] = React.useState(false);

  useEffect(() => {
    // Prepare the app (load fonts and hide splash screen)
    const prepare = async () => {
      try {
        await fetchFonts();
      } catch (e) {
        console.warn(e);
      } finally {
        setFontsLoaded(true);
        SplashScreen.hideAsync();
      }
    };

    prepare();
  }, []);

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState.match(/inactive|background/)) {
        setOnlineStatus(false); // Set user status to offline
      } else {
        setOnlineStatus(true); // Set user status to online
      }
    };

    // Add event listener for app state changes
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Cleanup function
    return () => {
      subscription.remove(); // Remove event listener on unmount
    };
  }, []);

  if (!fontsLoaded) {
    return null; // Optionally, return a loading indicator or placeholder
  }

  return (
    <NavigationContainer>
      <MainTabNavigator />
    </NavigationContainer>
  );
};

export default App;
