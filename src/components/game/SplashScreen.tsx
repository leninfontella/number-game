import { Play, Sparkles } from "lucide-react";
import { TutorialMenu } from "./TutorialMenu";
import { GOAL } from "@/lib/game-logic";

export function SplashScreen({ onPlay }: { onPlay: () => void }) {
  return (
    <div className="stage-bg relative flex min-h-dvh flex-col items-center justify-between px-6 py-8">
      <header className="flex w-full items-center justify-between">
        <TutorialMenu />
        <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">0 → {GOAL}</span>
      </header>

      <main className="flex flex-col items-center gap-8 text-center">
        <div className="animate-float">
          <div className="grid aspect-square w-36 place-items-center rounded-full border-4 border-primary bg-card animate-glow-pulse sm:w-44">
            <span className="text-5xl font-black tabular-nums text-primary sm:text-6xl">?</span>
          </div>
        </div>

        <div className="animate-rise-in">
          <p className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.35em] text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-gold" /> Adivinhe o número
          </p>
          <h2 className="mt-2 text-5xl font-black uppercase leading-[0.9] tracking-tight sm:text-6xl">
            <span className="block text-primary">Number</span>
            <span className="block">Game</span>
          </h2>
        </div>

        <button
          type="button"
          onClick={onPlay}
          style={{ animationDelay: "0.35s" }}
          className="animate-rise-in flex items-center justify-center gap-2 rounded-2xl bg-primary px-12 py-4 text-2xl font-black uppercase tracking-wider text-primary-foreground neon-ring transition-transform active:scale-[0.98]"
        >
          <Play className="h-6 w-6" /> Jogar
        </button>
      </main>
    </div>
  );
}
