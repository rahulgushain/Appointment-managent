# Appointment Manager (MERN)

React (Vite + Tailwind) + Node/Express + MongoDB (Mongoose).

## Prerequisites
- Node.js 18+
- MongoDB running locally (`mongodb://127.0.0.1:27017`) **or** a free MongoDB Atlas connection string

## Run it
**1. API** (terminal 1)
```bash
cd server
npm install
cp .env.example .env      # Windows: copy .env.example .env  (edit MONGODB_URI if using Atlas)
npm run seed              # loads the 3 starting appointments (optional, safe to re-run)
npm run dev               # http://localhost:5000
```
**2. Client** (terminal 2)
```bash
cd client
npm install
cp .env.example .env      # Windows: copy .env.example .env
npm run dev               # http://localhost:5173
```
Open http://localhost:5173.

## Environment files (no secrets committed)
- `server/.env.example`: `PORT`, `MONGODB_URI`, `CLIENT_ORIGIN`
- `client/.env.example`: `VITE_API_URL` (default `http://localhost:5000/api`)

## API
| Method | Path | Notes |
|---|---|---|
| GET | `/api/appointments?status=Pending&search=alex` | both optional; search = case-insensitive partial customer name |
| POST | `/api/appointments` | body `{customerName, service, dateTime, status?}`; 400 with per-field `errors` |
| PATCH | `/api/appointments/:id/status` | body `{status}`; 400 invalid, 404 not found |
| GET | `/api/health` | health check |

## Tests performed
- Automated (`cd server && npm test`): list, status filter, invalid filter, search (case-insensitive, partial, regex-safe), search + status combined, create + trim, required-field validation, status update, invalid status / unknown id / bad id. 10/10 pass.
- Manual API run against a real MongoDB: seed, CORS header, create, validation errors, status change, search, persistence.
- Client production build and lint pass.

## Features
Completed: list, add, validation (client + server), change status, status filter, customer-name search (debounced, combines with filter), responsive UI, MongoDB persistence, seed data.
Not included: edit/delete, authentication, pagination.
Known limitations: no double-booking check; times shown in the browser's local timezone.

## Technical decision
Filtering and search run on the server (MongoDB query, regex input escaped) rather than in the browser, so behaviour stays correct as data grows and the API is reusable.

## Disclosure
Built with AI assistance (Claude). Only the Vite React scaffold was used as a starter.
