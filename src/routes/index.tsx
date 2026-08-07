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
      { property: "og:title", content: "Number Game | Adivinhe o número" },
      {
        property: "og:description",
        content: "Acerte os números e ganhe pontos.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://numbergame-luck.vercel.app/og-image.png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://numbergame-luck.vercel.app/og-image.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "icon", type: "image/png", href: "https://numbergame-luck.vercel.app/app_icon.png" },
    ],
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
