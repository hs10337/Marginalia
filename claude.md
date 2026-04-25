# Noted — Product Requirements Document

## Product summary

Noted is a private relationship memory app that helps people remember what matters about friends and important relationships, then resurface that context at the right time so they can have better conversations and follow through naturally.

**Core promise:** Capture fast. Remember well. Show up better.

## Vision

Build a personal memory layer for relationships.

Long term, Noted can become the relationship context layer for a broader personal assistant. In the near term, it should do one job very well: help a user quickly save details after an interaction, retrieve them later, and act when timing matters.

## Problem

People want to be thoughtful, but details slip away:

- birthdays
- kids' names and birthdays
- family members and relationship context
- upcoming life events
- preferences and gift ideas
- things to ask about next time
- promised follow-ups

Today this information is scattered across memory, messages, contacts, calendar, and random notes. The result is not just forgotten facts; it is missed opportunities to reconnect, check in, send something thoughtful, or have deeper conversations.

## Product goal

Help users have better and deeper conversations by remembering personal details and turning them into timely follow-through.

## Target user

Primary user:

- someone who cares about relationships and wants to be more thoughtful
- often social, busy, and mentally overloaded
- meets, calls, or messages people often enough that memory breaks down
- wants something more structured than Apple Notes, but much more human than a CRM

Secondary user later:

- someone who wants assistant support for follow-up, reminders, outreach, and scheduling

## Job to be done

When I meet or talk with someone and learn something important about them, help me quickly save it, organize it, and bring it back when it matters so I can reconnect thoughtfully and follow through.

## Product principles

1. **Capture must be easier than forgetting.** If logging is slow, the product dies.
2. **Notes first, structure second.** Users think in messy language, not fields.
3. **Resurfacing is more important than storage.** Information only matters if it comes back at the right moment.
4. **Assist, do not automate intimacy.** The app should support thoughtfulness, not fake it.
5. **The product must feel private and human.** Never managerial, transactional, or creepy.
6. **Confirmation should be mostly passive.** Raw notes save immediately. Structured memory can be confidence-based and reviewed later.

## Product positioning

Noted is not:

- a social CRM
- a contacts manager
- a journaling app about other people
- a life-logging system

Noted is:

- a relationship memory and follow-through app
- a private personal tool for remembering what matters
- a way to prepare better for real conversations

## Core product loop

Capture → Structure → Resurface → Act

### Capture

After seeing or talking to someone, the user drops a quick messy note.

Example:

> Met Maya for dinner. Her son Eli turns 4 on June 12. She starts a new job next month. Remind me to send her that preschool list.

### Structure

The note is saved immediately.

The app extracts facts, events, and follow-ups automatically.

Examples:

- Child: Eli
- Child birthday: June 12
- Life update: starts a new job next month
- Follow-up: send preschool list

### Resurface

Before the next interaction, or when timing matters, Noted brings context back.

Examples:

- Eli's birthday is in 5 days
- You wanted to send Maya the preschool list
- Maya starts her new job next month

### Act

The user can then message, call, plan a hangout, set a gift reminder, or snooze.

## Information model

### Person

A person record stores the core identity and summary context.

Suggested fields:

- name
- preferred name
- photo
- relationship type
- contact info
- birthday
- summary
- last interaction date
- tags

### Note

The raw user input after an interaction.

Suggested fields:

- person_id
- raw_note
- created_at
- context
- source_type

### Structured memory

Facts and updates extracted from notes.

Suggested fields:

- category
- label
- value
- confidence
- source_note_id
- learned_at
- expires_at
- pinned

### Event

Time-based information.

Examples:

- birthdays
- anniversaries
- trips
- moves
- weddings
- interviews
- surgeries

### Follow-up

An action or reminder created from user intent.

Examples:

- send preschool list
- check in after interview
- plan dinner next month

## Core product architecture

The product now has four main surfaces.

## 1. Chat

