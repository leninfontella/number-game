import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { NumberGame } from "@/components/game/NumberGame";
import { SplashScreen } from "@/components/game/SplashScreen";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Adivinhe o Número — Jogo de 0 a 100" },
      {
        name: "description",
        content:
          "Jogo mobile de adivinhação: saia do 0 e acerte os próximos números até chegar a 100. 5 tentativas e 5 segundos por palpite.",
      },
      { property: "og:title", content: "Adivinhe o Número — Jogo de 0 a 100" },
      {
        property: "og:description",
        content: "Acerte os números sorteados e chegue a 100 ganhando pontos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [playing, setPlaying] = useState(false);
  const [runId, setRunId] = useState(0);

  return (
    <>
      <h1 className="sr-only">Number Game: adivinhe os números de 0 até 100</h1>
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
