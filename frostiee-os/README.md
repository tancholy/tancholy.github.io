# Frostiee OS — Alpha 0.1

A responsive, local-first prototype for Tymofii's personal creative headquarters.

## Included
- Dashboard overview
- Tasks with completion toggles and categories
- Second Brain notes
- Bookmarks
- Starter department cards: Creator Studio, Academy, Tech Lab, Idea Factory
- Search across saved items (quick match notifications)
- Local JSON export and local data reset
- Responsive layout and basic offline cache

## Important limitations
This alpha does **not** include account login, server-side storage, encryption at rest, or cross-device sync. Data is stored in this browser's localStorage. Do not put passwords, private credentials, or sensitive information in it. It is a prototype, not the final private Frostiee OS.

## Next development stage
1. Add Supabase Auth with invite-only access and server-side session handling.
2. Store notes/tasks/bookmarks in a database with Row Level Security.
3. Deploy the app separately from the public portfolio.
4. Add the portfolio navigation link only when the private app deployment is ready.
5. Add Microsoft integrations only after parent-approved account setup and explicit permissions.

## Run locally
Open `index.html` in a browser, or serve this directory with any static web server. For offline/PWA features, use HTTPS or localhost.
