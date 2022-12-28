import { useEffect } from 'react';
import { Dimensions } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';

import LottieView from 'lottie-react-native';
import { Center } from 'native-base';

import musicLoaderJson from '../../assets/music-loader.json';

export default function Splash() {
  const size = Dimensions.get("window").width * 0.7;

  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      navigation.dispatch(CommonActions.reset({
        index: 0,
        routes: [{ name: "signIn" }],
      }));
    }, 4500);
  }, []);

  return (
    <Center flex={1} bg="purple.600">
      <LottieView
        source={musicLoaderJson}
        autoPlay
        loop={false}
        resizeMode="contain"
        speed={0.7}
        style={{ width: size, height: size }}
      />
    </Center>
  );
};