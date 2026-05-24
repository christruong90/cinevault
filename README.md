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

## Getting Started

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API docs available at `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Create a `.env` file in `backend/`:

```
DATABASE_URL=mysql+pymysql://user:password@localhost:3306/cinevault
SECRET_KEY=your-secret-key
TMDB_API_KEY=your-tmdb-api-key
```
