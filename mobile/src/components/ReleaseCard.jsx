import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import { Audio } from 'expo-av';

import DefaultAlbumCoverImg from '../../assets/default-album-cover.png';

import { Center, Circle, Icon, Image, Pressable, Text, VStack } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

export function ReleaseCard({ release }) {
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);

  const cardSize = Dimensions.get("window").width - 40;

  const { name: track, mp3Preview, imageUrl, artist } = release;

  async function loadSound(soundUri) {
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

    const { sound } = await Audio.Sound.createAsync({ uri: soundUri });
    await sound.setIsLoopingAsync(true);
    setSound(sound);
  };

  const playSound = async () => await sound.playAsync();
  const pauseSound = async () => await sound.pauseAsync();

  useEffect(() => {
    if (sound)
      isPlaying ? playSound() : pauseSound();
  }, [isPlaying]);

  useEffect(() => {
    return sound
      ? () => sound.unloadAsync()
      : undefined;
  }, [sound]);

  useEffect(() => {
    loadSound(mp3Preview);
  }, [mp3Preview]);

  return (
    <VStack w={cardSize} bg="purple.800" rounded="xl">
      <Center>
        <Image
          source={{ uri: imageUrl }}
          defaultSource={DefaultAlbumCoverImg}
          alt="release album cover"
          w={cardSize - 24}
          h={cardSize - 24}
          mt={3}
          rounded="xl"
          resizeMode="cover"
        />
        <Pressable position="absolute" right={6} bottom={4} onPress={() => setIsPlaying(!isPlaying)}>
          <Circle bg="dark.50" size={12} justifyContent="center">
            <Icon as={MaterialIcons} name={isPlaying ? "pause-circle-filled" : "play-circle-filled"} size={12} color="purple.800" />
          </Circle>
        </Pressable>
      </Center>
      <VStack px={5} h={24} justifyContent="center">
        <Text numberOfLines={2} color="trueGray.50" fontFamily="Lato_400Regular" fontSize="md" lineHeight={18}>{track}</Text>
        <Text numberOfLines={1} color="trueGray.300" fontFamily="Lato_900Black" pt={1}>{artist}</Text>
      </VStack>
    </VStack>
  );
};