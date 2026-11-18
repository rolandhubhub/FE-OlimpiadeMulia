type StepperProps = {
  /** Label tiap langkah, urut dari langkah pertama. */
  steps: string[];
  /** Langkah aktif, dimulai dari 1. */
  current: number;
  className?: string;
};

/** Stepper 2–3 langkah seperti di design/user-html/event.html & buku-keranjang.html. */
export function Stepper({ steps, current, className = "" }: StepperProps) {
  if (steps.length === 0) return null;

  const active = Math.min(Math.max(current, 1), steps.length);
  const progress = steps.length > 1 ? ((active - 1) / (steps.length - 1)) * 100 : 0;

  return (
    <div className={`relative mx-auto w-full max-w-[700px] ${className}`}>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 bg-garis"
      />
      <div
        aria-hidden="true"
        className="absolute left-0 top-1/2 h-[3px] -translate-y-1/2 bg-sukses transition-[width] duration-300"
        style={{ width: `${progress}%` }}
      />

      <ol className="relative z-10 flex items-center justify-between gap-2">
        {steps.map((label, index) => {
          const step = index + 1;
          const isCompleted = step < active;
          const isActive = step === active;

          return (
            <li
              key={label}
              aria-current={isActive ? "step" : undefined}
              className={`bg-putih px-2 text-xs font-semibold ${
                isCompleted
                  ? "text-sukses"
                  : isActive
                    ? "text-magenta"
                    : "text-teks-sekunder/60"
              }`}
            >
              {String(step).padStart(2, "0")}. {label}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
