import { useCallback, useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import {
  Trophy,
  User,
  Timer,
  Play,
  RotateCcw,
  Target,
  Pencil,
  Volume2,
  VolumeX,
  LogOut,
} from "lucide-react";
import { Keypad } from "./Keypad";
import { TutorialMenu } from "./TutorialMenu";
import { sounds, setMuted } from "@/lib/sounds";
import {
  GOAL,
  TURN_SECONDS,
  COUNTDOWN_SECONDS,
  nextTarget,
  rollRange,
  scoreForHit,
  type RangeMax,
} from "@/lib/game-logic";

type Status = "idle" | "countdown" | "playing" | "reveal" | "over";

function burstConfetti() {
  const opts = { particleCount: 70, spread: 80, ticks: 200, zIndex: 60 };
  confetti({ ...opts, origin: { x: 0.1, y: 0.7 }, angle: 60 });
  confetti({ ...opts, origin: { x: 0.9, y: 0.7 }, angle: 120 });
  confetti({ ...opts, particleCount: 110, spread: 140, origin: { x: 0.5, y: 0.4 } });
}

export function NumberGame({ onExit }: { onExit?: () => void }) {
  const [status, setStatus] = useState<Status>("idle");
  const [current, setCurrent] = useState(0);
  const [target, setTarget] = useState<number | null>(null);
  const [, setRange] = useState<RangeMax>(10);
  const [guess, setGuess] = useState("");
  const [seconds, setSeconds] = useState(TURN_SECONDS);
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [feedback, setFeedback] = useState<"none" | "hit" | "miss">("none");
  const [playerName, setPlayerName] = useState("Você");
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [soundOn, setSoundOn] = useState(true);
  const resolvedRef = useRef(false);

  const exitToMenu = useCallback(() => {
    setScore(0);
    setHits(0);
    setRounds(0);
    setCurrent(0);
    setTarget(null);
    setGuess("");
    setFeedback("none");
    setStatus("idle");
    onExit?.();
  }, [onExit]);

  useEffect(() => {
    const saved = window.localStorage.getItem("player-name");
    if (saved) setPlayerName(saved);
  }, []);

  useEffect(() => {
    setMuted(!soundOn);
  }, [soundOn]);

  const saveName = () => {
    const clean = nameDraft.trim().slice(0, 16);
    const finalName = clean === "" ? "Você" : clean;
    setPlayerName(finalName);
    window.localStorage.setItem("player-name", finalName);
    setEditingName(false);
  };

  const startRound = useCallback((from: number) => {
    const nextRange = rollRange();
    setRange(nextRange);
    setTarget(nextTarget(from, nextRange));
    setGuess("");
    setSeconds(TURN_SECONDS);
    setFeedback("none");
    resolvedRef.current = false;
    setStatus("playing");
  }, []);

  const start = () => {
    sounds.unlock();
    setScore(0);
    setHits(0);
    setRounds(0);
    setFeedback("none");
    setGuess("");
    setCurrent(0);
    setTarget(null);
    setSeconds(TURN_SECONDS);
    setCountdown(COUNTDOWN_SECONDS);
    setStatus("countdown");
  };

  // Contagem regressiva antes do jogo começar
  useEffect(() => {
    if (status !== "countdown") return;
    const id = window.setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          window.clearInterval(id);
          sounds.countdownGo();
          const firstRange = rollRange();
          const first = nextTarget(0, firstRange);
          setRange(firstRange);
          setCurrent(first);
          startRound(first);
          return 0;
        }
        sounds.tick();
        return c - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [status, startRound]);

  /** Revela o número e avança (ou encerra) após um instante. */
  const resolveRound = useCallback(
    (hit: boolean, secondsLeft: number) => {
      if (resolvedRef.current || target === null) return;
      resolvedRef.current = true;
      setRounds((r) => r + 1);
      setStatus("reveal");
      setCurrent(target);
      setGuess("");
      setFeedback(hit ? "hit" : "miss");
      if (hit) {
        setHits((h) => h + 1);
        setScore((s) => s + scoreForHit(secondsLeft));
        burstConfetti();
        sounds.hit();
      } else {
        sounds.miss();
      }
      if (target >= GOAL) {
        window.setTimeout(() => {
          sounds.win();
          setStatus("over");
        }, 1500);
        return;
      }
      window.setTimeout(() => startRound(target), 1500);
    },
    [startRound, target],
  );

  const submit = useCallback(() => {
    if (status !== "playing" || target === null || guess === "") return;
    resolveRound(Number(guess) === target, seconds);
  }, [guess, resolveRound, seconds, status, target]);

  // Timer por tentativa
  useEffect(() => {
    if (status !== "playing") return;
    const id = window.setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          resolveRound(false, 0);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [status, resolveRound]);

  const pushDigit = (digit: string) => {
    if (status !== "playing") return;
    const next = (guess + digit).replace(/^0+/, "");
    if (next === "" || Number(next) > GOAL) return;
    sounds.key();
    setGuess(next);
  };

  const playing = status === "playing";
  const over = status === "over";
  const showHitBanner = status === "reveal" && feedback === "hit";

  return (
    <div className="stage-bg relative flex min-h-dvh flex-col">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-primary/40 bg-card text-primary">
            <User className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Jogador:</p>
            {editingName ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  saveName();
                }}
                className="flex items-center gap-1.5"
              >
                <input
                  autoFocus
                  value={nameDraft}
                  maxLength={16}
                  onChange={(e) => setNameDraft(e.target.value)}
                  onBlur={saveName}
                  aria-label="Nome do jogador"
                  className="w-28 rounded-lg border border-primary/50 bg-card px-2 py-1 text-sm font-bold uppercase tracking-wide text-foreground outline-none sm:w-36"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-primary px-2 py-1 text-xs font-bold uppercase text-primary-foreground"
                >
                  OK
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setNameDraft(playerName === "Você" ? "" : playerName);
                  setEditingName(true);
                }}
                className="flex min-w-0 items-center gap-1.5"
              >
                <span className="truncate text-sm font-bold uppercase tracking-wide sm:text-base">
                  {playerName}
                </span>
                <Pencil className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <TutorialMenu />
          <button
            type="button"
            onClick={() => setSoundOn((s) => !s)}
            aria-label={soundOn ? "Desativar som" : "Ativar som"}
            className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-muted-foreground"
          >
            {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>
          <span className="text-sm text-muted-foreground">Pontos:</span>
          <span className="text-lg font-bold tabular-nums sm:text-xl">
            {score.toLocaleString("pt-BR")}
          </span>
          <Trophy className="h-5 w-5 text-gold" />
          <button
            type="button"
            onClick={exitToMenu}
            aria-label="Sair do jogo"
            className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-muted-foreground"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-sm flex-1 flex-col items-center justify-between gap-5 px-4 py-5 sm:max-w-md sm:py-8">
        <section className="flex w-full flex-col items-center gap-4">
          <div
            className={`grid aspect-square w-32 place-items-center rounded-full border-4 border-primary bg-card sm:w-44 ${
              playing ? "animate-glow-pulse" : "neon-ring"
            } ${feedback === "miss" ? "animate-shake" : ""}`}
          >
            <span
              key={current}
              className="animate-pop text-5xl font-black tabular-nums sm:text-6xl"
            >
              {current}
            </span>
          </div>

          <p className="text-center text-sm uppercase tracking-[0.2em] text-muted-foreground">
            {status === "idle"
              ? `VAI ATÉ ${GOAL}`
              : over
                ? "Fim de jogo"
                : status === "countdown"
                  ? "Prepare-se"
                  : status === "reveal"
                    ? feedback === "hit"
                      ? "Acertou!"
                      : `Era ${target}`
                    : "Adivinhe o próximo número"}
          </p>

          <div className="flex min-w-44 items-center justify-center gap-2 rounded-2xl border border-border bg-card px-6 py-3 neon-ring">
            <span className="text-base font-bold uppercase tracking-wide">Palpite:</span>
            <span className="text-2xl font-black tabular-nums text-primary">{guess || "—"}</span>
          </div>

          <div className="flex w-full flex-col items-center gap-2">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Target className="h-4 w-4" /> {hits} acertos
              </span>
              <span className="flex items-center gap-1">
                <Timer className="h-4 w-4" /> {playing ? seconds : TURN_SECONDS}s
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-1000 ease-linear"
                style={{ width: `${playing ? (seconds / TURN_SECONDS) * 100 : 100}%` }}
              />
            </div>
          </div>
        </section>

        <section className="flex w-full flex-col gap-4">
          <Keypad
            onDigit={pushDigit}
            onBackspace={() => setGuess((g) => g.slice(0, -1))}
            onSubmit={submit}
            canSubmit={guess !== ""}
            disabled={!playing}
          />

          {(status === "idle" || over) && (
            <button
              type="button"
              onClick={start}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-xl font-black uppercase tracking-wider text-primary-foreground neon-ring transition-transform active:scale-[0.98]"
            >
              {over ? (
                <>
                  <RotateCcw className="h-5 w-5" /> Jogar de novo
                </>
              ) : (
                <>
                  <Play className="h-5 w-5" /> Iniciar
                </>
              )}
            </button>
          )}
        </section>
      </main>

      {/* Banner de contagem regressiva */}
      {status === "countdown" && (
        <div className="absolute inset-0 z-50 grid place-items-center bg-background/85 px-6 backdrop-blur-sm">
          <div className="animate-fade-in w-full max-w-sm rounded-3xl border border-primary/50 bg-card px-6 py-8 text-center neon-ring">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
              O jogo vai começar em:
            </p>
            <p
              key={countdown}
              className="animate-pop mt-3 text-7xl font-black tabular-nums text-primary sm:text-8xl"
            >
              {countdown}
            </p>
          </div>
        </div>
      )}

      {/* Banner de acerto */}
      {showHitBanner && (
        <div className="pointer-events-none absolute inset-0 z-50 grid place-items-center px-6">
          <div className="animate-pop rounded-3xl border border-primary bg-card px-8 py-6 text-center neon-ring-strong">
            <p className="text-3xl font-black uppercase tracking-wide text-primary sm:text-4xl">
              Você acertou!
            </p>
            <p className="mt-1 text-sm uppercase tracking-[0.2em] text-muted-foreground">
              +{scoreForHit(seconds).toLocaleString("pt-BR")} pontos
            </p>
          </div>
        </div>
      )}

      {/* Banner de fim de jogo */}
      {over && (
        <div className="absolute inset-0 z-50 grid place-items-center bg-background/85 px-6 backdrop-blur-sm">
          <div className="animate-fade-in w-full max-w-sm rounded-3xl border border-primary/50 bg-card px-6 py-8 text-center neon-ring">
            <Trophy className="mx-auto h-10 w-10 text-gold" />
            <p className="mt-3 text-sm uppercase tracking-[0.2em] text-muted-foreground">
              Fim de jogo
            </p>
            <p className="mt-3 text-2xl font-black sm:text-3xl">
              Você acertou <span className="text-primary">{hits}</span>{" "}
              {hits === 1 ? "número" : "números"}!
            </p>
            <p className="mt-2 text-lg font-bold text-muted-foreground">
              Ganhou <span className="text-foreground">{score.toLocaleString("pt-BR")}</span>{" "}
              pontos.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{rounds} rodadas</p>
            <button
              type="button"
              onClick={start}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-lg font-black uppercase tracking-wider text-primary-foreground neon-ring transition-transform active:scale-[0.98]"
            >
              <RotateCcw className="h-5 w-5" /> Jogar de novo
            </button>
            {onExit && (
              <button
                type="button"
                onClick={exitToMenu}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card py-3.5 text-base font-black uppercase tracking-wider text-muted-foreground transition-transform active:scale-[0.98]"
              >
                <LogOut className="h-5 w-5" /> Sair
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
