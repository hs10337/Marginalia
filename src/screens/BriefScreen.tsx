import { useState } from 'react';
import { useStore } from '../context/MockDataContext';
import NavHeader from '../components/NavHeader';
import BriefCard from '../components/BriefCard';
import PersonAvatar from '../components/PersonAvatar';
import { formatTime, todayLongDate } from '../lib/time';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function BriefScreen() {
  const { meetings, personById, briefForMeeting } = useStore();
  const ordered = [...meetings].sort((a, b) => (a.when < b.when ? -1 : 1));
  const [openId, setOpenId] = useState<string | null>(ordered[0]?.id ?? null);

  return (
    <div>
      <NavHeader eyebrow={todayLongDate()} title="Today" />

      <div className="px-5 space-y-3">
        {ordered.map((m) => {
          const person = personById(m.personId);
          const brief = briefForMeeting(m.id);
          if (!person) return null;
          const open = openId === m.id;
          return (
            <div key={m.id}>
              <button
                onClick={() => setOpenId(open ? null : m.id)}
                className="w-full text-left rounded-2xl bg-cream-50/80 border hairline shadow-paper px-4 py-3 active:scale-[0.995] transition"
              >
                <div className="flex items-center gap-3">
                  <PersonAvatar person={person} size={36} />
                  <div className="flex-1">
                    <p className="font-serif text-[17px] text-ink-900 leading-tight">
                      {m.title}
                    </p>
                    <p className="text-[12.5px] text-ink-500">
                      {formatTime(m.when)}
                      {m.location ? ` · ${m.location}` : ''}
                      {m.done ? ' · done' : ''}
                    </p>
                  </div>
                  {open ? (
                    <ChevronUp size={18} className="text-ink-300" />
                  ) : (
                    <ChevronDown size={18} className="text-ink-300" />
                  )}
                </div>
              </button>

              {open && brief && (
                <div className="mt-3">
                  <BriefCard meeting={m} person={person} brief={brief} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="px-5 mt-8">
        <p className="text-[11px] uppercase tracking-[0.18em] text-ink-300 font-medium mb-2">
          Later this week
        </p>
        <div className="rounded-2xl bg-cream-50/60 border hairline px-4 py-4 text-[13.5px] text-ink-500 italic font-serif">
          Nothing on the calendar. A good week to send someone a note out of the
          blue.
        </div>
      </div>
    </div>
  );
}
