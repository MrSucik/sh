import React from "react";
import { Pressable, Text, View } from "react-native";
import { router, Stack } from "expo-router";

import { useDiscordAuth } from "~/hooks/useDiscordAuth";

const Index = () => {
  const { login } = useDiscordAuth({
    onSuccess: () => router.replace("/lobbies"),
  });
  return (
    <>
      <Stack.Screen options={{ title: "Secret Hitler" }} />
      <View className="flex h-full w-full justify-center bg-slate-900 p-4">
        <Pressable onPress={() => login()}>
          <Text className="text-center text-xl font-semibold text-white">
            Sign in with Discord
          </Text>
        </Pressable>
      </View>
    </>
  );
};

export default Index;
