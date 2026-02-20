# CandyGaga

Production-ready original match-3 puzzle game monorepo.

## Stack
- Frontend: React 18 + TypeScript + Phaser + Tailwind + Vite
- Backend: Node.js + Express + REST + input validation + rate limiter
- Testing: Vitest + Testing Library + Supertest

## Run locally
```bash
npm install --workspaces
npm run -w backend dev
npm run -w frontend dev
```

## Quality gates
```bash
npm run lint
npm test
npm run build
```

## API
- `GET /levels`
- `POST /progress/save`
- `GET /progress/load?userId=...`
- `POST /analytics/event`

## Deployment
- Frontend template: `deployment/netlify.toml`
- Backend dockerized: `backend/Dockerfile`
- ECS task sample: `deployment/ecs-task-def.json`

Configure env vars for production API URLs and Firebase credentials via deployment platform secrets.
