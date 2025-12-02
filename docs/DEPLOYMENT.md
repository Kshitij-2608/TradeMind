# 🚀 Deployment Guide: Import/Export AI Analyzer

This guide will help you deploy your project to the web for **FREE** using Vercel and Neon (PostgreSQL).

## 1. Database Setup (Free Tier)

We will use **Neon** (or Supabase) for a free PostgreSQL database.

1.  Go to [Neon.tech](https://neon.tech) and Sign Up.
2.  Create a new Project (e.g., `import-export-db`).
3.  Copy the **Connection String** (it looks like `postgres://user:pass@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require`).
4.  **Important:** Add `?pgbouncer=true&connect_timeout=15` to the end of the URL if you are using serverless functions (optional but recommended).

## 2. Environment Variables

You need to set these environment variables in your Vercel project settings later.

```env
DATABASE_URL="your_postgres_connection_string_from_step_1"
NEXTAUTH_URL="https://your-project-name.vercel.app"
NEXTAUTH_SECRET="generate_a_random_string_here"
GOOGLE_API_KEY="your_gemini_api_key"
```

## 3. Deploy to Vercel

1.  Push your code to **GitHub**.
2.  Go to [Vercel.com](https://vercel.com) and Sign Up/Login.
3.  Click **"Add New..."** -> **"Project"**.
4.  Import your GitHub repository.
5.  **Configure Project:**
    *   **Framework Preset:** Next.js
    *   **Root Directory:** `./` (default)
    *   **Build Command:** `npx prisma generate && next build` (Vercel usually detects this, but ensure `prisma generate` runs).
    *   **Environment Variables:** Add the variables from Step 2.
6.  Click **Deploy**.

## 4. Post-Deployment Database Setup

Once deployed, Vercel will build your app. However, your database is empty. You need to push the schema.

**Option A: Run from Local Machine (Easiest)**
1.  In your local project, create a `.env` file (if not exists) and add `DATABASE_URL`.
2.  Run:
    ```bash
    npx prisma db push
    ```
    This creates the tables in your online database.

**Option B: Vercel Build Command**
You can update your "Build Command" in Vercel settings to:
`npx prisma db push && next build`
(Note: This is risky for production as it can alter DB schema automatically, but fine for this prototype).

## 5. Verify

1.  Open your Vercel URL.
2.  Login.
3.  Upload a dataset.
4.  Click **"Save to Cloud"**.
5.  If successful, your data is now persisted in the database!

## Free Tier Limits (Enforced in Code)
*   **Max Records per Dataset:** 500
*   **Max Datasets per User:** 5
*   **Gemini API:** Free tier has rate limits (approx 15 RPM).

Enjoy your AI-powered Dashboard! 🌍
