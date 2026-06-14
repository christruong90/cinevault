# CineVault

A full-stack portfolio project for discovering, reviewing, and saving films. Built to demonstrate backend development, frontend UI, database design, and third-party API integration.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | FastAPI (Python) |
| Database | MySQL + SQLAlchemy |
| Auth | JWT + OAuth2 |
| Movie Data | TMDB API |
| Frontend | React + Vite |
| Deployment | Docker Compose |

## Features

- Browse and search movies powered by the TMDB API
- User registration and login (JWT authentication)
- Write and read movie reviews
- Save movies to a personal favourites list

## Project Structure

```
cinevault/
├── backend/
│   ├── app/
│   │   ├── core/        # Config, security, dependencies
│   │   ├── models/      # SQLAlchemy database models
│   │   ├── routers/     # API route handlers
│   │   ├── schemas/     # Pydantic request/response schemas
│   │   └── services/    # Business logic & TMDB API client
│   └── requirements.txt
├── frontend/            # React + Vite app
└── docker-compose.yml
```

## Live Demo

- **Frontend**: https://cinevault-frontend-production.up.railway.app
- **API**: https://cinevault-production-3b6a.up.railway.app/docs

## Running Locally

### Prerequisites
- MySQL installed and running:
  ```bash
  mysql.server start
  ```
- Python 3.12+
- Node.js 20+
- TMDB API key — free at https://www.themoviedb.org/settings/api

### 1. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Create `backend/.env`:
```
DATABASE_URL=mysql+pymysql://root:@localhost:3306/cinevault
SECRET_KEY=any-random-string
TMDB_API_KEY=your-tmdb-api-key
```

API runs at `http://localhost:8000` — docs at `http://localhost:8000/docs`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`. API calls are automatically proxied to the backend via Vite — no extra config needed.

## Running with Docker

### Prerequisites
- Docker Desktop running
- A root `.env` file with your TMDB API key:

```
TMDB_API_KEY=your-tmdb-api-key
```

### Start all services

```bash
docker compose up --build
```

This starts MySQL, the FastAPI backend, and the Nginx frontend together.

- Frontend: `http://localhost`
- Backend API: `http://localhost:8000`
- API docs: `http://localhost:8000/docs`

To stop: `Ctrl+C`, then `docker compose down`

## Build Progress

| Step | Description | Status |
|------|-------------|--------|
| 1 | Init repo & project structure | ✅ Done |
| 2 | FastAPI app skeleton | ✅ Done |
| 3 | MySQL schema & SQLAlchemy models | ✅ Done |
| 4 | Auth routes (register, login — JWT) | ✅ Done |
| 5 | TMDB API integration (search, detail) | ✅ Done |
| 6 | Reviews & favourites routes | ✅ Done |
| 7 | React + Vite scaffold | ✅ Done |
| 8 | Frontend: Auth pages & context | ✅ Done |
| 9 | Frontend: Movie search & detail pages | ✅ Done |
| 10 | Frontend: Reviews & favourites UI | ✅ Done |
| 11 | Docker Compose + deployment configs | ✅ Done |
| 12 | Docker build optimisation (.dockerignore) | ✅ Done |
| 13 | README: Docker & local dev setup docs | ✅ Done |
| 14 | Frontend: Styling overhaul | ✅ Done |
| 15 | AI: Recommended movies based on favourites | ✅ Done |
| 16 | Deploy to Railway | ✅ Done |
| 17 | Reviews: show username, timestamp, edit button | ⬜ Not started |
| 18 | UI: Toast notifications, skeleton loaders, page transitions | ⬜ Not started |
| 19 | UI: Dark/light mode toggle | ⬜ Not started |
| 20 | Feature: User profile page (stats, review count, favourites) | ⬜ Not started |
| 21 | Feature: My Reviews page | ⬜ Not started |
| 22 | Feature: Search filters (genre, year, rating) | ⬜ Not started |
| 23 | Feature: Movie trailer embed (YouTube via TMDB) | ⬜ Not started |
| 24 | Feature: Similar movies on detail page | ⬜ Not started |
| 25 | Feature: Watchlist (separate from favourites) | ⬜ Not started |
| 26 | AI: Review summary — Claude summarises all reviews | ⬜ Not started |
| 27 | AI: Mood-based search — type a mood, Claude translates to queries | ⬜ Not started |
| 28 | UI: Mobile responsive layout | ⬜ Not started |
| 29 | UI: Movie detail hero banner (TMDB backdrop image) | ⬜ Not started |

## Environment Variables

Create a `.env` file in `backend/`:

```
DATABASE_URL=mysql+pymysql://user:password@localhost:3306/cinevault
SECRET_KEY=your-secret-key
TMDB_API_KEY=your-tmdb-api-key
```
