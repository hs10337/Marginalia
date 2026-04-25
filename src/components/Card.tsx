import type { HTMLAttributes, ReactNode } from 'react';

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  tone?: 'paper' | 'inkwell';
};

export default function Card({ children, tone = 'paper', className = '', ...rest }: Props) {
  const base =
    tone === 'paper'
      ? 'bg-cream-50/80 border hairline shadow-paper'
      : 'bg-ink-900 text-cream-50 border border-ink-700 shadow-paper';
  return (
    <div className={`rounded-2xl ${base} ${className}`} {...rest}>
      {children}
    </div>
  );
}
