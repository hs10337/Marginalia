import type { Person, Note, Suggestion } from '../data/types';

type Reply = {
  text: string;
  bullets?: string[];
  followUpChip?: { label: string; suggestion: Omit<Suggestion, 'id'> };
  sideEffect?:
    | { kind: 'addNote'; personId: string; text: string }
    | { kind: 'addSuggestion'; suggestion: Omit<Suggestion, 'id'> };
};

function findPersonInText(text: string, people: Person[]): Person | undefined {
  const lower = text.toLowerCase();
  let best: { p: Person; idx: number } | undefined;
  for (const p of people) {
    const candidates = [p.name.toLowerCase(), p.name.split(/\s+/)[0].toLowerCase()];
    for (const cand of candidates) {
      const idx = lower.indexOf(cand);
      if (idx >= 0 && (!best || cand.length > best.p.name.split(/\s+/)[0].length)) {
        best = { p, idx };
      }
    }
  }
  return best?.p;
}

function stripPersonFromCapture(text: string, person: Person): string {
  const first = person.name.split(/\s+/)[0];
  let s = text;
  s = s.replace(new RegExp(`^add(\\s+that)?\\s+`, 'i'), '');
  s = s.replace(new RegExp(`\\b${first}\\s+is\\s+`, 'i'), 'is ');
  s = s.replace(new RegExp(`\\b${first}\\b`, 'i'), '').trim();
  s = s.replace(/^\s*(that|is|was|has|had)\s+/i, '');
  s = s.replace(/\s{2,}/g, ' ').trim();
  if (!s) s = text.replace(/^add(\s+that)?\s+/i, '').trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function buildReply(
  input: string,
  ctx: { people: Person[]; notes: Note[]; scopedPersonId?: string },
): Reply {
  const text = input.trim();
  const lower = text.toLowerCase();

  // 1. Capture: "add ..." / "note that ..." / "save ..."
  if (/^(add|note|save|remember)\b/i.test(lower)) {
    const person =
      (ctx.scopedPersonId
        ? ctx.people.find((p) => p.id === ctx.scopedPersonId)
        : undefined) ?? findPersonInText(text, ctx.people);
    if (!person) {
      return {
        text:
          'Got it — but I couldn’t tell who this is about. Try “add that Daniel is interviewing at Airbnb.”',
      };
    }
    const noteText = stripPersonFromCapture(text, person);
    return {
      text: `Saved to ${person.name.split(' ')[0]}. Added: “${noteText}”.`,
      followUpChip: {
        label: 'Follow up in two weeks?',
        suggestion: {
          kind: 'reminder',
          personId: person.id,
          text: `Follow up with ${person.name.split(' ')[0]} about “${noteText.toLowerCase()}”.`,
        },
      },
      sideEffect: { kind: 'addNote', personId: person.id, text: noteText },
    };
  }

  // 2. Retrieval: "what do I know about ..."
  if (/^(what (do i|do you) know|tell me|remind me about)/i.test(lower)) {
    const person = findPersonInText(text, ctx.people);
    if (!person) {
      return { text: 'Who do you want me to look up?' };
    }
    const personNotes = ctx.notes
      .filter((n) => n.personId === person.id)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .slice(0, 5)
      .map((n) => n.text);
    const bullets = [...person.worthRemembering.slice(0, 3), ...personNotes];
    return {
      text: `Here’s what I have on ${person.name.split(' ')[0]}:`,
      bullets: Array.from(new Set(bullets)).slice(0, 6),
    };
  }

  // 3. Reminder: "remind me to ..."
  if (/^remind me to /i.test(lower)) {
    const person = findPersonInText(text, ctx.people);
    const what = text.replace(/^remind me to /i, '');
    return {
      text: person
        ? `Reminder set: ${what} (linked to ${person.name.split(' ')[0]}).`
        : `Reminder set: ${what}.`,
      sideEffect: {
        kind: 'addSuggestion',
        suggestion: {
          kind: 'reminder',
          personId: person?.id,
          text: what.charAt(0).toUpperCase() + what.slice(1),
        },
      },
    };
  }

  // 4. Stale people: "who haven't I checked in with recently"
  if (/who.*(haven'?t|have not).*(checked in|seen|talked|spoken)/i.test(lower)) {
    const stale = [...ctx.people]
      .sort((a, b) => (a.lastUpdated < b.lastUpdated ? -1 : 1))
      .slice(0, 4);
    return {
      text: 'A few people you haven’t mentioned in a while:',
      bullets: stale.map(
        (p) =>
          `${p.name}${p.lastSeen ? ` — last seen ${p.lastSeen.toLowerCase()}` : ''}`,
      ),
    };
  }

  // 5. Fallback retrieval if a name appears alone
  const personOnly = findPersonInText(text, ctx.people);
  if (personOnly && text.length < 30) {
    const personNotes = ctx.notes
      .filter((n) => n.personId === personOnly.id)
      .slice(0, 4)
      .map((n) => n.text);
    return {
      text: `${personOnly.name.split(' ')[0]}:`,
      bullets: [...personOnly.worthRemembering.slice(0, 3), ...personNotes].slice(0, 5),
    };
  }

  return {
    text:
      'I can capture notes, look people up, set reminders, or surface people you haven’t seen. Try “add that Mina’s daughter started kindergarten” or “what do I know about Rachel?”',
  };
}
