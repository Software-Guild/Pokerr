# Poker backend

## Local setup

1. Copy `.env.example` to `.env` and fill in the values. `DATABASE_URL` must point to your local PostgreSQL `poker` database.
2. In Google Cloud Console, add `http://localhost:5000/auth/google/callback` under **Authorized redirect URIs** for this OAuth client.
3. Generate the client and create the database table:

   ```powershell
   npm run prisma:generate
   npm run prisma:migrate -- --name init
   ```

4. Run `npm run dev`. The frontend runs separately on `http://localhost:5173`.

The browser begins sign-in at `GET /auth/google`. On return, the backend verifies Google's ID token, creates or updates the user, issues a seven-day JWT as the `poker_auth` HTTP-only cookie, and redirects to the frontend.

For EC2, use HTTPS and set `NODE_ENV=production`, `BACKEND_URL` to your public HTTPS API origin, and `FRONTEND_URL` to your public frontend origin. Add the matching production callback (`https://your-api-domain/auth/google/callback`) in Google Cloud Console.
