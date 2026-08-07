import { Delete, Check } from "lucide-react";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"] as const;

type KeypadProps = {
  onDigit: (digit: string) => void;
  onBackspace: () => void;
  onSubmit: () => void;
  canSubmit: boolean;
  disabled?: boolean;
};

const keyBase =
  "flex h-14 items-center justify-center rounded-xl border border-border bg-card text-2xl font-bold text-foreground key-shadow transition-all duration-100 active:translate-y-0.5 active:brightness-125 disabled:opacity-40 sm:h-16 sm:text-3xl";

export function Keypad({ onDigit, onBackspace, onSubmit, canSubmit, disabled }: KeypadProps) {
  return (
    <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
      {KEYS.map((key) => (
        <button
          key={key}
          type="button"
          aria-label={key}
          disabled={disabled}
          onClick={() => onDigit(key)}
          className={keyBase}
        >
          {key}
        </button>
      ))}
      <button
        type="button"
        aria-label="Apagar"
        disabled={disabled}
        onClick={onBackspace}
        className={keyBase}
      >
        <Delete className="h-6 w-6" />
      </button>
      <button
        type="button"
        aria-label="Confirmar palpite"
        disabled={disabled || !canSubmit}
        onClick={onSubmit}
        className="flex h-14 items-center justify-center gap-1.5 rounded-xl bg-primary text-xl font-extrabold tracking-tight text-primary-foreground neon-ring transition-all duration-100 active:translate-y-0.5 disabled:opacity-40 disabled:shadow-none sm:h-16 sm:text-2xl"
      >
        GO! <Check className="h-5 w-5" strokeWidth={3} />
      </button>
    </div>
  );
}
