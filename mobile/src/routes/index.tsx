import { useContext } from 'react';
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";

import { useAuth } from '@hooks/useAuth';

import { Box } from 'native-base';

import { AuthRoutes } from "./auth.routes";
import { AppRoutes } from './app.routes';

export function Routes() {
  const { user } = useAuth();

  const theme = DefaultTheme;

  return (
    <Box flex={1}>
      <NavigationContainer theme={theme}>
        {user.spotifyId ? <AppRoutes /> : <AuthRoutes />}
      </NavigationContainer>
    </Box>
  );
}