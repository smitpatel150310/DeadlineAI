# DeadlineAI
# DeadlineAI

> AI-powered productivity and deadline management application built with React, Express, Supabase, and Google Gemini.

DeadlineAI helps students, professionals, and entrepreneurs manage deadlines, plan work, break down projects, create study plans, and stay focused — all with the power of AI.

---

## Tech Stack

| Layer          | Technology                                      |
| -------------- | ------------------------------------------------ |
| **Frontend**   | React 18, TypeScript, Vite, Tailwind CSS         |
| **Backend**    | Node.js, Express, TypeScript                     |
| **Database**   | Supabase (PostgreSQL + Auth + RLS)               |
| **AI**         | Google Gemini 1.5 Flash via `@google/generative-ai` |
| **Deployment** | Docker, Google Cloud Run                         |

---

## Project Structure

```
deadline-ai/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React context (Auth)
│   │   ├── hooks/          # Custom hooks (useAuth, useTasks)
│   │   ├── lib/            # Supabase & API clients
│   │   ├── pages/          # Page-level components
│   │   └── types/          # Shared TypeScript types
│   ├── .env.example        # Frontend env template
│   └── package.json
├── server/                 # Express backend
│   ├── src/
│   │   ├── routes/         # API route handlers (Gemini)
│   │   └── index.ts        # Server entry point
│   ├── .env.example        # Backend env template
│   └── package.json
├── supabase/
│   └── migrations/         # SQL migration files
├── Dockerfile              # Multi-stage production build
├── .gitignore
├── package.json            # Root monorepo scripts
└── README.md               # This file
```

---

## Quick Start — Step by Step

### Prerequisites

- **Node.js** 20+ and npm
- A **Supabase** project (free tier works)
- A **Google Gemini API key** (optional — app works in demo mode without it)

### Step 1 — Clone and Install

```bash
git clone https://github.com/your-username/deadline-ai.git
cd deadline-ai

# Install root dependencies
npm install

# Install client and server dependencies
npm run install:all
```

### Step 2 — Set Up Supabase Database

1. Go to [supabase.com](https://supabase.com) and create a new project (or open an existing one).
2. In the left sidebar, click **SQL Editor**.
3. Open the file `supabase/migrations/20260624_complete_deadlineai_schema.sql` from this project.
4. **Copy the entire SQL contents** and paste it into the SQL Editor.
5. Click **Run** to create all tables, triggers, and security policies.

### Step 3 — Get Your Supabase Keys

1. In your Supabase dashboard, go to **Project Settings → API**.
2. Copy:
   - **Project URL** (looks like `https://abc123.supabase.co`)
   - **anon / public key** (a long JWT string starting with `eyJ...`)

### Step 4 — Configure Frontend Environment

Create the file `client/.env` with these values:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### Step 5 — Configure Backend Environment (Optional)

Create the file `server/.env` for the AI Copilot:

```env
PORT=3001
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
```

> **Note:** The app works without a Gemini key — the AI Copilot will return a demo response instead.

### Step 6 — Enable Email Auth

1. In your Supabase dashboard, go to **Authentication → Providers**.
2. Make sure **Email** is enabled.
3. (Optional) To skip email confirmation during development:
   Go to **Authentication → Settings** and disable "Enable email confirmations".

### Step 7 — Start the App

```bash
npm run dev
```

This starts both the client (port 5173) and server (port 3001) concurrently.

Open **http://localhost:5173** in your browser.

### Step 8 — Verify Everything Works

1. **Sign up** with an email and password.
2. In your Supabase dashboard, check:
   - **Authentication → Users** — your new account should appear.
   - **Table Editor → profiles** — a row with your `user_id` and `full_name` should be auto-created.
3. **Create a task** on the Tasks page — check **Table Editor → tasks** for the new row.
4. **Open the AI Copilot** on the Assistant page — send a message and check **Table Editor → chat_sessions** and **chat_messages**.

---

## Environment Variables

### Client (`client/.env`)

| Variable                 | Description                    | Required |
| ------------------------ | ------------------------------ | -------- |
| `VITE_SUPABASE_URL`      | Supabase project URL           | Yes      |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key       | Yes      |

### Server (`server/.env`)

| Variable       | Description                              | Required |
| -------------- | ---------------------------------------- | -------- |
| `PORT`         | Server port (default: 3001)              | No       |
| `GEMINI_API_KEY` | Google Gemini API key                  | No*      |
| `NODE_ENV`     | Environment (`development`/`production`) | No       |

> *The app works without a Gemini key. The AI Copilot will return demo responses instead.

**⚠️ Never put `SUPABASE_SERVICE_ROLE_KEY` or `GEMINI_API_KEY` in the client `.env` file.**

---

## Development Commands

| Command              | Description                                     |
| -------------------- | ----------------------------------------------- |
| `npm run dev`        | Start both client and server in development mode |
| `npm run dev:client` | Start only the React client                     |
| `npm run dev:server` | Start only the Express server                   |
| `npm run build`      | Build both client and server for production     |
| `npm run start`      | Start the production server                     |
| `npm run install:all`| Install dependencies for client and server      |

---

## Deployment — Google Cloud Run

### Build and Push Docker Image

```bash
gcloud builds submit --tag gcr.io/YOUR_PROJECT/deadline-ai
```

### Deploy to Cloud Run

```bash
gcloud run deploy deadline-ai \
  --image gcr.io/YOUR_PROJECT/deadline-ai \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "GEMINI_API_KEY=xxx,VITE_SUPABASE_URL=xxx,VITE_SUPABASE_ANON_KEY=xxx,PORT=8080"
```

> **Note:** Cloud Run sets `PORT` automatically. Set it to `8080` if deploying there.

---

## License

MIT
