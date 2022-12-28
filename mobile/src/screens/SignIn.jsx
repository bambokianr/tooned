import { useAuth } from '@hooks/useAuth';

import { Entypo } from '@expo/vector-icons';
import { Button, HStack, Icon, Image, Text, VStack } from 'native-base';

import logoImg from '../../assets/logo.png';

export default function SignIn() {
  const { signIn } = useAuth();

  return (
    <VStack flex={1} bg="purple.800">
      <VStack alignItems="center" mt={40} mb={40}>
        <Image source={logoImg} alt="tooned logo" w={180} h={100} mb={4} />
        <Text textAlign="center" color="trueGray.50" fontSize="lg" lineHeight="md" fontFamily="Lato_400Regular">
          about always being <Text color="green.400" fontFamily="Lato_700Bold">in tune</Text> with{'\n'}
          <Text color="green.400" fontSize="xl" fontFamily="Lato_700Bold">your country's music</Text>
        </Text>
      </VStack>
      <HStack alignItems="center" justifyContent="center" mt={64}>
        <Button
          h={20} w={328} rounded="full"
          bg="purple.600"
          _pressed={{ bg: "purple.800", borderWidth: 1, borderColor: "trueGray.50" }}
          onPress={signIn}
        >
          <HStack alignItems="center" space={4}>
            <Icon as={Entypo} name="spotify" size={12} color="#1AD760" />
            <Text fontSize="md" fontFamily="Montserrat_600SemiBold" color="trueGray.50">CONNECT WITH SPOTIFY</Text>
          </HStack>
        </Button>
      </HStack>
    </VStack>
  );
};