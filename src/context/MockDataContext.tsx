import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type {
  ChatMessage,
  Meeting,
  Note,
  Person,
  PersonId,
  Suggestion,
  BriefCard,
} from '../data/types';
import {
  seedBriefs,
  seedMeetings,
  seedNotes,
  seedPeople,
  seedSuggestions,
} from '../data/seed';

let idCounter = 1000;
const nextId = (prefix: string) => `${prefix}-${++idCounter}`;

type Ctx = {
  people: Person[];
  notes: Note[];
  suggestions: Suggestion[];
  meetings: Meeting[];
  briefs: BriefCard[];
  messages: ChatMessage[];
  // lookups
  personById: (id: PersonId) => Person | undefined;
  notesFor: (id: PersonId) => Note[];
  briefForMeeting: (meetingId: string) => BriefCard | undefined;
  // actions
  addNote: (personId: PersonId, text: string, source?: Note['source']) => Note;
  addSuggestion: (s: Omit<Suggestion, 'id'>) => Suggestion;
  resolveSuggestion: (id: string) => void;
  dismissSuggestion: (id: string) => void;
  markMeetingDone: (id: string) => void;
  pushUserMessage: (text: string) => ChatMessage;
  pushAssistantMessage: (
    msg: Omit<Extract<ChatMessage, { role: 'assistant' }>, 'id' | 'role' | 'at'>,
  ) => ChatMessage;
};

const MockDataContext = createContext<Ctx | null>(null);

export function MockDataProvider({ children }: { children: ReactNode }) {
  const [people, setPeople] = useState<Person[]>(seedPeople);
  const [notes, setNotes] = useState<Note[]>(seedNotes);
  const [suggestions, setSuggestions] = useState<Suggestion[]>(seedSuggestions);
  const [meetings, setMeetings] = useState<Meeting[]>(seedMeetings);
  const [briefs] = useState<BriefCard[]>(seedBriefs);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const personById = useCallback(
    (id: PersonId) => people.find((p) => p.id === id),
    [people],
  );

  const notesFor = useCallback(
    (id: PersonId) =>
      notes
        .filter((n) => n.personId === id)
        .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
    [notes],
  );

  const briefForMeeting = useCallback(
    (meetingId: string) => briefs.find((b) => b.meetingId === meetingId),
    [briefs],
  );

  const addNote = useCallback<Ctx['addNote']>((personId, text, source = 'chat') => {
    const note: Note = {
      id: nextId('n'),
      personId,
      text,
      createdAt: new Date().toISOString(),
      source,
    };
    setNotes((prev) => [note, ...prev]);
    setPeople((prev) =>
      prev.map((p) => (p.id === personId ? { ...p, lastUpdated: note.createdAt } : p)),
    );
    return note;
  }, []);

  const addSuggestion = useCallback<Ctx['addSuggestion']>((s) => {
    const sug: Suggestion = { ...s, id: nextId('s') };
    setSuggestions((prev) => [sug, ...prev]);
    return sug;
  }, []);

  const resolveSuggestion = useCallback((id: string) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const dismissSuggestion = useCallback((id: string) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const markMeetingDone = useCallback(
    (id: string) => {
      setMeetings((prev) =>
        prev.map((m) => (m.id === id ? { ...m, done: true } : m)),
      );
      const meeting = meetings.find((m) => m.id === id);
      if (meeting) {
        const person = people.find((p) => p.id === meeting.personId);
        if (person) {
          const sug: Suggestion = {
            id: nextId('s'),
            kind: 'followup',
            text: `Add anything new from your ${meeting.title.toLowerCase()}?`,
            personId: person.id,
          };
          setSuggestions((prev) => [sug, ...prev]);
        }
      }
    },
    [meetings, people],
  );

  const pushUserMessage = useCallback<Ctx['pushUserMessage']>((text) => {
    const msg: ChatMessage = {
      id: nextId('m'),
      role: 'user',
      text,
      at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, msg]);
    return msg;
  }, []);

  const pushAssistantMessage = useCallback<Ctx['pushAssistantMessage']>((msg) => {
    const full: ChatMessage = {
      id: nextId('m'),
      role: 'assistant',
      at: new Date().toISOString(),
      ...msg,
    };
    setMessages((prev) => [...prev, full]);
    return full;
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      people,
      notes,
      suggestions,
      meetings,
      briefs,
      messages,
      personById,
      notesFor,
      briefForMeeting,
      addNote,
      addSuggestion,
      resolveSuggestion,
      dismissSuggestion,
      markMeetingDone,
      pushUserMessage,
      pushAssistantMessage,
    }),
    [
      people,
      notes,
      suggestions,
      meetings,
      briefs,
      messages,
      personById,
      notesFor,
      briefForMeeting,
      addNote,
      addSuggestion,
      resolveSuggestion,
      dismissSuggestion,
      markMeetingDone,
      pushUserMessage,
      pushAssistantMessage,
    ],
  );

  return <MockDataContext.Provider value={value}>{children}</MockDataContext.Provider>;
}

export function useStore(): Ctx {
  const ctx = useContext(MockDataContext);
  if (!ctx) throw new Error('useStore must be used within MockDataProvider');
  return ctx;
}
