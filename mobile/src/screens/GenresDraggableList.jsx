import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { Button, Icon, Pressable, Text, VStack } from 'native-base';
import { AntDesign } from '@expo/vector-icons';

import { DraggableFlatlist } from '@components/DraggableFlatlist';
import { storeObjectData } from '@utils/storage';

export default function GenresList({ route }) {
  const { genres } = route.params;
  const navigation = useNavigation();

  const [sortedGenres, setSortedGenres] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  function handleGoBack() {
    navigation.goBack();
  };

  async function handleSave() {
    setIsSaving(true);
    await storeObjectData("@sortedGenres", sortedGenres);
    setIsSaving(false);
    handleGoBack();
  };

  useEffect(() => {
    setSortedGenres(genres);
  }, [genres]);

  return (
    <VStack flex={1} safeArea bg="#7e22ceea" alignItems="center" p={8}>
      <Pressable onPress={handleGoBack} position="absolute" right={8} top={12}>
        <Icon as={AntDesign} name="close" size={6} color="trueGray.50" />
      </Pressable>
      <Text fontSize="md" color="trueGray.50" fontFamily="Lato_400Regular" pt={4} pb={8}>
        drag and drop to set the genres display order
      </Text>
      <DraggableFlatlist
        data={sortedGenres}
        onDragEnd={({ data }) => setSortedGenres(data)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 104 }}
      />
      <Button
        position="absolute" bottom={8}
        w="full" rounded="full" py={4}
        bg="trueGray.50"
        borderWidth={2}
        borderColor="purple.800"
        _pressed={{ bg: "trueGray.100" }}
        onPress={handleSave}
        isLoading={isSaving}
      >
        <Text fontSize="lg" fontFamily="Montserrat_600SemiBold" color="purple.800">SAVE</Text>
      </Button>
    </VStack>
  );
};