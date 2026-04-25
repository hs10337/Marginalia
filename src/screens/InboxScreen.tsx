import { useStore } from '../context/MockDataContext';
import NavHeader from '../components/NavHeader';
import SuggestionRow from '../components/SuggestionRow';
import NoteBubble from '../components/NoteBubble';
import EmptyState from '../components/EmptyState';
import { Inbox } from 'lucide-react';

export default function InboxScreen() {
  const { suggestions, notes, personById } = useStore();
  const recentCaptures = notes
    .filter((n) => n.source !== 'seed')
    .slice(0, 6);

  return (
    <div>
      <NavHeader eyebrow="Loose ends, gently surfaced" title="Inbox" />

      <section className="px-5 mb-6">
        <h2 className="text-[11px] uppercase tracking-[0.18em] text-ink-300 font-medium mb-2">
          Suggestions
        </h2>
        {suggestions.length === 0 ? (
          <p className="text-[14px] text-ink-300 italic font-serif">
            All caught up.
          </p>
        ) : (
          <div className="space-y-2">
            {suggestions.map((s) => (
              <SuggestionRow key={s.id} s={s} />
            ))}
          </div>
        )}
      </section>

      <section className="px-5 mb-10">
        <h2 className="text-[11px] uppercase tracking-[0.18em] text-ink-300 font-medium mb-2">
          Recent captures
        </h2>
        {recentCaptures.length === 0 ? (
          <EmptyState
            icon={<Inbox size={22} />}
            title="Nothing captured yet"
            subtitle="Anything you add in Chat will appear here, attached to the right person."
          />
        ) : (
          <div className="space-y-2">
            {recentCaptures.map((n) => (
              <NoteBubble
                key={n.id}
                note={n}
                person={personById(n.personId)}
                showPerson
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
