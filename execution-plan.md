# Movie Recommendation System — Execution Plan

## ⚠️ IMPORTANT

You MUST follow this execution order strictly.
Do NOT jump steps.
Do NOT implement frontend before backend APIs are verified.

---

# 🧱 PHASE 0 — Project Setup

## Backend

* Initialize Express app (`/server`)
* Setup environment variables
* Install dependencies:

  * express
  * cors
  * dotenv
  * axios
  * supabase-js

## Frontend

* Initialize React app using Vite (`/client`)
* Setup basic folder structure

---

# 🔐 PHASE 1 — Supabase Setup

1. Create Supabase project
2. Enable Email/Password authentication
3. Create `interactions` table:

```sql
CREATE TABLE interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  movie_id text,
  event_type text,
  created_at timestamp DEFAULT now()
);
```

4. Store:

* SUPABASE_URL
* SUPABASE_SERVICE_KEY

---

# ⚙️ PHASE 2 — Backend Core (Express BFF)

## Step 1: Auth Middleware

* Verify Supabase JWT
* Extract `user_id`

---

## Step 2: Implement Routes

### POST /api/events

* Validate input
* Store in Supabase
* Forward to recommender
* Return success

---

### POST /api/recommendations

* Call recommender API
* Return response as-is

---

### GET /api/movies/popular

* Fetch from TMDB API
* Return simplified data

---

### GET /api/movies/search

* Fetch from TMDB search API
* Return simplified data

---

### GET /api/history

* Fetch user interactions
* Group into:

  * liked
  * watched
  * skipped

---

## ✅ VALIDATION STEP (MANDATORY)

Before moving forward:

* Test ALL endpoints using Postman or curl
* Ensure:

  * Auth works
  * DB writes correctly
  * Recommender responds correctly
  * TMDB fetch works

DO NOT proceed if any endpoint is broken

---

# 🎬 PHASE 3 — Frontend Auth

* Setup Supabase client
* Implement:

  * Signup
  * Login
  * Logout
* Store session
* Protect routes

---

# 🏠 PHASE 4 — Discover Page

* Fetch `/api/movies/popular`

* Implement search (`/api/movies/search`)

* Display movie grid:

  * poster
  * title
  * buttons (like/watch/skip)

* On click:

  * call `/api/events`

---

# 🤖 PHASE 5 — Recommendations Page

* Button: "Get Recommendations"
* Call `/api/recommendations`

Display:

* ranked list
* movie title
* score

---

# 👤 PHASE 6 — Profile Page

* Fetch `/api/history`
* Display:

  * liked movies
  * watched movies
  * skipped movies

---

# ⚠️ PHASE 7 — Error Handling

* Add loading states
* Add error messages
* Handle empty states

---

# 🧪 FINAL VALIDATION

System must support:

* User login/signup
* Movie browsing (TMDB)
* Interaction logging (DB + recommender)
* Recommendation retrieval
* History viewing

---

# 🚫 STRICT RULES

DO NOT:

* Add extra features (reviews, ratings, comments)
* Add pagination
* Add filters
* Add UI libraries
* Modify architecture

---

# 🎯 GOAL

A clean, minimal, fully working product with correct data flow:
Frontend → BFF → (Supabase + TMDB + Recommender)
