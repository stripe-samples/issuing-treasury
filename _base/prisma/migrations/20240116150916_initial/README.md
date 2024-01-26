# Migration `20240116150916_initial`

Created:

- `users` table retroactively if it doesn't exist because the initial setup for prisma was incorrect. We were using
  `npx prisma db push` which is meant more for quick prototyping rather than gradual append-only schema updates
