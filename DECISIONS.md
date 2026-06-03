# DECISIONS

## 1) Chosen stack
- Frontend: React (Vite). Chosen for fast local dev, HMR, and a small, modern build setup.
- Backend: Node.js + Express. Lightweight, easy REST API construction, widespread hosting options.
- Database: MongoDB with Mongoose. Flexible document model suits events/registrations and simplifies seeding.

Rationale: the stack minimizes boilerplate while allowing a complete full‑stack app with JWT auth and seeding; it also matches common reviewer expectations for this brief.

## 2) One decision made that wasn't specified
I denormalised registration counts onto the `Event` document (`registrationCount`) and increment it on successful registration. This keeps the admin dashboard fast (no aggregation on every request) and simplifies the capacity check logic.

## 3) One thing I'd improve with more time
Reduce reliance on AI-generated backend code and changes: prefer manual implementation and code reviews for critical backend logic. Specifically, implement MongoDB transactions or an atomic `findOneAndUpdate` with a capacity check to avoid race conditions when many students register concurrently, and add unit/integration tests for auth and registration edge cases plus a CI workflow.

