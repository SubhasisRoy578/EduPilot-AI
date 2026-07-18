# EduPilot AI

A comprehensive monorepo for the EduPilot AI platform - an AI-powered personalized learning system.

## Project Structure

```
EDU-PILOT-AI/
├── frontend/              # Next.js frontend application
│   ├── app/              # Next.js App Router
│   ├── components/       # React components
│   ├── lib/              # Utilities and helpers
│   ├── public/           # Static assets
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.mjs
│   └── README-FRONTEND.md
├── backend/              # Backend service (coming soon)
└── README.md            # This file
```

## Getting Started

### Frontend

Navigate to the frontend directory and install dependencies:

```bash
cd frontend
pnpm install
pnpm dev
```

The app will be available at `http://localhost:3000`.

## Features

- **Landing Page**: Marketing site with hero, features, testimonials, and CTAs
- **Authentication**: Sign-in, sign-up, and password recovery pages
- **Dashboard**: Main user interface with sidebar navigation
- **AI Roadmap**: Personalized learning path generation
- **AI Assessment**: Skill assessment and evaluation
- **Analytics**: Learning analytics and progress tracking

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Package Manager**: pnpm

## Development

### Prerequisites

- Node.js 18+
- pnpm 8+

### Setup

1. Clone the repository
2. Navigate to `frontend/` directory
3. Install dependencies: `pnpm install`
4. Start dev server: `pnpm dev`

## Deployment

The frontend can be deployed to Vercel or any other hosting platform. See `frontend/README-FRONTEND.md` for more details.
https://edupilot-ai-tau.vercel.app/