The main input and retrieval surface.

**Purpose:**

- add new information
- ask questions about people
- use natural language instead of forms

**Examples:**

- "Met Daniel for coffee. He and Priya are moving to Portland in August."
- "When is Maya's son's birthday?"
- "What should I remember before I see Jess this week?"

**Why this matters:**

Chat makes the product feel alive and easy. It avoids forcing users into profile editing.

**Risk:**

Chat is doing two jobs: capture and retrieval. The interface must make those patterns obvious so it does not feel muddy.

## 2. People

The directory and browse layer.

**Purpose:**

- see all contacts
- search by person or memory context
- open a details page

**Why this matters:**

Users still need a stable place to browse people, not just talk to a chat surface.

## 3. Inbox

The action layer.

**Purpose:**

- hold follow-ups
- hold reminders that need attention
- centralize birthdays, upcoming moments, and user-created actions

**Examples:**

- send Maya the preschool list
- Eli's birthday in 5 days
- check in with Daniel about the move

**Why this matters:**

Without Inbox, reminders get scattered across chat and profile pages. Inbox separates memory from obligation.

**Product rule:**

Inbox should contain things that need attention, not every passive memory.

## 4. Details

The truth and context layer for a person.

**Purpose:**

- show structured information
- show raw notes
- show what matters now
- serve as a briefing page before reconnecting

**Recommended hierarchy:**

1. what matters now
2. structured details
3. notes history

**Why this matters:**

The page should not feel like a static profile. It should help the user prepare for a real interaction.

## UX strategy

### Capture strategy

- user types or dictates one note
- note is saved immediately
- structured items are extracted automatically
- confirmation is passive and contextual

This reduces friction while protecting trust.

### Confirmation strategy

Not every extracted detail should become hard truth immediately.

Recommended model:

- raw note = always saved
- high-confidence structured detail = can be stored directly
- ambiguous detail = stored softly and surfaced later for passive review

This prevents the system from confidently storing wrong facts.

### Resurfacing strategy

The app wins when it surfaces the right detail at the right time.

High-signal resurfacing moments:

- upcoming birthdays
- major life events
- promised follow-ups
- before a hangout or call
- when a user explicitly asks about someone

## MVP scope

### Must have

- chat-based capture of notes
- chat-based questions about people
- people list with search
- details page with structured memory + notes
- inbox for follow-ups and reminders
- birthday and event tracking
- extraction of facts, events, and follow-ups from notes

### Nice to have soon after

- voice capture
- suggested follow-ups
- assistant-generated pre-meeting brief
- relationship tags or closeness levels
- gift idea tracking

### Not in V1

- relationship scores
- social gamification
- auto-ingestion from messages or email
- over-aggressive AI reminders
- shared profiles
- full scheduling assistant
- full gift commerce flows

## What makes Noted good

A strong version of Noted does two things extremely well:

1. right after an interaction, it makes capture effortless
2. right before the next interaction, it makes preparation effortless

That is the wedge.

## Competitive edge

The differentiator is not storage. It is low-friction capture plus timely resurfacing.

Many products can store notes. Few products can:

- turn messy notes into structured relationship memory
- make that memory feel useful later
- keep the experience warm instead of transactional

## Product risks

### 1. Capture friction

If users have to fill fields after every meeting, adoption dies.

### 2. Weak resurfacing

If the app does not bring information back when it matters, it becomes dead storage.

### 3. Low trust in extraction

If the system silently stores incorrect facts, users will stop trusting it.

### 4. Creepy tone

If the app feels like managing people, users will reject it emotionally.

### 5. Inbox overload

If every detail becomes a reminder, the app becomes noisy and stressful.

## Tone and product boundaries

The app should feel:

- thoughtful
- calm
- private
- practical
- lightweight

The app should not feel:

- manipulative
- guilt-driven
- performative
- sales-like
- surveillance-oriented

Avoid:

