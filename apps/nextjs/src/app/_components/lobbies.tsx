"use client";

import type { RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";
import { makeHash } from "~/utils/makeHash";

export const Lobbies = () => {
  const utils = api.useUtils();
  const lobbies = api.lobby.all.useQuery();
  const create = api.lobby.create.useMutation({
    onSuccess: () => utils.lobby.invalidate(),
  });
  return (
    <div className="bg-slate-900">
      <div className="h-full w-full p-4">
        <button
          onClick={() =>
            create.mutateAsync({ title: makeHash(5).toUpperCase() })
          }
          className="text-center text-xl font-semibold text-white"
        >
          Create New Lobby
        </button>

        <div className="grid gap-2">
          {lobbies.data?.map((lobby) => (
            <LobbyCard key={lobby.id} lobby={lobby} />
          ))}
        </div>
      </div>
    </div>
  );
};

function LobbyCard({
  lobby,
}: {
  lobby: RouterOutputs["lobby"]["all"][number];
}) {
  const session = api.auth.getSession.useQuery();
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
    <div className="flex flex-row rounded-lg bg-white p-4">
      <div className="flex flex-grow justify-between">
        <p className="text-xl font-semibold">{lobby.title}</p>
        <p className="">Players: {lobbyPlayers.data?.length ?? 0}/7</p>
      </div>
      <div className="flex items-end justify-between gap-4">
        <button
          onClick={async () => {
            await join.mutateAsync({
              lobbyId: lobby.id,
              userId: session.data?.user.id!,
            });
          }}
        >
          <p className="font-bold uppercase text-[rgb(65,23,42)]">
            JOIN LOBBY ➡️
          </p>
        </button>
        <button onClick={() => remove.mutateAsync(lobby.id)}>
          <p className="font-bold uppercase text-red-600">DELETE</p>
        </button>
      </div>
    </div>
  );
}
