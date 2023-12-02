import { authRouter } from "./router/auth";
import { lobbyRouter } from "./router/lobby";
import { postRouter } from "./router/post";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  post: postRouter,
  lobby: lobbyRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