- friendship scores
- streaks
- "you haven't talked to this person in 47 days"
- generic nagging nudges

## Success metrics

Do not optimize for number of contacts created.

Better metrics:

- notes captured per active user
- percentage of notes that produce structured memory
- percentage of users who revisit a person before an interaction
- inbox action completion rate
- reminder open rate
- repeat usage of person details pages
- week 1 and month 1 retention

The key question is whether users return for resurfacing, not just capture.

## Roadmap

### Phase 1: Memory foundation

- chat capture
- chat retrieval
- people list
- details page
- inbox
- events and birthdays

### Phase 2: Better conversation prep

- richer person summaries
- pre-meeting briefs
- stronger search and relationship context
- passive review of uncertain facts

### Phase 3: Assistant layer

- message drafting
- smarter reminder suggestions
- lightweight scheduling prompts
- integrations with assistant workflows

## Open questions

1. How much should Chat vs Details own retrieval?
2. What belongs in Inbox versus passive reminders elsewhere?
3. How visible should confidence states be for extracted memories?
4. Should the app distinguish between close friends, family, and light relationships?
5. What is the right level of reminder frequency before the product feels naggy?

## Strategic summary

Noted should begin as a relationship memory and follow-through app.

It should not try to be a full assistant on day one.

If the product nails one sentence, it has a real chance:

**After you see someone, jot one messy note. Before you see them again, Noted helps you remember what matters.**

---

# Noted — Brand Strategy

## Brand idea

**Noted helps thoughtful people remember what matters and follow through with care.**

Noted is not a social CRM, contact manager, or productivity tool for friendship. It is private support for people who already care deeply, but cannot hold every important detail, reminder, and follow-up in their head.

## The tension

The core tension is not lack of care. It is overload.

**"I care about people, but life is full, and I cannot keep every important detail, date, and follow-up in my head."**

That is the emotional truth the brand should own.

## Audience

### Core audience

Thoughtful people with full lives who want help staying present in their relationships.

### Initial wedge

Thoughtful moms managing a meaningful circle of roughly 20 households:

- close friends
- parent friends
- family friends
- socially important relationships

### Audience traits

They are:

- caring
- emotionally attentive
- mentally overloaded
- often the person who remembers details and follows up
- likely to feel guilt when something important slips
- open to support, but not to cold systems

## Category

**Relationship assistant**

Supporting language:

- personal memory for the people you care about
- thoughtful follow-through assistant
- relationship support with memory and action

Avoid category language such as:

- friend CRM
- contact manager
- relationship tracker
- social organizer

## Positioning

**For thoughtful people with full lives, Noted helps you remember what matters and follow through with the people you care about.**

### Internal positioning

**Noted turns caring intentions into thoughtful action.**

## Brand promise

**You do not have to hold it all in your head to still show up well.**

## What the brand is really selling

Not memory.

Not reminders.

Not AI.

It is selling the feeling of still being the kind of person who:

- remembers what matters
- checks in
- follows through
- shows up thoughtfully

## Brand pillars

### 1. Caring, not calculating

Noted should support real care. It should never make relationships feel strategic, optimized, or transactional.

### 2. Relief, not management

Noted should feel like mental relief, not another system to maintain.

### 3. Thoughtfulness in action

The brand is not only about storing details. It is about helping users check in, follow up, remember important moments, and act with care.

## Brand personality

Noted should feel:

- warm
- observant
- calm
- discreet
- emotionally intelligent
- quietly capable
- understated

Noted should not feel:

- bubbly
- clinical
- robotic
- aggressively productive
- overly sentimental
- AI-hyped

## Tone of voice

Voice principles:

- concise
- warm
- calm
- clear
- understated
- emotionally aware

Example phrasing:

- It has been a while.
- Her birthday is next week.
- You mentioned sending that recommendation.
- A quick check-in could mean a lot.
- Worth following up.

