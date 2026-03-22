# Movie Recommendation System

Full-stack movie recommendation app with:

- `client/`: React + Vite frontend
- `server/`: Express BFF
- `supabase/`: SQL setup for interactions table

## Environment Files

Use the example files as templates:

- `client/.env.example`
- `server/.env.example`

Do not commit real `.env` files.

## Local Development

Frontend:

```bash
cd client
npm install
npm run dev
```

Backend:

```bash
cd server
npm install
npm start
```

## Deployment Notes

- Deploy `server/` separately as the backend service
- Deploy `client/` separately as the frontend
- Update `VITE_API_BASE_URL` in the frontend to point at the deployed backend
