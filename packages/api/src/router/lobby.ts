import { z } from "zod";

import { desc, eq, schema } from "@acme/db";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const lobbyRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.lobby.findMany({ orderBy: desc(schema.lobby.id) });
  }),

  byId: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.lobby.findFirst({
        where: eq(schema.lobby.id, input.id),
      });
    }),

  create: publicProcedure
    .input(z.object({ title: z.string().min(1) }))
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(schema.lobby).values(input);
    }),

  delete: publicProcedure.input(z.number()).mutation(({ ctx, input }) => {
    return ctx.db.delete(schema.lobby).where(eq(schema.lobby.id, input));
  }),

  playersByLobbyId: publicProcedure
    .input(z.object({ lobbyId: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.users.findMany({
        where: eq(schema.users.lobbyId, input.lobbyId),
      });
    }),

  joinLobby: publicProcedure
    .input(z.object({ lobbyId: z.number(), userId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db
        .update(schema.users)
        .set({ lobbyId: input.lobbyId })
        .where(eq(schema.users.id, input.userId));
    }),

  leaveLobby: publicProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db
        .update(schema.users)
        .set({ lobbyId: null })
        .where(eq(schema.users.id, input.userId));
    }),
});
