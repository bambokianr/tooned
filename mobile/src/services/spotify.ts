import axios from 'axios';

import { getStringData, storeStringData } from '@utils/storage';

// https://developer.spotify.com/console/
const spotifyAPI = axios.create({
  baseURL: "https://api.spotify.com/v1",
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
  }
});

async function getCurrentUsersProfile() {
  const accessToken = await getStringData("@spotify_accessToken");
  spotifyAPI.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

  try {
    const response = await spotifyAPI.get("/me");
    storeStringData("@spotify_userId", response.data.id);
    // storeStringData("@spotify_userName", response.data.display_name);

    return response.data;
  } catch (err) {
    console.log("error", err);
  }
};

async function getUsersPlaylists() {
  const accessToken = await getStringData("@spotify_accessToken");
  spotifyAPI.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  const userId = await getStringData("@spotify_userId");

  try {
    const response = await spotifyAPI.get(`/users/${userId}/playlists`);

    // response.data.items.map((playlist: any) => console.log(playlist.name));

    return response.data.items;
  } catch (err) {
    console.log("error", err);
  }
};

async function createPlaylist(weeklyDate: string) {
  const accessToken = await getStringData("@spotify_accessToken");
  spotifyAPI.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  const userId = await getStringData("@spotify_userId");

  try {
    const response = await spotifyAPI.post(`/users/${userId}/playlists`, {
      name: `app.tooned - ${weeklyDate}`,
      description: `> lançamentos nacionais da sexta-feira ${weeklyDate}`,
      public: true,
    });

    storeStringData(`@spotify_playlistId_${weeklyDate}`, response.data.id);
    return response.data.id;
  } catch (err) {
    console.log("error", err);
  }
};

async function addItemsToPlaylist({ playlistId, trackId }: { playlistId: string, trackId: string }) {
  const accessToken = await getStringData("@spotify_accessToken");
  spotifyAPI.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

  try {
    const response = await spotifyAPI.post(`/playlists/${playlistId}/tracks`, null, {
      params: {
        uris: `spotify:track:${trackId}`,
      },
    });

    return response.data;
  } catch (err) {
    console.log("error", err);
  }
};


export default {
  getCurrentUsersProfile,
  createPlaylist,
  addItemsToPlaylist,
}