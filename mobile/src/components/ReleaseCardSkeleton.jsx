import { Dimensions } from 'react-native';
import { Center, Skeleton, VStack } from "native-base";

export function ReleaseCardSkeleton() {
  const cardSize = Dimensions.get("window").width - 40;

  return (
    <VStack w={cardSize} bg="purple.800" rounded="xl">
      <Center>
        <Skeleton
          w={cardSize - 24}
          h={cardSize - 24}
          mt={3}
          rounded="xl"
          startColor="purple.600"
        />
      </Center>
      <Center px={5} h={24}>
        <Skeleton.Text lines={2} startColor="purple.600" />
      </Center>
    </VStack>
  );
};