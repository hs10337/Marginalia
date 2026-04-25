import type { ReactNode } from 'react';

type Props = { children: ReactNode };

export default function PhoneFrame({ children }: Props) {
  return (
    <div className="min-h-full w-full flex items-center justify-center p-0 sm:p-8">
      {/* On small screens: fill the viewport. On larger: render an iPhone bezel. */}
      <div
        className="
          relative w-full h-[100dvh] max-w-none rounded-none bg-cream-100 overflow-hidden
          sm:h-[860px] sm:w-[400px] sm:rounded-[54px] sm:shadow-bezel
          sm:ring-1 sm:ring-black/40
        "
      >
        {/* bezel inset (only on large screens via padding) */}
        <div className="absolute inset-0 sm:p-[10px]">
          <div
            className="
              relative h-full w-full bg-cream-100 overflow-hidden flex flex-col
              sm:rounded-[44px] sm:ring-1 sm:ring-black/10
            "
          >
            {/* status bar (cosmetic, desktop only) */}
            <div className="hidden sm:flex items-center justify-between px-7 pt-3 pb-1 text-[12px] font-medium text-ink-900/80 shrink-0">
              <span className="tracking-wide">9:41</span>
              <div className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-ink-900/70" />
                <span className="inline-block h-2 w-3 rounded-sm bg-ink-900/70" />
                <span className="inline-block h-2 w-4 rounded-sm border border-ink-900/70" />
              </div>
            </div>
            {/* dynamic island (desktop only) */}
            <div className="hidden sm:block absolute top-2 left-1/2 -translate-x-1/2 h-6 w-28 rounded-full bg-black/85 z-10" />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
