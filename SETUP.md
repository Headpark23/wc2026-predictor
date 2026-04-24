# World Cup 2026 AI Predictor — Setup Guide

> Built with Next.js 14, Tailwind CSS, Poisson Distribution, and API-Football.
> Deployed free on Vercel.

---

## What This Site Does

- Shows all 24 Matchday 1 fixtures with AI predictions (score, corners, cards)
- Updates automatically every 2 minutes from API-Football during the tournament
- Live group tables, win probability bars, and prediction accuracy tracking
- UK TV channels (BBC/ITV) shown on every fixture
- All 48 teams with national flags

---

## Stack

| Layer | Tool |
|-------|------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Data | API-Football v3 |
| Predictions | Poisson Distribution model |
| Hosting | Vercel (free tier) |
| Flags | flagcdn.com |

---

## Local Development

### Prerequisites
- Node.js 18+ ([nodejs.org](https://nodejs.org))
- An API-Football key ([api-football.com](https://api-football.com))

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and add your API key
cp .env.local.example .env.local
# Edit .env.local and set API_FOOTBALL_KEY=your_key_here

# 3. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the site.

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `API_FOOTBALL_KEY` | Your API-Football API key | Yes |
| `API_FOOTBALL_WC_LEAGUE_ID` | World Cup league ID (default: 1) | No |
| `API_FOOTBALL_WC_SEASON` | Season year (default: 2026) | No |

---

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New → Project**
3. Import your GitHub repo
4. In **Environment Variables**, add:
   - `API_FOOTBALL_KEY` = your key
   - `API_FOOTBALL_WC_LEAGUE_ID` = `1`
   - `API_FOOTBALL_WC_SEASON` = `2026`
5. Click **Deploy** — done in ~2 minutes

---

## Project Structure

```
wc2026-predictor/
├── app/
│   ├── page.tsx          # Homepage with hero + featured fixtures
│   ├── fixtures/         # All matchday 1 fixtures
│   ├── groups/           # 12 group tables
│   ├── stats/            # Prediction stats & insights
│   └── api/              # REST endpoints
│       ├── fixtures/     # GET /api/fixtures
│       ├── predictions/  # GET|POST /api/predictions
│       └── standings/    # GET /api/standings
├── components/
│   ├── Navigation.tsx
│   ├── FixtureCard.tsx
│   ├── GroupTable.tsx
│   ├── PredictionPanel.tsx
│   ├── CountdownTimer.tsx
│   └── TeamFlag.tsx
└── lib/
    ├── constants.ts      # All 48 teams, 12 groups, fixtures
    ├── predictions.ts    # Poisson model
    ├── api-football.ts   # API client
    └── utils.ts          # Helpers
```

---

## Prediction Model

Expected goals use the Poisson distribution:

- λ_home = (home_attack / away_defense) × 1.30
- λ_away = (away_attack / home_defense) × 1.30

Attack/defense ratings (0.5–2.5) are derived from FIFA world rankings.
The score probability matrix covers 0–6 goals per team (49 possible outcomes).

---

## API Usage

Free plan: **100 requests/day**. The site caches responses for 2 minutes, so real-world usage is ~720 req/day at peak. Upgrade to a paid plan for the live tournament.

Check usage: [dashboard.api-football.com](https://dashboard.api-football.com)

---

## Notes

- `.env.local` is excluded from Git by `.gitignore` — your key is safe
- Predictions are statistical estimates only — not betting advice
- Group tables show predicted standings pre-tournament; live data replaces them from June 11
