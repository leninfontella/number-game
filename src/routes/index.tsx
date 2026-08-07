import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { NumberGame } from "@/components/game/NumberGame";
import { SplashScreen } from "@/components/game/SplashScreen";

export const Route = createFileRoute("/")({
  head: () => ({
    title: "Number Game | Adivinhe o número!",
    meta: [
      {
        name: "description",
        content: "Jogo mobile de adivinhação.",
      },
      { property: "og:title", content: "Adivinhe o Número!" },
      {
        property: "og:description",
        content: "Acerte os números e com um pouco de sorte, ganhe pontos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "icon", type: "image/png", href: "/public/app_icon.png" }],
  }),
  component: Index,
});

function Index() {
  const [playing, setPlaying] = useState(false);
  const [runId, setRunId] = useState(0);

  return (
    <>
      <h1 className="sr-only">Number Game: adivinhe os números.</h1>
      {playing ? (
        <NumberGame
          key={runId}
          onExit={() => {
            setPlaying(false);
            setRunId((n) => n + 1);
          }}
        />
      ) : (
        <SplashScreen onPlay={() => setPlaying(true)} />
      )}
    </>
  );
}
