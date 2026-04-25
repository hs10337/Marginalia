import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  tone?: 'default' | 'accent' | 'ink';
};

export default function Chip({ children, tone = 'default', className = '', ...rest }: Props) {
  const tones: Record<NonNullable<Props['tone']>, string> = {
    default:
      'border border-cream-300 bg-cream-50/70 text-ink-700 hover:bg-cream-50',
    accent:
      'border border-accent/30 bg-accent/10 text-accent hover:bg-accent/15',
    ink:
      'border border-ink-700 bg-ink-900 text-cream-50 hover:bg-ink-700',
  };
  return (
    <button
      type="button"
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition active:scale-[0.98] ${tones[tone]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
