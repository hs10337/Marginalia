export type PersonId = string;

export type Person = {
  id: PersonId;
  name: string;
  relationship?: string;
  avatarColor: string;
  importantPerson?: boolean;
  worthRemembering: string[];
  openThreads: string[];
  lastUpdated: string;
  lastSeen?: string;
};

export type Note = {
  id: string;
  personId: PersonId;
  text: string;
  createdAt: string;
  source: 'chat' | 'inbox' | 'seed';
};

export type Suggestion = {
  id: string;
  kind: 'disambiguate' | 'reminder' | 'milestone' | 'followup';
  text: string;
  personId?: PersonId;
};

export type Meeting = {
  id: string;
  personId: PersonId;
  title: string;
  when: string;
  location?: string;
  done?: boolean;
};

export type BriefCard = {
  meetingId: string;
  worthRemembering: string[];
  goodQuestions: string[];
};

export type ChatMessage =
  | { id: string; role: 'user'; text: string; at: string }
  | {
      id: string;
      role: 'assistant';
      text: string;
      at: string;
      bullets?: string[];
      followUpChip?: { label: string; suggestion: Omit<Suggestion, 'id'> };
    };
