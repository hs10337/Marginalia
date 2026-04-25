import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../context/MockDataContext';
import NavHeader from '../components/NavHeader';
import PersonAvatar from '../components/PersonAvatar';
import NoteBubble from '../components/NoteBubble';
import EmptyState from '../components/EmptyState';
import { MessageCircle, BookOpen } from 'lucide-react';

export default function PersonScreen() {
  const { id } = useParams<{ id: string }>();
  const { personById, notesFor } = useStore();
  const nav = useNavigate();
  const person = id ? personById(id) : undefined;

  if (!person) {
    return (
      <div>
        <NavHeader title="Not found" back />
        <EmptyState title="No such person" />
      </div>
    );
  }

  const notes = notesFor(person.id);

  return (
    <div>
      <NavHeader
        title={person.name}
        eyebrow={person.relationship}
        back
        right={
          <button
            onClick={() => nav(`/chat?person=${person.id}`)}
            className="inline-flex items-center gap-1 rounded-full border border-cream-300 bg-cream-50 text-ink-900 px-3 py-1 text-xs font-medium active:scale-[0.98]"
          >
            <MessageCircle size={13} strokeWidth={1.8} />
            Note
          </button>
        }
      />

      <div className="px-5 -mt-2 mb-4 flex items-center gap-3">
        <PersonAvatar person={person} size={56} />
        <div className="text-[12.5px] text-ink-500">
          {person.lastSeen ? `Last seen · ${person.lastSeen}` : 'Not seen recently'}
        </div>
      </div>

      <div className="px-5 ink-rule mb-5" />

      <section className="px-5 mb-6">
        <h2 className="font-serif text-[16px] text-ink-700 mb-2">Worth remembering</h2>
        {person.worthRemembering.length === 0 ? (
          <p className="text-[14px] text-ink-300 italic font-serif">Nothing yet.</p>
        ) : (
          <ul className="space-y-2">
            {person.worthRemembering.map((b, i) => (
              <li
                key={i}
                className="rounded-xl bg-cream-100/70 border hairline px-3 py-2 text-[15px] leading-snug text-ink-900"
              >
                {b}
              </li>
            ))}
          </ul>
        )}
      </section>

      {person.openThreads.length > 0 && (
        <section className="px-5 mb-6">
          <h2 className="font-serif text-[16px] text-ink-700 mb-2">Open threads</h2>
          <ul className="space-y-2">
            {person.openThreads.map((t, i) => (
              <li
                key={i}
                className="rounded-xl border border-accent/25 bg-accent/5 px-3 py-2 text-[14.5px] text-accent"
              >
                {t}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="px-5 mb-10">
        <h2 className="font-serif text-[16px] text-ink-700 mb-2">Recent notes</h2>
        {notes.length === 0 ? (
          <EmptyState
            icon={<BookOpen size={22} />}
            title="No notes yet"
            subtitle={`Capture something about ${person.name.split(' ')[0]} in Chat — it’ll show up here.`}
          />
        ) : (
          <div className="space-y-2">
            {notes.map((n) => (
              <NoteBubble key={n.id} note={n} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
