import type { ReactNode } from 'react';

type Props = { title: string; subtitle?: string; icon?: ReactNode };

export default function EmptyState({ title, subtitle, icon }: Props) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      {icon && <div className="mb-3 text-ink-300">{icon}</div>}
      <p className="font-serif text-[18px] text-ink-700">{title}</p>
      {subtitle && (
        <p className="mt-1 text-[13px] text-ink-300 max-w-[260px]">{subtitle}</p>
      )}
    </div>
  );
}
