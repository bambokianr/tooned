import { createContext, ReactNode, useEffect, useState } from 'react';
import { ResponseType, useAuthRequest } from 'expo-auth-session';

import { CLIENT_ID, CLIENT_SECRET } from '@config/spotifyCredentials';
import { UserDTO } from '@dtos/UserDTO';
import { getStringData, storeStringData } from '@utils/storage';
import spotifyService from '@services/spotify';

export type AuthContextDataProps = {
  user: UserDTO;
  signIn: () => void;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO);

  const discovery = {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'https://accounts.spotify.com/api/token',
  };

  const [_, response, promptAsync] = useAuthRequest({
    responseType: ResponseType.Token,
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    scopes: [
      "playlist-modify-public",
      "user-read-email",
    ],
    usePKCE: false,
    redirectUri: "exp://127.0.0.1:19000/"
  }, discovery);

  async function authenticateSpotifyUser() {
    const data = await spotifyService.getCurrentUsersProfile();
    setUser({ spotifyId: data.id });
  };

  useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params;
      storeStringData("@spotify_accessToken", access_token);
      authenticateSpotifyUser();
    }
  }, [response]);

  const signIn = () => promptAsync();

  async function loadUserData() {
    const userIdLogged = await getStringData("@spotify_userId");

    if (userIdLogged)
      setUser({ spotifyId: userIdLogged });
  };

  useEffect(() => {
    loadUserData();
  }, []);

  return (
    <AuthContext.Provider value={{ user, signIn }}>
      {children}
    </AuthContext.Provider>
  );
};