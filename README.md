# College Event Registration Portal

This repository contains a simple full-stack College Event Registration Portal (React + Express + MongoDB).

Quick status: the backend runs on port `3000` by default and the frontend uses Vite (`npm run dev`).

## Local setup

Prerequisites:
- Node.js 18+ (or compatible)
- MongoDB running locally or a MongoDB connection string

1. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

2. Configure environment

Create a `.env` file in the `backend` folder (you can start from `.env.example`). Required variables:

- `MONGO_URI` - MongoDB connection string (example: `mongodb://127.0.0.1:27017/collegeEvents`)
- `JWT_SECRET` - secret string used for signing JWTs
- `PORT` - backend port (defaults to `3000`)

Example: `backend/.env.example` is provided.

3. Seed the database

From the `backend` folder run:

```bash
node seed.js
```

This will create one admin account and the 11 student accounts and 5 sample events required by the brief.

Seeded credentials (use these to log in):

- Admin: `username: admin`, `password: inspirante2026`
- Students: all have password `student123`. Usernames include `asha.rao`, `ravi.shetty`, `meera.nair`, etc. (11 accounts seeded)

4. Start the servers

Backend (port 3000):

```bash
cd backend
npm start
```

Frontend (Vite):

```bash
cd frontend
npm run dev
```

Open the frontend in your browser (Vite will show the local URL, typically `http://localhost:5173`).

## Important endpoints

- `POST /api/login` — login (admin or student)
- `GET /api/events` — list events (requires auth token)
- `POST /api/events` — create event (admin only)
- `POST /api/register` — register student for an event
- `GET /api/events/:id/registrations` — list registrations for an event (admin only)

All API routes are prefixed with `/api/` and expect a JSON body and `Authorization: Bearer <token>` where required.

## Notes

- The app enforces event capacity on the backend and disables the Register button on the frontend when an event is full.
- Only seeded users can log in; the login endpoint no longer auto-creates users.
- For production, update `JWT_SECRET` and use a managed MongoDB instance.

If you want, I can also add `DECISIONS.md` and expand this README with a troubleshooting section.
