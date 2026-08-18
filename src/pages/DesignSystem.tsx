import { useEffect, type ReactNode } from 'react';

/**
 * Mimir — Design System
 *
 * A single-page reference for the Mimir brand and product surface. Fully
 * self-contained; uses Mimir tokens defined in tailwind.config.ts.
 */

export default function DesignSystem() {
  useEffect(() => {
    document.title = 'Mimir — Design System';
  }, []);

  return (
    <div className="min-h-screen h-screen overflow-y-auto bg-mimir-bg text-mimir-ink font-display antialiased">
      <Header />
      <main className="mx-auto max-w-[1080px] px-6 sm:px-10 pb-32">
        <Section id="foundations" number="01" title="Foundations">
          <Foundations />
        </Section>

        <Section id="personality" number="02" title="Personality &amp; voice">
          <Personality />
          <Voice />
        </Section>

        <Section id="color" number="03" title="Color">
          <ColorSection />
        </Section>

        <Section id="typography" number="04" title="Typography">
          <TypographySection />
        </Section>

        <Section id="components" number="05" title="Components">
          <ComponentsSection />
        </Section>

        <Footer />
      </main>
    </div>
  );
}

/* ------------------------------ Header --------------------------------- */

function Header() {
  return (
    <header className="border-b border-black/10">
      <div className="mx-auto max-w-[1080px] px-6 sm:px-10 pt-12 pb-16">
        <div className="flex items-start justify-between gap-8">
          <div>
            <p className="text-[11px] tracking-[0.24em] uppercase text-mimir-ink/60 font-medium">
              Mimir · Design System · v0.1
            </p>
            <h1 className="mt-3 font-display font-medium text-[64px] sm:text-[96px] leading-[0.95] tracking-[-0.02em]">
              People are made of details.
            </h1>
            <p className="mt-6 max-w-[540px] text-[17px] leading-[1.55] text-mimir-ink/75">
              Mimir is a quiet assistant that helps you remember what matters
              about the people you know. This page is the source of truth for
              how Mimir looks, sounds, and behaves.
            </p>
          </div>
          <TableOfContents />
        </div>

        <div className="mt-14 rounded-[14px] border border-mimir-ink/15 bg-white/50 px-6 py-6">
          <p className="text-[11px] tracking-[0.24em] uppercase text-mimir-ink/60 font-medium">
            Creative north star
          </p>
          <p className="mt-3 font-display text-[22px] sm:text-[26px] leading-[1.25] tracking-[-0.01em]">
            Mimir is not about memory. Memory is the mechanism.{' '}
            <span className="text-mimir-blue">Attention is the value.</span>
          </p>
        </div>
      </div>
    </header>
  );
}

