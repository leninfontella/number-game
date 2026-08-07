let ctx: AudioContext | null = null;
let muted = false;

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function setMuted(value: boolean) {
  muted = value;
}

export function isMuted() {
  return muted;
}

type ToneOptions = {
  freq: number;
  duration?: number;
  delay?: number;
  type?: OscillatorType;
  gain?: number;
  sweepTo?: number;
};

function tone({ freq, duration = 0.14, delay = 0, type = "sine", gain = 0.08, sweepTo }: ToneOptions) {
  if (muted) return;
  const ac = audio();
  if (!ac) return;
  const start = ac.currentTime + delay;
  const osc = ac.createOscillator();
  const vol = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  if (sweepTo) osc.frequency.exponentialRampToValueAtTime(sweepTo, start + duration);
  vol.gain.setValueAtTime(0.0001, start);
  vol.gain.exponentialRampToValueAtTime(gain, start + 0.015);
  vol.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(vol).connect(ac.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

export const sounds = {
  unlock: () => audio(),
  key: () => tone({ freq: 520, duration: 0.06, type: "square", gain: 0.045 }),
  tick: () => tone({ freq: 880, duration: 0.05, type: "triangle", gain: 0.05 }),
  countdownGo: () => tone({ freq: 1240, duration: 0.22, type: "triangle", gain: 0.07 }),
  hit: () => {
    [523, 659, 784, 1046].forEach((f, i) => tone({ freq: f, delay: i * 0.09, duration: 0.18, type: "triangle", gain: 0.07 }));
  },
  miss: () => tone({ freq: 300, sweepTo: 120, duration: 0.32, type: "sawtooth", gain: 0.06 }),
  win: () => {
    [523, 659, 784, 1046, 1318].forEach((f, i) =>
      tone({ freq: f, delay: i * 0.12, duration: 0.3, type: "sine", gain: 0.08 }),
    );
  },
};
