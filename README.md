# Social Media AI Platform

A full-stack application for managing social media content with AI assistance.

## Overview

This project includes:
- `backend/` — Express + MongoDB API for authentication, content scheduling, and AI-powered chatbot support.
- `frontend/` — React application for dashboard, chatbot interaction, post scheduling, and calendar views.

## Features

- User registration and login
- JWT-based authentication
- Post scheduling for multiple platforms
- AI chatbot for content strategy and social media guidance
- Calendar view for scheduled posts
- Responsive dashboard with modern UI

## Prerequisites

- Node.js 18+ / npm
- MongoDB running locally or a MongoDB Atlas connection string
- OpenAI API key for AI features (optional but recommended)

## Setup

### Backend

1. Install dependencies:

```bash
cd backend
npm install
```

2. Create and configure `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/social_media_ai_platform
JWT_SECRET=your_super_secure_jwt_secret_key
OPENAI_API_KEY=your_openai_api_key
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_ACCESS_TOKEN=your_twitter_access_token
TWITTER_ACCESS_TOKEN_SECRET=your_twitter_access_token_secret
```

> If you do not have a remote MongoDB URI, the backend will attempt to use local MongoDB at `mongodb://127.0.0.1:27017/social_media_ai_platform`.

3. Start backend:

```bash
npm run start
```

### Frontend

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Start frontend:

```bash
npm start
```

The frontend should launch in the browser and typically runs on `http://localhost:3000` or an alternate port if `3000` is in use.

## API Endpoints

- `GET /api/health` — Health check
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and receive JWT
- `POST /api/posts` — Create a scheduled post
- `GET /api/posts` — Retrieve user posts
- `PUT /api/posts/:postId` — Update a post
- `DELETE /api/posts/:postId` — Delete a post
- `POST /api/posts/:postId/publish` — Publish a post immediately
- `POST /api/chatbot/chat` — Chat with AI assistant

## Notes

- The backend currently uses a simulated Twitter posting service for demo purposes.
- The AI chatbot requires a valid `OPENAI_API_KEY` to generate responses.
- Ensure `JWT_SECRET` is set to a strong value before using the app in production.

## Troubleshooting

- If backend fails to connect to MongoDB, verify `MONGODB_URI` and confirm MongoDB is running.
- If frontend does not display, confirm that dependencies are installed and the app is started from `frontend/`.
- If you see warnings about `3000` being in use, accept the alternate port prompt.

## Project Structure

- `backend/`
  - `server.js` — Express server entrypoint
  - `routes/` — API route definitions
  - `models/` — Mongoose schemas
  - `services/` — AI and third-party integrations
  - `middleware/` — Authentication middleware
- `frontend/`
  - `src/` — React application source
  - `public/` — Static assets

---

For development, run backend and frontend in separate terminal sessions. This README provides the core commands and environment details needed to start the full project.
