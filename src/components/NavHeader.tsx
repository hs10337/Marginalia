import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';

type Props = {
  title: string;
  eyebrow?: string;
  back?: boolean;
  right?: ReactNode;
};

export default function NavHeader({ title, eyebrow, back, right }: Props) {
  const nav = useNavigate();
  return (
    <header className="px-6 pt-7 pb-4">
      <div className="flex items-center justify-between min-h-[24px]">
        {back ? (
          <button
            onClick={() => nav(-1)}
            className="-ml-1 inline-flex items-center text-ink-700 hover:text-ink-900"
            aria-label="Back"
          >
            <ChevronLeft size={22} strokeWidth={1.6} />
            <span className="text-sm">Back</span>
          </button>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-2">{right}</div>
      </div>
      {eyebrow && (
        <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-ink-300 font-medium">
          {eyebrow}
        </p>
      )}
      <h1 className="font-serif text-[30px] leading-tight font-medium text-ink-900">
        {title}
      </h1>
    </header>
  );
}
