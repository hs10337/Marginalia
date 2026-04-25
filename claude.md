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
