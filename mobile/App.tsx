import { useFonts } from 'expo-font';
import { Lato_400Regular, Lato_700Bold, Lato_900Black } from '@expo-google-fonts/lato';
import { Montserrat_500Medium, Montserrat_600SemiBold } from '@expo-google-fonts/montserrat';

import { Routes } from './src/routes';
import { THEME } from './src/theme';

import { NativeBaseProvider } from 'native-base';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthContextProvider } from '@contexts/AuthContext';
import { StatusBar } from 'react-native';
import { Loading } from '@components/Loading';

export default function App() {
  const [fontsLoaded] = useFonts({
    Lato_400Regular, Lato_700Bold, Lato_900Black,
    Montserrat_500Medium, Montserrat_600SemiBold,
  });

  return (
    <NativeBaseProvider theme={THEME}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />
        <AuthContextProvider>
          {fontsLoaded ? <Routes /> : <Loading />}
        </AuthContextProvider>
      </GestureHandlerRootView>
    </NativeBaseProvider>
  );
};