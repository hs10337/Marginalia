import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import NavHeader from '../components/NavHeader';
import ChatComposer from '../components/ChatComposer';
import Chip from '../components/Chip';
import { useStore } from '../context/MockDataContext';
import { buildReply } from '../lib/assistant';
import { formatTime } from '../lib/time';
import type { ChatMessage } from '../data/types';

const STARTERS = [
  'Add that Daniel is interviewing at Airbnb',
  'What do I know about Rachel?',
  'Remind me to ask Mina about Sofia',
  'Who haven’t I checked in with recently?',
];

export default function ChatScreen() {
  const {
    messages,
    pushUserMessage,
    pushAssistantMessage,
    addNote,
    addSuggestion,
    people,
    notes,
    personById,
  } = useStore();

  const [params] = useSearchParams();
  const scopedPersonId = params.get('person') ?? undefined;
  const scopedPerson = scopedPersonId ? personById(scopedPersonId) : undefined;

  const scrollerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: 999_999, behavior: 'smooth' });
  }, [messages.length]);

  const intro: ChatMessage[] = useMemo(
    () => [
      {
        id: 'intro',
        role: 'assistant',
        text:
          scopedPerson
            ? `Anything new from ${scopedPerson.name.split(' ')[0]}? You can just type it.`
            : 'A quiet place to add notes or ask about the people in your life.',
        at: new Date().toISOString(),
      },
    ],
    [scopedPerson],
  );

  const submit = (text: string) => {
    pushUserMessage(text);
    const reply = buildReply(text, { people, notes, scopedPersonId });

    if (reply.sideEffect?.kind === 'addNote') {
      addNote(reply.sideEffect.personId, reply.sideEffect.text, 'chat');
    }
    if (reply.sideEffect?.kind === 'addSuggestion') {
      addSuggestion(reply.sideEffect.suggestion);
    }

    pushAssistantMessage({
      text: reply.text,
      bullets: reply.bullets,
      followUpChip: reply.followUpChip,
    });
  };

  const all: ChatMessage[] = [...intro, ...messages];

  return (
    <div className="flex flex-col h-full">
      <NavHeader
        eyebrow={scopedPerson ? `Note for ${scopedPerson.name}` : 'Add or ask'}
        title="Chat"
      />

      <div ref={scrollerRef} className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
        {all.map((m) => (
          <Bubble key={m.id} m={m} onChip={(s) => addSuggestion(s)} />
        ))}

        {messages.length === 0 && (
          <div className="pt-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-ink-300 font-medium mb-2 px-1">
              Try
            </p>
            <div className="flex flex-wrap gap-2">
              {STARTERS.map((s) => (
                <Chip key={s} onClick={() => submit(s)}>
                  {s}
                </Chip>
              ))}
            </div>
          </div>
        )}
      </div>

      <ChatComposer
        onSubmit={submit}
        scopedHint={scopedPerson ? `Scoped to ${scopedPerson.name}` : undefined}
      />
    </div>
  );
}

function Bubble({
  m,
  onChip,
}: {
  m: ChatMessage;
  onChip: (s: Parameters<ReturnType<typeof useStore>['addSuggestion']>[0]) => void;
}) {
  if (m.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[78%] rounded-2xl rounded-br-md bg-ink-900 text-cream-50 px-3.5 py-2 shadow-paper">
          <p className="text-[15px] leading-snug whitespace-pre-wrap">{m.text}</p>
          <p className="text-[10.5px] text-cream-50/60 text-right mt-1">
            {formatTime(m.at)}
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-cream-50/85 border hairline px-3.5 py-2.5 shadow-paper">
        <p className="text-[15px] leading-snug text-ink-900 whitespace-pre-wrap">
          {m.text}
        </p>
        {m.bullets && m.bullets.length > 0 && (
          <ul className="mt-2 space-y-1.5">
            {m.bullets.map((b, i) => (
              <li
                key={i}
                className="flex gap-2 text-[14.5px] leading-snug text-ink-900"
              >
                <span className="mt-2 h-1 w-1 rounded-full bg-ink-300 shrink-0" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}
        {m.followUpChip && (
          <div className="mt-2.5">
            <Chip
              tone="accent"
              onClick={() => {
                onChip(m.followUpChip!.suggestion);
              }}
            >
              {m.followUpChip.label}
            </Chip>
          </div>
        )}
      </div>
    </div>
  );
}
