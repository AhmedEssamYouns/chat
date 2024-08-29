import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainTabNavigator from './Routes/stack.nav';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

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
