import { useEffect } from "react";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { api } from "~/utils/api";

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: "https://discord.com/oauth2/authorize",
  tokenEndpoint: "https://discord.com/api/oauth2/token",
  revocationEndpoint: "https://discord.com/api/oauth2/token/revoke",
};

export const useDiscordAuth = ({ onSuccess }: { onSuccess: () => void }) => {
  const [, response, promptAsync] = useAuthRequest(
    {
      clientId: "1180446444675661854",
      scopes: ["email"],
      redirectUri: makeRedirectUri({ scheme: "secret-hitler" }),
    },
    discovery,
  );

  const register = api.auth.register.useMutation();

  useEffect(() => {
    const checkForFinishedAuth = async () => {
      if (response?.type === "success") {
        await register.mutateAsync({
          username: response.params.code!,
        });
        await AsyncStorage.setItem("userId", response.params.code!);
        onSuccess();
      }
    };

    checkForFinishedAuth();
  }, [response]);

  const login = () => promptAsync();

  return { login };
};