Avoid phrasing like:

- Relationship action overdue
- Optimize your social life
- Re-engagement opportunity
- Track every important detail

## Brand story

You care about people.

You remember pieces.

You mean to follow up.

You want to send the note, remember the detail, mark the occasion, and check in at the right moment.

But life gets crowded, and good intentions get buried.

Noted helps you hold onto what matters, so you can show up with more care and less mental load.

## Emotional outcome

Noted should make users feel:

- more present
- more thoughtful
- less guilty
- less mentally overloaded
- more like themselves

The core emotional outcome is:

**"I am still the kind of person who remembers and shows up."**

## Strategic differentiation

Most tools help people manage tasks, contacts, or networks.

**Noted helps people care better.**

That is the difference.

## Brand guardrails

Noted must always feel:

- private
- warm
- discreet
- emotionally respectful
- supportive
- trusted

Noted must never feel:

- invasive
- transactional
- manipulative
- socially performative
- like surveillance
- like a dossier on people

## Visual strategy

### Core motif

**A trusted notebook that belongs to someone thoughtful.**

Well-carried, quietly classy, personal, tactile, and timeless.

This should feel like the place where important human details live: names, dates, reminders, follow-ups, and moments worth returning to.

### Visual world

The visual direction should feel like:

- an old classy notebook
- moleskine-like restraint
- cream paper and ink
- tabs, page markers, and inserts
- handwritten emphasis used sparingly
- quietly important rather than decorative

It should not feel like:

- corporate executive luxury
- scrapbook craft
- productivity SaaS
- AI futurism
- generic social app friendliness

### Design principle

**Structured like an archive, softened like paper, and marked like something important enough to revisit.**

## Art direction

The closest target direction is:

- the architecture and editorial seriousness of an archive/reference book
- softened with paper warmth and tactile restraint
- more personal notebook than museum catalog

### Practical cues

Use:

- tabbed sections
- page markers
- generous margins
- warm paper tones
- inset cards that feel like inserted notes
- stamps, underlines, and clipped details used sparingly

Avoid:

- dashboard-heavy UI
- glossy luxury cues
- cute journaling aesthetics
- overly ceremonial or spiritual softness

## Visual tone

### The right tension

**Old-classy notebook + sharp intelligence**

To add edge, the system should feel less sentimental and more incisive.

Edge should come from:

- sharper editorial typography
- dark accents like oxblood, graphite, midnight navy, or deep forest
- underlines, tabs, annotations, and markers
- signs of use and imperfection
- direct, observant copy

## Color direction

Palette should be muted, tactile, and intelligent.

Strong directions:

- cream / bone backgrounds
- ink or charcoal text
- faded taupe or warm gray neutrals
- one sharper accent such as oxblood, muted olive, dusty blue, or deep forest

The overall effect should feel:

- calm
- private
- warm
- quietly premium

## Messaging framework

### Core headline territory

- Remember what matters.
- Stay thoughtful, even when life gets full.
- Keep up with the people you care about.
- A little help following through.

### Supporting message

Noted helps thoughtful people remember meaningful details, stay ahead of important moments, and follow through with care.

### Functional proof

- save meaningful details quickly
- organize relationships by household
- surface important moments
- nudge thoughtful follow-through
- keep gift ideas and reminders in one place

## Suggested tagline directions

Strong options:

- **Remember what matters.**
- **Stay thoughtful.**
- **Show up thoughtfully.**
- **Keep up with the people you care about.**
- **A little help staying thoughtful.**
- **Care, remembered.**

Current strongest recommendation:

**Noted — Remember what matters.**

Supporting line:

**A relationship assistant for thoughtful people with full lives.**

## One-line summary

**Noted is a relationship assistant that helps thoughtful people remember what matters and follow through with care.**

## Final standard

Every brand decision should pass this test:

**Does this feel like a trusted notebook for the details that matter — classy, personal, and quietly important?**
