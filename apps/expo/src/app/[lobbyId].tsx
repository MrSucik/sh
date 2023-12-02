import { Pressable, Text, View } from "react-native";
import { router, Stack, useGlobalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { api } from "~/utils/api";

const LobbyDetail = () => {
  const { lobbyId } = useGlobalSearchParams();
  if (!lobbyId || typeof lobbyId !== "string") throw new Error("unreachable");
  const lobbyData = api.lobby.byId.useQuery({ id: parseInt(lobbyId) });
  const lobbyPlayers = api.lobby.playersByLobbyId.useQuery({
    lobbyId: parseInt(lobbyId),
  });
  if (!lobbyData) return null;
  const leaveLobby = api.lobby.leaveLobby.useMutation({
    onSuccess: () => router.replace("/lobbies"),
  });

  const playersRemaining = 7 - (lobbyPlayers.data?.length ?? 0);

  return (
    <>
      <Stack.Screen options={{ title: "Game: " + lobbyData.data?.title }} />

      <View>
        <Text className="mt-4 text-center font-semibold">Players</Text>
        {lobbyPlayers.data?.map((player) => (
          <Text className="text-center" key={player.id}>
            {player.id}
          </Text>
        ))}
        <Text className="mb-4 mt-8 text-center text-slate-400">
          Waiting for {playersRemaining} more players...
        </Text>
        <Pressable
          onPress={async () =>
            leaveLobby.mutateAsync({
              userId: (await AsyncStorage.getItem("userId")) + "",
            })
          }
        >
          <Text className="text-center text-xl font-semibold text-red-500">
            LEAVE LOBBY
          </Text>
        </Pressable>
      </View>
    </>
  );
};
export default LobbyDetail;
