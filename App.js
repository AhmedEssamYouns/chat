import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppState } from 'react-native'; 
import MainTabNavigator from './Routes/stack.nav';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import Toast from 'react-native-toast-message';



SplashScreen.preventAutoHideAsync();

const fetchFonts = () => {
  return Font.loadAsync({
    'title': require('./assets/fonts/Matemasie-Regular.ttf'),
  });
};

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  useEffect(() => {
    const prepare = async () => {
      try {
        await fetchFonts();
      } catch (e) {
      } finally {
        setFontsLoaded(true);
        SplashScreen.hideAsync();
      }
    };

    prepare();

    return () => {
    };
  }, []);

  if (!fontsLoaded) {
    return null; 
  }

  return (
    <>
      <NavigationContainer>
        <MainTabNavigator />
      </NavigationContainer>
      <Toast />
    </>
  );
};

export default App;
