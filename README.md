# Marginalia

A click-through web prototype for **Noted** — an iOS app that helps you remember
the people in your life. Quiet, classy-notebook aesthetic. All data is mock.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:5173. The app renders inside an iPhone bezel on desktop
and full-screen on mobile.

## Surfaces

- **Brief** — today’s meetings, with a hero "Before You Meet" card per person.
- **Inbox** — pending suggestions (disambiguate, milestone, follow-up) and recent captures.
- **Chat** — rules-based assistant. Try:
  - `Add that Daniel is interviewing at Airbnb`
  - `What do I know about Rachel?`
  - `Remind me to ask Mina about Sofia`
  - `Who haven’t I checked in with recently?`
- **People** — sectioned wiki: recently updated, upcoming, needs follow-up, important, everyone. Tap a person for their article page.

## Stack

Vite · React · TypeScript · Tailwind · react-router · lucide-react.
No backend; state lives in `src/context/MockDataContext.tsx`.
