import type { Person, Note, Suggestion, Meeting, BriefCard } from './types';

const today = new Date();
const iso = (daysAgo: number, hour = 9, minute = 0) => {
  const d = new Date(today);
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};
const isoTodayAt = (hour: number, minute: number) => {
  const d = new Date(today);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

export const seedPeople: Person[] = [
  {
    id: 'rachel',
    name: 'Rachel Levin',
    relationship: 'Friend, since college',
    avatarColor: '#A14F2F',
    importantPerson: true,
    worthRemembering: [
      'Just returned from Seoul (two weeks, mostly food)',
      'Her mom had surgery in March — recovery has been slow',
      'Prefers quiet cafés, not crowded ones',
    ],
    openThreads: ['Ask how her mom is recovering', 'She wanted a book recommendation'],
    lastUpdated: iso(2),
    lastSeen: 'Three weeks ago',
  },
  {
    id: 'mina',
    name: 'Mina Park',
    relationship: 'Friend, parent',
    avatarColor: '#2E4A6B',
    importantPerson: true,
    worthRemembering: [
      'Daughter Sofia just started kindergarten',
      'Was anxious about the transition',
      'Mentioned wanting to restart Pilates',
    ],
    openThreads: ['Check in on how Sofia is settling', 'Pilates studio rec?'],
    lastUpdated: iso(5),
    lastSeen: 'Last month',
  },
  {
    id: 'daniel',
    name: 'Daniel Okafor',
    relationship: 'Former coworker',
    avatarColor: '#3F6B4E',
    worthRemembering: [
      'Left Stripe in January — taking time off',
      'Plays bass in a jazz trio on Thursdays',
    ],
    openThreads: [],
    lastUpdated: iso(11),
    lastSeen: 'Two months ago',
  },
  {
    id: 'priya',
    name: 'Priya Iyer',
    relationship: 'Mentor',
    avatarColor: '#6B4E2E',
    importantPerson: true,
    worthRemembering: [
      'Joined the board at a climate nonprofit',
      'Daughter applying to college this fall',
      'Loves long walks — not coffee meetings',
    ],
    openThreads: ['Send the essay draft she offered to read'],
    lastUpdated: iso(18),
    lastSeen: 'Six weeks ago',
  },
  {
    id: 'theo',
    name: 'Theo Marchetti',
    relationship: 'Neighbor',
    avatarColor: '#5C544A',
    worthRemembering: [
      'Just adopted a rescue dog (Pico, terrier mix)',
      'Renovating the kitchen — finishes in May',
    ],
    openThreads: ['Borrow his pasta maker'],
    lastUpdated: iso(34),
    lastSeen: 'Two weeks ago',
  },
  {
    id: 'iris',
    name: 'Iris Bellweather',
    relationship: 'Sister',
    avatarColor: '#7A3B5E',
    importantPerson: true,
    worthRemembering: [
      'Moved to Lisbon in February',
      'Birthday is May 14',
      'Trying to drink less coffee — switched to matcha',
    ],
    openThreads: ['Plan a visit before summer', 'Send the photos from Mom’s birthday'],
    lastUpdated: iso(7),
    lastSeen: 'Three months ago',
  },
];

export const seedNotes: Note[] = [
  { id: 'n1', personId: 'rachel', text: 'Back from Seoul — went with Min-ji.', createdAt: iso(2, 18, 12), source: 'seed' },
  { id: 'n2', personId: 'rachel', text: 'Mom’s surgery was a success but recovery has been slow.', createdAt: iso(20, 9, 30), source: 'seed' },
  { id: 'n3', personId: 'rachel', text: 'Hates loud cafés. Prefers Caffe Reggio over Blue Bottle.', createdAt: iso(40, 14, 0), source: 'seed' },
  { id: 'n4', personId: 'mina', text: 'Sofia started kindergarten this week. Mina very anxious.', createdAt: iso(5, 21, 0), source: 'seed' },
  { id: 'n5', personId: 'mina', text: 'Wants to restart Pilates — looking for a quiet studio.', createdAt: iso(8, 8, 0), source: 'seed' },
  { id: 'n6', personId: 'daniel', text: 'Left Stripe in January. Taking the spring off, traveling.', createdAt: iso(11, 16, 30), source: 'seed' },
  { id: 'n7', personId: 'daniel', text: 'Plays bass in a jazz trio Thursdays at the Vanguard.', createdAt: iso(60, 22, 15), source: 'seed' },
  { id: 'n8', personId: 'priya', text: 'On the board of Carbon180. Excited but stretched thin.', createdAt: iso(18, 11, 0), source: 'seed' },
  { id: 'n9', personId: 'priya', text: 'Offered to read my essay draft — owe her a copy.', createdAt: iso(22, 9, 45), source: 'seed' },
  { id: 'n10', personId: 'theo', text: 'Adopted Pico, a terrier mix, from the shelter on Mott.', createdAt: iso(34, 12, 0), source: 'seed' },
  { id: 'n11', personId: 'theo', text: 'Kitchen reno finishes in May. Showed me the marble samples.', createdAt: iso(45, 19, 30), source: 'seed' },
  { id: 'n12', personId: 'iris', text: 'Lisbon move went smoothly. Loving the light, hating the bureaucracy.', createdAt: iso(7, 10, 0), source: 'seed' },
  { id: 'n13', personId: 'iris', text: 'Switched from coffee to matcha. Has opinions about ceremonial grade.', createdAt: iso(14, 8, 30), source: 'seed' },
  { id: 'n14', personId: 'iris', text: 'Birthday May 14 — wants something handwritten, not a gift.', createdAt: iso(30, 21, 0), source: 'seed' },
  { id: 'n15', personId: 'mina', text: 'Sofia’s teacher is Ms. Alvarez. Sofia likes her.', createdAt: iso(3, 20, 0), source: 'seed' },
];

export const seedSuggestions: Suggestion[] = [
  {
    id: 's1',
    kind: 'disambiguate',
    text: 'You mentioned “her daughter” — is this Mina’s daughter Sofia?',
    personId: 'mina',
  },
  {
    id: 's2',
    kind: 'milestone',
    text: 'Iris moving to Lisbon sounds like a major life event. Save as milestone?',
    personId: 'iris',
  },
  {
    id: 's3',
    kind: 'reminder',
    text: 'Want a reminder to send Priya your essay draft this week?',
    personId: 'priya',
  },
];

export const seedMeetings: Meeting[] = [
  {
    id: 'm1',
    personId: 'rachel',
    title: 'Coffee with Rachel',
    when: isoTodayAt(16, 30),
    location: 'Caffe Reggio, MacDougal',
  },
  {
    id: 'm2',
    personId: 'mina',
    title: 'Dinner with Mina',
    when: isoTodayAt(18, 30),
    location: 'Her place',
  },
];

export const seedBriefs: BriefCard[] = [
  {
    meetingId: 'm1',
    worthRemembering: [
      'Just returned from Seoul — went with Min-ji',
      'Her mom had surgery in March; recovery slow',
      'Prefers quiet cafés (Caffe Reggio is a yes)',
    ],
    goodQuestions: [
      'How is your mom doing?',
      'What did you eat in Seoul that you keep thinking about?',
      'Did you find that book you were looking for?',
    ],
  },
  {
    meetingId: 'm2',
    worthRemembering: [
      'Sofia started kindergarten recently',
      'Mina was feeling anxious about the transition',
      'She mentioned wanting to restart Pilates',
    ],
    goodQuestions: [
      'How is Sofia settling into school?',
      'Did you end up finding a Pilates studio?',
      'How is Ms. Alvarez working out as a teacher?',
    ],
  },
];
