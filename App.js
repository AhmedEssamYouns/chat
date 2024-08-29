import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppState } from 'react-native'; 
import MainTabNavigator from './Routes/stack.nav';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { removeUserFromAllChats, rejoinChats, getRemovedChats } from './firebase/manage-Chat-room';
import { FIREBASE_AUTH } from './firebase/config';
import Toast from 'react-native-toast-message';
SplashScreen.preventAutoHideAsync();

const fetchFonts = () => {
  return Font.loadAsync({
    'title': require('./assets/fonts/Matemasie-Regular.ttf'),
  });
};

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
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

    const handleAppStateChange = async (nextAppState) => {
      const userId = FIREBASE_AUTH.currentUser?.uid;
      if (userId) {
        if (appState === 'active' && nextAppState.match(/inactive|background/)) {
          // App is moving to the background or becoming inactive
          await removeUserFromAllChats(userId);
          console.log('App is moving to the background');
        }
        if (appState.match(/inactive|background/) && nextAppState === 'active') {
          // App has come to the foreground
          const removedChatIds = await getRemovedChats(userId);
          await rejoinChats(userId, removedChatIds);
          console.log('App has come to the foreground');
        }
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [appState]);

  if (!fontsLoaded) {
    return null; // Optionally, return a loading indicator or placeholder
  }

  return (
    <>
    <NavigationContainer>
      <MainTabNavigator />
    </NavigationContainer>
    <Toast ref={(ref) => Toast.setRef(ref)} />
    </>
  );
};

export default App;
