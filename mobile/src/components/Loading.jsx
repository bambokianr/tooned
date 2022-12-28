import { Center, Spinner } from 'native-base';

export function Loading() {
  return (
    <Center flex={1} bg="purple.800">
      <Spinner color="green.400" />
    </Center>
  );
};