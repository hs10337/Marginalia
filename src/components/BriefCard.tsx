import { ArrowRight, BellPlus, Send, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { BriefCard as BriefCardData, Meeting, Person } from '../data/types';
import PersonAvatar from './PersonAvatar';
import { formatTime } from '../lib/time';
import { useStore } from '../context/MockDataContext';

type Props = {
  meeting: Meeting;
  person: Person;
  brief: BriefCardData;
};

export default function BriefCard({ meeting, person, brief }: Props) {
  const nav = useNavigate();
  const { addSuggestion, markMeetingDone } = useStore();

  return (
    <div className="rounded-3xl bg-cream-50 border hairline shadow-paper overflow-hidden">
      <div className="p-5">
        <div className="flex items-start gap-3">
          <PersonAvatar person={person} size={44} />
          <div className="flex-1">
            <p className="text-[11px] uppercase tracking-[0.18em] text-ink-300 font-medium">
              Before you meet
            </p>
            <h2 className="font-serif text-[24px] leading-tight text-ink-900 mt-0.5">
              {meeting.title}
            </h2>
            <p className="text-[13px] text-ink-500 mt-0.5">
              {formatTime(meeting.when)}
              {meeting.location ? ` · ${meeting.location}` : ''}
            </p>
          </div>
        </div>

        <div className="ink-rule my-5" />

        <section>
          <h3 className="font-serif text-[15px] text-ink-700">Worth remembering</h3>
          <ul className="mt-2 space-y-2">
            {brief.worthRemembering.map((b, i) => (
              <li key={i} className="flex gap-2 text-[15px] leading-snug text-ink-900">
                <span className="mt-2 h-1 w-1 rounded-full bg-ink-300 shrink-0" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-5">
          <h3 className="font-serif text-[15px] text-ink-700">Good questions</h3>
          <ul className="mt-2 space-y-2">
            {brief.goodQuestions.map((q, i) => (
              <li
                key={i}
                className="rounded-xl bg-cream-100/80 border hairline px-3 py-2 text-[14px] text-ink-900 italic font-serif"
              >
                “{q}”
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-6">
          <h3 className="font-serif text-[15px] text-ink-700 mb-2">Possible actions</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                addSuggestion({
                  kind: 'reminder',
                  text: `Follow up with ${person.name.split(' ')[0]} after ${meeting.title.toLowerCase()}.`,
                  personId: person.id,
                });
                markMeetingDone(meeting.id);
                nav('/inbox');
              }}
              className="inline-flex items-center gap-1.5 rounded-full bg-ink-900 text-cream-50 px-3 py-1.5 text-xs font-medium active:scale-[0.98]"
            >
              <BellPlus size={14} strokeWidth={1.8} />
              Add reminder for after
            </button>
            <button
              onClick={() => nav(`/chat?person=${person.id}`)}
              className="inline-flex items-center gap-1.5 rounded-full border border-cream-300 bg-cream-50 text-ink-900 px-3 py-1.5 text-xs font-medium active:scale-[0.98]"
            >
              <Send size={14} strokeWidth={1.8} />
              Send a note now
            </button>
            <button
              onClick={() => nav(`/people/${person.id}`)}
              className="inline-flex items-center gap-1.5 rounded-full border border-cream-300 bg-cream-50 text-ink-900 px-3 py-1.5 text-xs font-medium active:scale-[0.98]"
            >
              <BookOpen size={14} strokeWidth={1.8} />
              Open {person.name.split(' ')[0]}’s page
              <ArrowRight size={12} strokeWidth={1.8} />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
