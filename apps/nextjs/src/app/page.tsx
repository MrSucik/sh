import { auth } from "@acme/auth";

import { AuthShowcase } from "./_components/auth-showcase";
import { Lobbies } from "./_components/lobbies";

export default async function HomePage() {
  const session = await auth();

  return (
    <main className="flex h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container mt-12 flex flex-col items-center justify-center gap-4 py-8">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Secret Hitler
        </h1>
        <AuthShowcase />

        {session && <Lobbies />}
      </div>
    </main>
  );
}
