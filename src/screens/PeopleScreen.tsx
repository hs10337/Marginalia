import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/MockDataContext';
import NavHeader from '../components/NavHeader';
import PersonAvatar from '../components/PersonAvatar';
import { formatRelative } from '../lib/time';
import type { Person } from '../data/types';

function Section({ title, people }: { title: string; people: Person[] }) {
  if (people.length === 0) return null;
  return (
    <section className="mb-6">
      <h2 className="px-5 text-[11px] uppercase tracking-[0.18em] text-ink-300 font-medium mb-2">
        {title}
      </h2>
      <ul className="px-5 space-y-2">
        {people.map((p) => (
          <li key={p.id}>
            <Link
              to={`/people/${p.id}`}
              className="flex items-center gap-3 rounded-2xl bg-cream-50/80 border hairline px-3 py-2.5 shadow-paper active:scale-[0.99] transition"
            >
              <PersonAvatar person={p} size={40} />
              <div className="flex-1 min-w-0">
                <p className="font-serif text-[16.5px] text-ink-900 leading-tight truncate">
                  {p.name}
                </p>
                <p className="text-[12px] text-ink-500 truncate">
                  {p.relationship ?? '—'}
                </p>
              </div>
              <span className="text-[11px] text-ink-300 shrink-0">
                {formatRelative(p.lastUpdated)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function PeopleScreen() {
  const { people, meetings, suggestions } = useStore();

  const sections = useMemo(() => {
    const byRecent = [...people].sort((a, b) =>
      a.lastUpdated < b.lastUpdated ? 1 : -1,
    );
    const recentlyUpdated = byRecent.slice(0, 3);
    const meetingPersonIds = new Set(meetings.filter((m) => !m.done).map((m) => m.personId));
    const upcoming = people.filter((p) => meetingPersonIds.has(p.id));
    const followupIds = new Set(
      suggestions.filter((s) => s.kind === 'followup' || s.kind === 'reminder').map((s) => s.personId).filter(Boolean) as string[],
    );
    const needsFollowup = people.filter(
      (p) => p.openThreads.length > 0 || followupIds.has(p.id),
    );
    const important = people.filter((p) => p.importantPerson);
    const all = [...people].sort((a, b) => a.name.localeCompare(b.name));
    return { recentlyUpdated, upcoming, needsFollowup, important, all };
  }, [people, meetings, suggestions]);

  return (
    <div>
      <NavHeader eyebrow="The people you know" title="People" />
      <Section title="Recently updated" people={sections.recentlyUpdated} />
      <Section title="Upcoming interactions" people={sections.upcoming} />
      <Section title="Needs follow-up" people={sections.needsFollowup} />
      <Section title="Important people" people={sections.important} />
      <Section title="Everyone" people={sections.all} />
    </div>
  );
}
