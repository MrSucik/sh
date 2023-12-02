import { Pressable, Text, View } from "react-native";
import { router, Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlashList } from "@shopify/flash-list";

import type { RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";
import { makeHash } from "~/utils/makeHash";

export default function Lobbies() {
  const utils = api.useUtils();
  const lobbies = api.lobby.all.useQuery();
  const create = api.lobby.create.useMutation({
    onSettled: () => utils.lobby.invalidate(),
  });
  return (
    <>
      <Stack.Screen options={{ title: "Secret Hitler" }} />
      <View className="bg-slate-900">
        <View className="h-full w-full p-4">
          <Pressable
            onPress={() =>
              create.mutateAsync({ title: makeHash(5).toUpperCase() })
            }
            className="mb-4"
          >
            <Text className="text-center text-xl font-semibold text-white">
              Create New Lobby
            </Text>
          </Pressable>

          <FlashList
            data={lobbies.data}
            estimatedItemSize={20}
            ItemSeparatorComponent={() => <View className="h-2" />}
            renderItem={(p) => <LobbyCard lobby={p.item} />}
          />
        </View>
      </View>
    </>
  );
}

function LobbyCard({
  lobby,
}: {
  lobby: RouterOutputs["lobby"]["all"][number];
}) {
  const utils = api.useUtils();
  const join = api.lobby.joinLobby.useMutation({
    onSuccess: () => utils.lobby.invalidate(),
  });
  const remove = api.lobby.delete.useMutation({
    onSuccess: () => utils.lobby.invalidate(),
  });
  const lobbyPlayers = api.lobby.playersByLobbyId.useQuery({
    lobbyId: lobby.id,
  });
  return (
    <View className="flex flex-row rounded-lg bg-white p-4">
      <View className="flex flex-grow justify-between">
        <Text className="text-xl font-semibold">{lobby.title}</Text>
        <Text className="">Players: {lobbyPlayers.data?.length ?? 0}/7</Text>
      </View>
      <View className="flex items-end justify-between gap-4">
        <Pressable
          onPress={async () => {
            await join.mutateAsync({
              lobbyId: lobby.id,
              userId: (await AsyncStorage.getItem("userId")) + "",
            });
            router.replace(`/${lobby.id}`);
          }}
        >
          <Text className="font-bold uppercase text-[rgb(65,23,42)]">
            JOIN LOBBY ➡️
          </Text>
        </Pressable>
        <Pressable onPress={() => remove.mutateAsync(lobby.id)}>
          <Text className="font-bold uppercase text-red-600">DELETE</Text>
        </Pressable>
      </View>
    </View>
  );
}
