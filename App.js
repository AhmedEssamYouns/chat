import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainTabNavigator from './Routes/tabs';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

const fetchFonts = () => {
  return Font.loadAsync({
    'title': require('./assets/fonts/Matemasie-Regular.ttf'),
  });
};

export default function App() {
  const [fontsLoaded, setFontsLoaded] = React.useState(false);

  React.useEffect(() => {
    async function prepare() {
      try {
        // Load fonts
        await fetchFonts();
      } catch (e) {
        console.warn(e);
      } finally {
        setFontsLoaded(true);
        // Hide the splash screen
        SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!fontsLoaded) {
    return null; // Optionally, return a loading indicator or placeholder
  }

  return (
    <NavigationContainer>
      <MainTabNavigator/>
    </NavigationContainer>
  );
}
