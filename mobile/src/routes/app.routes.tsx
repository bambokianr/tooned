import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';

import ReleasesFeed from '@screens/ReleasesFeed';
import GenresDraggableList from '@screens/GenresDraggableList';

type AppRoutes = {
  releasesFeed: undefined;
  genresDraggableList: undefined;
};

export type AppNavigatorRoutesProps = NativeStackNavigationProp<AppRoutes>;

const { Navigator, Screen } = createNativeStackNavigator<AppRoutes>();

export function AppRoutes() {
  return (
    <Navigator initialRouteName="releasesFeed" screenOptions={{ headerShown: false }}>
      <Screen name="releasesFeed" component={ReleasesFeed} />
      <Screen name="genresDraggableList" component={GenresDraggableList} options={{ presentation: "transparentModal" }} />
    </Navigator>
  );
};