
# Boundless Saga Next.js Migration

This app is the Next.js 14+ migration of the original Vite+React+Supabase project. It includes:

- Next.js App Router (src/app)
- TypeScript, Tailwind CSS, ESLint
- Murim custom theme and animated backgrounds
- Placeholder API routes for Discord OAuth, registration, and login
- Migrated landing page and authentication UI

## Getting Started

Run the development server:

```bash
cd murim-game-next
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## Next Steps
- Implement Supabase and Discord OAuth logic in `/src/app/api/auth/*/route.ts`
- Migrate any additional components, logic, and styles as needed
- Update environment variables for Next.js and Vercel
