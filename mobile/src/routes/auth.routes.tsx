import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';

import Splash from '@screens/Splash';
import SignIn from '@screens/SignIn';

type AuthRoutes = {
  splash: undefined;
  signIn: undefined;
};

export type AuthNavigatorRoutesProps = NativeStackNavigationProp<AuthRoutes>;

const { Navigator, Screen } = createNativeStackNavigator<AuthRoutes>();

export function AuthRoutes() {
  return (
    <Navigator initialRouteName="splash" screenOptions={{ headerShown: false }}>
      <Screen name="splash" component={Splash} />
      <Screen name="signIn" component={SignIn} />
    </Navigator>
  );
};