function TableOfContents() {
  const items = [
    { href: '#foundations', label: 'Foundations' },
    { href: '#personality', label: 'Personality & voice' },
    { href: '#color', label: 'Color' },
    { href: '#typography', label: 'Typography' },
    { href: '#components', label: 'Components' },
  ];
  return (
    <nav className="hidden md:block shrink-0 w-[220px] pt-2">
      <p className="text-[11px] tracking-[0.24em] uppercase text-mimir-ink/60 font-medium mb-3">
        Contents
      </p>
      <ol className="space-y-1.5">
        {items.map((it, i) => (
          <li key={it.href}>
            <a
              href={it.href}
              className="group flex items-baseline gap-3 text-[14px] text-mimir-ink/80 hover:text-mimir-blue transition"
            >
              <span className="tabular-nums text-mimir-ink/40 group-hover:text-mimir-blue/70 w-6">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span>{it.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ------------------------------ Section shell -------------------------- */

function Section({
  id,
  number,
  title,
  children,
}: {
  id: string;
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="pt-24">
      <div className="flex items-baseline gap-4 border-b border-mimir-ink/15 pb-4 mb-10">
        <span className="tabular-nums text-[13px] tracking-[0.22em] text-mimir-ink/50 font-medium">
          {number}
        </span>
        <h2
          className="font-display font-medium text-[36px] sm:text-[44px] leading-none tracking-[-0.02em]"
          dangerouslySetInnerHTML={{ __html: title }}
        />
      </div>
      <div className="space-y-14">{children}</div>
    </section>
  );
}

function Subhead({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="flex items-baseline justify-between mb-4">
      <h3 className="font-display text-[13px] tracking-[0.24em] uppercase text-mimir-ink/60 font-medium">
        {children}
      </h3>
      {hint && (
        <p className="text-[12px] text-mimir-ink/50 italic">{hint}</p>
      )}
    </div>
  );
}

/* ------------------------------ 01 Foundations ------------------------- */

function Foundations() {
  return (
    <>
      <div>
        <Subhead>What Mimir is</Subhead>
        <div className="grid sm:grid-cols-3 gap-4">
          <FoundationCard
            eyebrow="Brand idea"
            body="Mimir helps users remember the context around the people in their lives. Not a memory vault — a habit of paying attention."
          />
          <FoundationCard
            eyebrow="Brand promise"
            body="You can be more present because you don't have to hold everything in your head."
          />
          <FoundationCard
            eyebrow="Positioning"
            body="A quiet assistant that helps you remember what matters about the people you know."
          />
        </div>
      </div>

      <div>
        <Subhead>What Mimir is not</Subhead>
        <div className="flex flex-wrap gap-2">
          {[
            'Personal CRM',
            'Contact database',
            'Second brain',
            'Memory vault',
            'Productivity dashboard',
            'Digital scrapbook',
          ].map((x) => (
            <span
              key={x}
              className="inline-flex items-center gap-2 rounded-full border border-mimir-ink/15 bg-white/40 px-3 py-1 text-[13px] text-mimir-ink/70"
            >
              <span className="inline-block w-[10px] h-px bg-mimir-orange" />
              {x}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

function FoundationCard({ eyebrow, body }: { eyebrow: string; body: string }) {
  return (
    <div className="rounded-[14px] border border-mimir-ink/15 bg-white/50 p-5">
      <p className="text-[11px] tracking-[0.24em] uppercase text-mimir-blue font-medium">
        {eyebrow}
      </p>
      <p className="mt-3 font-display text-[19px] leading-[1.35] tracking-[-0.01em] text-mimir-ink">
        {body}
      </p>
    </div>
  );
}

/* ------------------------------ 02 Personality & voice ----------------- */

const tensionRows: Array<[string, string, string]> = [
  ['Nostalgic', 'Contemporary', 'Futuristic'],
  ['Sentimental', 'Warm', 'Clinical'],
  ['Cute', 'Human', 'Corporate'],
  ['Scrapbook', 'Montage', 'Dashboard'],
  ['Mystical', 'Perceptive', 'Brainy'],
  ['Loud', 'Quiet', 'Invisible'],
];

function Personality() {
  return (
    <div>
      <Subhead>Held in tension</Subhead>
      <div className="overflow-x-auto rounded-[14px] border border-mimir-ink/15 bg-white/50">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[11px] tracking-[0.24em] uppercase text-mimir-ink/50">
              <th className="px-5 py-3 font-medium w-1/3">Avoid</th>
              <th className="px-5 py-3 font-medium w-1/3 text-mimir-blue">Mimir</th>
              <th className="px-5 py-3 font-medium w-1/3">Avoid</th>
            </tr>
          </thead>
          <tbody>
            {tensionRows.map(([l, m, r], i) => (
              <tr key={m} className={i % 2 ? 'bg-mimir-ink/[0.02]' : ''}>
                <td className="px-5 py-3 text-[15px] text-mimir-ink/55 line-through decoration-mimir-ink/25">
                  {l}
                </td>
                <td className="px-5 py-3 font-display text-[19px] tracking-[-0.01em] text-mimir-ink">
                  {m}
                </td>
                <td className="px-5 py-3 text-[15px] text-mimir-ink/55 line-through decoration-mimir-ink/25">
                  {r}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const voiceGood = [
  'You remembered.',
  'Pick up where you left off.',
  'Keep the thread.',
  'Remember the context.',
  'People are more than profiles.',
  'The little things matter.',
];
const voiceBad = [
  'AI-powered memory companion',
  'Second brain for relationships',
  'Never forget anyone again',
  'Relationship CRM',
  'Optimize your relationships',
  'Remember everything',
];

function Voice() {
  return (
    <div>
      <Subhead>Voice</Subhead>
      <p className="text-[15px] leading-[1.6] text-mimir-ink/75 mb-6 max-w-[640px]">
        Mimir sounds like someone who pays attention and knows when to speak.
        Observant, understated, direct, human, helpful.
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        <VoiceColumn label="Yes" tone="yes" items={voiceGood} />
        <VoiceColumn label="No" tone="no" items={voiceBad} />
      </div>
    </div>
  );
}

function VoiceColumn({
  label,
  tone,
  items,
}: {
  label: string;
  tone: 'yes' | 'no';
  items: string[];
}) {
  const isYes = tone === 'yes';
  return (
    <div
      className={
        'rounded-[14px] border p-5 ' +
        (isYes
          ? 'border-mimir-blue/25 bg-mimir-blue/[0.04]'
          : 'border-mimir-ink/15 bg-white/50')
      }
    >
      <p
        className={
          'text-[11px] tracking-[0.24em] uppercase font-medium mb-3 ' +
          (isYes ? 'text-mimir-blue' : 'text-mimir-ink/55')
        }
      >
        {label}
      </p>
      <ul className="space-y-2.5">
        {items.map((x) => (
          <li
            key={x}
            className={
              'font-display text-[17px] leading-[1.4] tracking-[-0.005em] ' +
              (isYes
                ? 'text-mimir-ink'
                : 'text-mimir-ink/55 line-through decoration-mimir-ink/25')
            }
          >
            {x}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------ 03 Color ------------------------------- */

const swatches: Array<{
  name: string;
  hex: string;
  role: string;
  onDark?: boolean;
  border?: boolean;
}> = [
  { name: 'Background', hex: '#F7F6F2', role: 'Warm off-white. Primary surface.', border: true },
  { name: 'Ink', hex: '#181818', role: 'Text and quiet structural marks.', onDark: true },
  { name: 'Mimir Blue', hex: '#3046C5', role: 'Identity. Links, active states.', onDark: true },
  { name: 'Orange', hex: '#FF5A1F', role: 'Interruption. Use sparingly.', onDark: true },
];

function ColorSection() {
  return (
    <>
      <p className="text-[15px] leading-[1.6] text-mimir-ink/75 max-w-[640px]">
        Warmth comes from photography and people — not from a wide pastel
        palette. The system is intentionally small: one background, one ink,
        one identity color, one interruption.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {swatches.map((s) => (
          <div key={s.hex} className="rounded-[14px] overflow-hidden border border-mimir-ink/15 bg-white/40">
            <div
              className={
                'aspect-[5/4] flex items-end p-4 ' +
                (s.border ? 'border-b border-mimir-ink/10' : '')
              }
              style={{ background: s.hex }}
            >
              <span
                className={
                  'font-display text-[16px] tracking-[-0.01em] ' +
                  (s.onDark ? 'text-white/95' : 'text-mimir-ink')
                }
              >
                {s.name}
              </span>
            </div>
            <div className="p-4">
              <p className="tabular-nums text-[13px] text-mimir-ink/75">{s.hex}</p>
              <p className="mt-1 text-[13px] leading-snug text-mimir-ink/60">{s.role}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-[14px] border border-mimir-ink/15 bg-white/50 p-6">
        <p className="text-[11px] tracking-[0.24em] uppercase text-mimir-ink/55 font-medium">
          Principle
        </p>
        <p className="mt-3 font-display text-[26px] sm:text-[32px] tracking-[-0.015em] leading-[1.15]">
          <span className="text-mimir-blue">Blue is identity.</span>{' '}
          <span className="text-mimir-orange">Orange is interruption.</span>
        </p>
        <p className="mt-3 text-[14px] text-mimir-ink/65 max-w-[640px]">
          Blue names Mimir wherever it appears in the UI. Orange should never
          become decorative — reserve it for the rare moment when the app is
          telling you something you asked it to interrupt for.
        </p>
      </div>
    </>
  );
}

/* ------------------------------ 04 Typography -------------------------- */

const typeScale: Array<{
  role: string;
  spec: string;
  className: string;
  sample: string;
}> = [
  {
    role: 'Display',
    spec: 'Instrument Sans · 96 / 92 · –2%',
    className: 'font-display font-medium text-[64px] sm:text-[96px] leading-[0.95] tracking-[-0.02em]',
    sample: 'People are made of details.',
  },
  {
    role: 'Title',
    spec: 'Instrument Sans · 44 / 44 · –2%',
    className: 'font-display font-medium text-[36px] sm:text-[44px] leading-none tracking-[-0.02em]',
    sample: 'Pick up where you left off.',
  },
  {
    role: 'Subtitle',
    spec: 'Instrument Sans · 22 / 30 · –1%',
    className: 'font-display font-medium text-[22px] leading-[1.35] tracking-[-0.01em]',
    sample: 'She just returned from Seoul. Her mom’s recovery has been slow.',
  },
  {
    role: 'Body',
    spec: 'Inter · 15 / 24 · 0',
    className: 'font-sans text-[15px] leading-[1.6]',
    sample:
      'Rachel mentioned her mom is doing better. She’s reading again and asked about the book you were talking about last time.',
  },
  {
    role: 'Detail',
    spec: 'Inter · 13 / 20 · +2%',
    className: 'font-sans text-[13px] leading-[1.55] tracking-[0.005em] text-mimir-ink/70',
    sample: 'Last seen · three weeks ago · Caffe Reggio, MacDougal',
  },
  {
    role: 'Eyebrow',
    spec: 'Inter · 11 · Uppercase · +24%',
    className: 'font-sans text-[11px] tracking-[0.24em] uppercase text-mimir-ink/55 font-medium',
    sample: 'Worth remembering',
  },
];

function TypographySection() {
  return (
    <>
      <p className="text-[15px] leading-[1.6] text-mimir-ink/75 max-w-[640px]">
        Two families, both grotesks with subtle character. Instrument Sans
        carries voice at display and title sizes. Inter handles chrome, body,
        and detail. Editorial, not decorative.
      </p>

      <div className="rounded-[14px] border border-mimir-ink/15 bg-white/50 divide-y divide-mimir-ink/10">
        {typeScale.map((t) => (
          <div
            key={t.role}
            className="grid grid-cols-[140px_1fr] items-baseline gap-6 px-6 py-6"
          >
            <div>
              <p className="font-display text-[14px] tracking-[-0.01em] text-mimir-ink">
                {t.role}
              </p>
              <p className="mt-1 text-[11px] tracking-[0.05em] text-mimir-ink/50 tabular-nums">
                {t.spec}
              </p>
            </div>
            <p className={t.className}>{t.sample}</p>
          </div>
        ))}
      </div>

      <div>
        <Subhead>Weights &amp; usage</Subhead>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { w: '400', label: 'Regular', use: 'Body prose, quiet UI text.' },
            { w: '500', label: 'Medium', use: 'Labels, eyebrows, buttons.' },
            { w: '600', label: 'Semibold', use: 'Sparingly — emphasis, active states.' },
          ].map((w) => (
            <div
              key={w.w}
              className="rounded-[14px] border border-mimir-ink/15 bg-white/50 p-5"
            >
              <p
                className="font-display text-[36px] tracking-[-0.015em] leading-none"
                style={{ fontWeight: Number(w.w) }}
              >
                Aa
              </p>
              <p className="mt-4 text-[13px] tracking-[0.05em] text-mimir-ink/60 tabular-nums">
                {w.w} · {w.label}
              </p>
              <p className="mt-1 text-[13px] text-mimir-ink/60 leading-snug">{w.use}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ------------------------------ 05 Components -------------------------- */

function ComponentsSection() {
  return (
    <>
      <ComponentBlock
        title="Buttons"
        hint="Primary is blue; ghost is bordered ink. Both are pill-shaped."
      >
        <div className="flex flex-wrap items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-full bg-mimir-blue px-4 py-2 text-[14px] font-medium text-white hover:opacity-90 active:scale-[0.99] transition">
            Save note
          </button>
          <button className="inline-flex items-center gap-2 rounded-full border border-mimir-ink/25 bg-transparent px-4 py-2 text-[14px] font-medium text-mimir-ink hover:bg-mimir-ink/[0.04] active:scale-[0.99] transition">
            Dismiss
          </button>
          <button className="inline-flex items-center gap-2 rounded-full bg-mimir-ink px-4 py-2 text-[14px] font-medium text-mimir-bg active:scale-[0.99] transition">
            Confirm
          </button>
          <button className="inline-flex items-center gap-2 rounded-full bg-mimir-orange px-4 py-2 text-[14px] font-medium text-white active:scale-[0.99] transition">
            Interrupt · rare
          </button>
        </div>
      </ComponentBlock>

      <ComponentBlock title="Chips" hint="Filters, suggested actions, quiet metadata.">
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-mimir-ink/15 bg-white/60 px-3 py-1 text-[13px] text-mimir-ink/80">
            Recently updated
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-mimir-blue/30 bg-mimir-blue/[0.06] px-3 py-1 text-[13px] text-mimir-blue">
            Follow up in two weeks?
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-mimir-ink/15 bg-mimir-ink text-mimir-bg px-3 py-1 text-[13px]">
            Selected
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-mimir-orange/40 bg-mimir-orange/10 px-3 py-1 text-[13px] text-mimir-orange">
            Milestone
          </span>
        </div>
      </ComponentBlock>

      <ComponentBlock title="Avatars" hint="Initials only. Ink circle by default; identity color for the person you're currently on.">
        <div className="flex items-end gap-6">
          {[
            { name: 'Rachel Levin', bg: '#181818' },
            { name: 'Mina Park', bg: '#3046C5' },
            { name: 'Daniel Okafor', bg: '#181818' },
            { name: 'Priya Iyer', bg: '#181818' },
            { name: 'Iris Bellweather', bg: '#181818' },
          ].map((p) => (
            <div key={p.name} className="flex flex-col items-center gap-2">
              <Avatar name={p.name} bg={p.bg} size={44} />
              <span className="text-[11px] tracking-[0.02em] text-mimir-ink/55">
                {p.name.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
      </ComponentBlock>

      <ComponentBlock title="List row · a person" hint="The atom of the People surface.">
        <div className="rounded-[12px] border border-mimir-ink/15 bg-white/60 divide-y divide-mimir-ink/10">
          <PersonRow name="Rachel Levin" role="Friend, since college" when="2d ago" active />
          <PersonRow name="Mina Park" role="Friend, parent" when="5d ago" />
          <PersonRow name="Iris Bellweather" role="Sister" when="a week ago" />
        </div>
      </ComponentBlock>

      <ComponentBlock title="Card · worth remembering" hint="Detail on a person's page.">
        <div className="rounded-[14px] border border-mimir-ink/15 bg-white/60 p-5">
          <p className="text-[11px] tracking-[0.24em] uppercase text-mimir-ink/55 font-medium">
            Worth remembering
          </p>
          <ul className="mt-3 space-y-2 font-display text-[17px] leading-[1.4] tracking-[-0.005em]">
            <li className="flex gap-3">
              <span className="mt-2 h-1 w-1 rounded-full bg-mimir-ink/40 shrink-0" />
              Just returned from Seoul — went with Min-ji.
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1 w-1 rounded-full bg-mimir-ink/40 shrink-0" />
              Her mom had surgery in March. Recovery slow.
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1 w-1 rounded-full bg-mimir-ink/40 shrink-0" />
              Prefers quiet cafés. Caffe Reggio over Blue Bottle.
            </li>
          </ul>
        </div>
      </ComponentBlock>

      <ComponentBlock title="Chat bubbles" hint="User right, Mimir left. Ink is the app; ivory is you.">
        <div className="rounded-[14px] border border-mimir-ink/15 bg-white/40 p-5 space-y-3 max-w-[560px]">
          <div className="flex justify-end">
            <div className="max-w-[80%] rounded-[16px] rounded-br-[6px] bg-mimir-ink text-mimir-bg px-3.5 py-2 text-[15px] leading-snug">
              Add that Daniel is interviewing at Airbnb.
            </div>
          </div>
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-[16px] rounded-bl-[6px] border border-mimir-ink/15 bg-white px-3.5 py-2.5 text-[15px] leading-snug text-mimir-ink">
              <p>Saved to Daniel.</p>
              <span className="mt-2 inline-flex items-center gap-2 rounded-full border border-mimir-blue/30 bg-mimir-blue/[0.06] px-3 py-1 text-[12.5px] text-mimir-blue">
                Follow up in two weeks?
              </span>
            </div>
          </div>
        </div>
      </ComponentBlock>

      <ComponentBlock title="Suggestion · Mimir noticed something" hint="Natural language. No confidence score, no extraction label.">
        <div className="rounded-[14px] border border-mimir-ink/15 bg-white/60 p-5 max-w-[560px]">
          <p className="text-[11px] tracking-[0.24em] uppercase text-mimir-blue font-medium">
            Mimir noticed
          </p>
          <p className="mt-2 font-display text-[19px] leading-[1.35] tracking-[-0.005em]">
            You might want to ask Alex how the move went.
          </p>
          <div className="mt-4 flex gap-2">
            <button className="inline-flex items-center gap-2 rounded-full bg-mimir-blue px-3 py-1.5 text-[13px] font-medium text-white">
              Draft a note
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-mimir-ink/25 px-3 py-1.5 text-[13px] font-medium text-mimir-ink">
              Not now
            </button>
          </div>
        </div>
      </ComponentBlock>
    </>
  );
}

function ComponentBlock({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <Subhead hint={hint}>{title}</Subhead>
      <div className="rounded-[14px] border border-mimir-ink/10 bg-mimir-bg p-6">
        {children}
      </div>
    </div>
  );
}

function Avatar({ name, bg, size = 36 }: { name: string; bg: string; size?: number }) {
  const initials = name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <span
      className="inline-flex items-center justify-center rounded-full font-display text-white tracking-[-0.01em]"
      style={{
        width: size,
        height: size,
        background: bg,
        fontSize: Math.round(size * 0.4),
      }}
      aria-label={name}
    >
      {initials}
    </span>
  );
}

function PersonRow({
  name,
  role,
  when,
  active,
}: {
  name: string;
  role: string;
  when: string;
  active?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Avatar name={name} bg={active ? '#3046C5' : '#181818'} size={36} />
      <div className="flex-1 min-w-0">
        <p className="font-display text-[17px] tracking-[-0.005em] leading-tight truncate">
          {name}
        </p>
        <p className="text-[13px] text-mimir-ink/60 truncate">{role}</p>
      </div>
      <span className="text-[12px] text-mimir-ink/45 tabular-nums shrink-0">
        {when}
      </span>
    </div>
  );
}

/* ------------------------------ Footer --------------------------------- */

function Footer() {
  return (
    <footer className="mt-24 pt-8 border-t border-mimir-ink/15 flex items-baseline justify-between">
      <p className="text-[13px] text-mimir-ink/55">
        Mimir · design system · v0.1 · living document
      </p>
      <a
        href="/brief"
        className="text-[13px] text-mimir-blue hover:underline"
      >
        Prototype →
      </a>
    </footer>
  );
}
