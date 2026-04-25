import type { Person } from '../data/types';

type Props = { person: Person; size?: number };

export default function PersonAvatar({ person, size = 36 }: Props) {
  const initials = person.name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <span
      className="inline-flex items-center justify-center rounded-full font-serif text-cream-50 ring-1 ring-black/10"
      style={{
        width: size,
        height: size,
        backgroundColor: person.avatarColor,
        fontSize: Math.round(size * 0.42),
        letterSpacing: '0.02em',
      }}
      aria-label={person.name}
    >
      {initials}
    </span>
  );
}
