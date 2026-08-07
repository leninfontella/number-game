export const GOAL = 100;
export const TURN_SECONDS = 10;
export const COUNTDOWN_SECONDS = 5;

export type RangeMax = 10 | 20;

/** Faixa do sorteio: sorteada aleatoriamente entre 1–10 e 1–20. */
export function rollRange(): RangeMax {
  return Math.random() < 0.55 ? 10 : 20;
}

export function randomStep(rangeMax: RangeMax): number {
  return 1 + Math.floor(Math.random() * rangeMax);
}

/** Gera o próximo número secreto a partir do número atual, sem passar de 100. */
export function nextTarget(current: number, rangeMax: RangeMax): number {
  const remaining = GOAL - current;
  if (remaining <= 0) return GOAL;
  const step = Math.min(randomStep(rangeMax), remaining);
  return current + step;
}

/** Pontos do acerto: quanto mais tempo sobrando, mais pontos. */
export function scoreForHit(secondsLeft: number): number {
  return 100 + Math.max(0, secondsLeft) * 20;
}
