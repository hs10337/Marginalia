import { Check, X, Sparkles, BellRing, Star, Plus } from 'lucide-react';
import type { Suggestion } from '../data/types';
import { useStore } from '../context/MockDataContext';
import { useNavigate } from 'react-router-dom';

const kindIcon = {
  disambiguate: Sparkles,
  reminder: BellRing,
  milestone: Star,
  followup: Plus,
} as const;

export default function SuggestionRow({ s }: { s: Suggestion }) {
  const { resolveSuggestion, dismissSuggestion, personById, addNote } = useStore();
  const Icon = kindIcon[s.kind];
  const person = s.personId ? personById(s.personId) : undefined;
  const nav = useNavigate();

  const handleAffirm = () => {
    if (s.kind === 'milestone' && s.personId) {
      addNote(s.personId, s.text.replace(/^.*?:\s*/, ''), 'inbox');
    }
    if (s.kind === 'followup' && s.personId) {
      nav(`/chat?person=${s.personId}`);
    }
    resolveSuggestion(s.id);
  };

  return (
    <div className="rounded-2xl bg-cream-50/80 border hairline px-4 py-3 shadow-paper">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-cream-200 text-ink-700">
          <Icon size={14} strokeWidth={1.8} />
        </span>
        <div className="flex-1">
          {person && (
            <p className="font-serif text-[13px] text-ink-700 mb-0.5">{person.name}</p>
          )}
          <p className="text-[15px] leading-snug text-ink-900">{s.text}</p>
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={handleAffirm}
              className="inline-flex items-center gap-1 rounded-full bg-ink-900 text-cream-50 px-3 py-1 text-xs font-medium active:scale-[0.98]"
            >
              <Check size={13} strokeWidth={2} />
              {s.kind === 'reminder' ? 'Set reminder' : s.kind === 'milestone' ? 'Save milestone' : s.kind === 'followup' ? 'Add note' : 'Yes'}
            </button>
            <button
              onClick={() => dismissSuggestion(s.id)}
              className="inline-flex items-center gap-1 rounded-full border border-cream-300 bg-cream-50 text-ink-700 px-3 py-1 text-xs font-medium active:scale-[0.98]"
            >
              <X size={13} strokeWidth={2} />
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
