import { z } from "zod";

import { schema } from "@acme/db";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const authRouter = createTRPCRouter({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),

  register: publicProcedure
    .input(z.object({ username: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db
        .insert(schema.users)
        .values({ email: input.username, id: input.username });

      return user;
    }),
});
