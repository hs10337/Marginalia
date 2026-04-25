import type { Note, Person } from '../data/types';
import { formatRelative } from '../lib/time';

type Props = { note: Note; person?: Person; showPerson?: boolean };

export default function NoteBubble({ note, person, showPerson }: Props) {
  return (
    <div className="rounded-2xl bg-cream-50/80 border hairline px-4 py-3 shadow-paper">
      {showPerson && person && (
        <p className="font-serif text-[13px] text-ink-700 mb-0.5">
          {person.name}
        </p>
      )}
      <p className="text-[15px] leading-snug text-ink-900">{note.text}</p>
      <p className="mt-1.5 text-[11px] text-ink-300 tracking-wide">
        {formatRelative(note.createdAt)}
      </p>
    </div>
  );
}
