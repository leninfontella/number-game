import { Menu, Target, Timer, Trophy, Hash } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { GOAL, TURN_SECONDS } from "@/lib/game-logic";

const steps = [
  {
    icon: Hash,
    title: "1. O jogo sorteia",
    text: "O jogo começa no 0 e sorteia um número secreto.",
  },
  {
    icon: Target,
    title: "2. Você adivinha",
    text: "Digite no teclado o número que você acha que vem em seguida e toque em GO!",
  },
  {
    icon: Timer,
    title: `3. ${TURN_SECONDS} segundos por palpite`,
    text: "Se o tempo acabar ou o palpite estiver errado, o número correto é revelado e o jogo continua a partir dele e você perde a chance de pontuar.",
  },
  {
    icon: Trophy,
    title: "4. Chegue até " + GOAL,
    text: "Cada acerto vale pontos — e quanto mais tempo sobrando, mais pontos. O jogo termina ao alcançar o " + GOAL + ".",
  },
];

export function TutorialMenu() {
  return (
    <Sheet>
      <SheetTrigger
        aria-label="Abrir menu"
        className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-muted-foreground"
      >
        <Menu className="h-4 w-4" />
      </SheetTrigger>
      <SheetContent side="left" className="w-[86vw] max-w-sm border-border bg-card">
        <SheetHeader>
          <SheetTitle className="text-2xl font-black uppercase tracking-wide text-primary">
            Tutorial
          </SheetTitle>
          <SheetDescription className="uppercase tracking-[0.2em]">
            Como jogar o Number Game
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-4 pb-6">
          {steps.map((step) => (
            <div
              key={step.title}
              className="flex gap-3 rounded-2xl border border-border bg-secondary/40 p-3"
            >
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-primary/40 text-primary">
                <step.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-wide">{step.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{step.text}</p>
              </div>
            </div>
          ))}
          <p className="text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Boa sorte!
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
