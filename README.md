# LearnConnect – Online Learning Portal
Angular + TypeScript frontend and Node.js + Express REST API backend.

## Run
1. Install Node.js 20+ and Angular CLI (`npm install -g @angular/cli`).
2. Backend terminal:
   `cd LearnConnect/backend`
   `npm install`
   Copy `.env.example` to `.env`, then run `npm run dev`.
3. Frontend terminal:
   `cd LearnConnect/frontend`
   `npm install`
   `npm start`
4. Open http://localhost:4200. API health: http://localhost:3000/api/health

This college-project starter implements course browsing/search, registration, login, JWT-protected enrollment, my courses, profile, instructor dashboard and course creation. The remaining specification routes are included as starter pages to expand. Data is in memory and resets when the backend restarts. Instructor self-selection is demo-only; production roles must be admin-assigned.
