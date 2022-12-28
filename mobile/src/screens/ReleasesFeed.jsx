import { useState, useRef, useEffect } from 'react';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useToast } from 'native-base';
import * as Linking from 'expo-linking';

import { getStringData, getObjectData } from '@utils/storage';
import spotifyService from '@services/spotify';
import { data as mockGenres } from '../data/genres';
import { data as mockReleases } from '../data/releases';

import Swiper from 'react-native-deck-swiper';
import { Box, Center, Circle, FlatList, HStack, Icon, Pressable, Text } from 'native-base';
import { Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons';

import { ReleaseCardSkeleton } from '@components/ReleaseCardSkeleton';
import { ReleaseCard } from '@components/ReleaseCard';

function GenreItem({ name, isSelected, handlePressToSelectGenre }) {
  return (
    <Pressable
      h={10} mr={3} px={3}
      bg={isSelected ? "green.400" : "dark.50"}
      rounded="md"
      justifyContent="center"
      alignItems="center"
      overflow="hidden"
      isPressed={isSelected}
      borderWidth={1}
      borderColor="green.400"
      onPress={() => handlePressToSelectGenre(name)}
    >
      <Text
        color={isSelected ? "dark.50" : "green.400"}
        textTransform="uppercase"
        fontSize="xs"
        fontWeight="bold"
        fontFamily="Montserrat_500Medium"
      >
        {name}
      </Text>
    </Pressable>
  );
};

export default function ReleasesFeed() {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const toast = useToast();
  const swiperRef = useRef(null);
  const flatListRef = useRef(null);

  const [playlistId, setPlaylistId] = useState();
  const [weeklyDate, setWeeklyDate] = useState("");
  const [genres, setGenres] = useState([]);
  const [flatListIndex, setFlatListIndex] = useState(0);
  const [selectedGenre, setSelectedGenre] = useState();
  const [cardIndex, setCardIndex] = useState(0);
  const [releasesLoading, setReleasesLoading] = useState(true);
  const [tracksByGenre, setTracksByGenre] = useState([]);
  const [tracksCountByGenre, setTracksCountByGenre] = useState(0);

  function handleOpenSpotifyPlaylist() {
    if (!!playlistId)
      Linking.openURL(`spotify:playlist:${playlistId}`);
    else
      toast.show({
        title: "A playlist ainda não foi criada no seu perfil Spotify. Dê like em algum lançamento para criá-la!",
        placement: "top",
        bgColor: "purple.600",
      });
  };

  function handleNavigateToGenresDraggableList() {
    navigation.navigate("genresDraggableList", { genres });
  };

  function handlePressToSelectGenre(genreName) {
    setCardIndex(0);
    swiperRef.current.jumpToCardIndex(0);
    setFlatListIndex(genres.indexOf(genreName));
    setSelectedGenre(genreName);
  };

  function handleSwiped(cardIndex) {
    if (cardIndex < tracksCountByGenre - 1)
      setCardIndex(cardIndex + 1);
    else {
      const nextGenre = genres[genres.indexOf(selectedGenre) + 1];
      if (!!nextGenre) {
        setFlatListIndex(genres.indexOf(selectedGenre) + 1);
        setSelectedGenre(nextGenre);
      };
    };
  };

  const playlistIdPostSet = async () => {
    const createdPlaylistId = await spotifyService.createPlaylist(weeklyDate);
    setPlaylistId(createdPlaylistId);
  };

  async function handleAddTrackToPlaylist(cardIndex) {
    if (!playlistId) await playlistIdPostSet();

    const trackId = tracksByGenre[cardIndex].spotifyId;
    playlistId && spotifyService.addItemsToPlaylist({ playlistId, trackId });
  };

  const storagedPlaylistIdGetSet = async () => {
    const playlistIdFromStorage = await getStringData(`@spotify_playlistId_${weeklyDate}`);
    if (!!playlistIdFromStorage) setPlaylistId(playlistIdFromStorage);
  };

  const weeklyDateGetSet = () => {
    let lastFridayDate = new Date();
    lastFridayDate.setDate(lastFridayDate.getDate() - (lastFridayDate.getDay() + 2) % 7);

    const lastFridayDay = ("0" + lastFridayDate.getDate()).slice(-2);
    const lastFridayMonth = ("0" + (lastFridayDate.getMonth() + 1)).slice(-2);
    const lastFridayYear = lastFridayDate.getFullYear();

    const formattedLastFridayDate = `${lastFridayDay}/${lastFridayMonth}/${lastFridayYear}`;

    setWeeklyDate(formattedLastFridayDate);
  };

  const allGenresGetSet = async () => {
    let allGenres;
    const sortedGenres = await getObjectData("@sortedGenres");
    if (!!sortedGenres) {
      // setGenres(sortedGenres);
      allGenres = sortedGenres;
    } else {
      // setGenres(mockGenres.sort()); 
      allGenres = mockGenres.sort();
    };
    setGenres(allGenres);
  };

  const mockReleasesByGenreGetSet = (genreName) => {
    const data = mockReleases.filter(mockReleasesByGenre =>
      mockReleasesByGenre.genreName === genreName)?.[0];

    if (!!data) {
      setTracksByGenre(data.tracks);
      setTracksCountByGenre(data.tracksCount);
    };
  };

  useEffect(() => {
    if (flatListIndex > 0)
      flatListRef.current?.scrollToIndex({
        index: flatListIndex,
        animated: true,
        viewPosition: 0.5,
      });
  }, [flatListIndex]);

  useEffect(() => {
    storagedPlaylistIdGetSet();
    weeklyDateGetSet();
  }, []);

  useEffect(() => {
    if (isFocused)
      allGenresGetSet();
  }, [isFocused]);

  useEffect(() => {
    if (genres.length > 0)
      setSelectedGenre(genres[0]);
  }, [genres]);

  useEffect(() => {
    mockReleasesByGenreGetSet(selectedGenre);
  }, [selectedGenre]);

  useEffect(() => {
    if (tracksByGenre.length > 0)
      setReleasesLoading(false);
  }, [tracksByGenre]);

  return (
    <Box flex={1} safeArea bg="dark.50">
      <HStack justifyContent="flex-end" space={4} m={8}>
        <Pressable onPress={handleOpenSpotifyPlaylist}>
          <Circle size={12} bg="dark.100">
            <Icon as={Entypo} name="spotify" size={8} color="#1AD760" />
          </Circle>
        </Pressable>
        <Center
          bg="purple.600"
          px={4} py={2}
          rounded="full"
          _text={{ color: "dark.100", fontWeight: "bold", fontSize: "md", fontFamily: "Lato_700Bold" }}
        >{weeklyDate}</Center>
      </HStack>
      <HStack alignItems="center" mb={6}>
        <FlatList
          ref={flatListRef}
          initialScrollIndex={flatListIndex}
          data={genres}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <GenreItem
              name={item}
              isSelected={selectedGenre === item}
              handlePressToSelectGenre={handlePressToSelectGenre}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          _contentContainerStyle={{ px: 5 }}
        />
        <Center ml={4} mr={5} bg="dark.50">
          <Pressable bg="green.400" rounded="lg" p={1} onPress={handleNavigateToGenresDraggableList}>
            <Icon as={MaterialIcons} name="drag-handle" size={10} color="dark.50" />
          </Pressable>
        </Center>
      </HStack>
      <Center>
        {releasesLoading
          ? <ReleaseCardSkeleton />
          : <Swiper
            ref={swiperRef}
            cards={tracksByGenre}
            renderCard={release => <ReleaseCard release={release} />}
            cardIndex={cardIndex}
            verticalSwipe={false}
            onSwiped={handleSwiped}
            onSwipedRight={handleAddTrackToPlaylist}
            animateCardOpacity
            backgroundColor="transparent"
            cardVerticalMargin={0}
            cardHorizontalMargin={20}
            infinite
          />}
        <HStack
          bg="purple.600"
          h={24} w={48} rounded="xl"
          justifyContent="center" alignItems="center"
          position="absolute" top={512}
        >
          <Pressable mx={3}
            onPress={() => swiperRef?.current?.swipeLeft()}>
            <Circle size={16} bg="dark.50">
              <Icon as={Ionicons} name="close" size={12} color="danger.500" pt={0.5} />
            </Circle>
          </Pressable>
          <Pressable mx={3} onPress={() => swiperRef?.current?.swipeRight()}>
            <Circle size={16} bg="dark.50">
              <Icon as={Ionicons} name="heart" size={9} color="success.400" pt={0.5} />
            </Circle>
          </Pressable>
        </HStack>
      </Center>
    </Box>
  );
};