import { CountdownTimer } from "./CountdownTimer";

interface CountdownSectionProps {
  className?: string;
}

export function CountdownSection({ className }: CountdownSectionProps) {
  return (
    <section
      id="countdown"
      aria-label="Event Countdown"
      className={`relative overflow-hidden bg-cyber-gray-900 py-16 sm:py-20 ${className || ""}`}
    >
      {/* 简洁的背景效果 */}
      <div className="absolute inset-0 -z-10">
        <div className="cyber-grid absolute inset-0 opacity-[0.03]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-cyber-brand-500/8 blur-[180px]" />
      </div>

      <div className="container mx-auto px-6">
        <div className="w-full max-w-5xl mx-auto">
          <CountdownTimer />
        </div>
      </div>
    </section>
  );
}

