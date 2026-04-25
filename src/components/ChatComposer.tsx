import { useState, type FormEvent } from 'react';
import { Send } from 'lucide-react';

type Props = {
  onSubmit: (text: string) => void;
  scopedHint?: string;
};

export default function ChatComposer({ onSubmit, scopedHint }: Props) {
  const [value, setValue] = useState('');
  const handle = (e: FormEvent) => {
    e.preventDefault();
    const v = value.trim();
    if (!v) return;
    onSubmit(v);
    setValue('');
  };
  return (
    <form
      onSubmit={handle}
      className="px-4 pt-2 pb-3 bg-cream-100/95 border-t hairline"
    >
      <div className="flex items-end gap-2">
        <div className="flex-1 rounded-2xl border hairline bg-cream-50 px-3 py-2 shadow-paper">
          {scopedHint && (
            <p className="text-[11px] text-ink-300 mb-1">{scopedHint}</p>
          )}
          <textarea
            rows={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handle(e);
              }
            }}
            placeholder="Add a note, ask a question…"
            className="w-full resize-none bg-transparent text-[15px] leading-snug text-ink-900 placeholder:text-ink-300 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-ink-900 text-cream-50 active:scale-[0.98]"
          aria-label="Send"
        >
          <Send size={16} strokeWidth={1.8} />
        </button>
      </div>
    </form>
  );
}
