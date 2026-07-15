import 'dotenv/config';
import { defineConfig } from 'prisma/config';

console.log(process.env.DATABASE_URL);

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
  migrations: {
    seed: 'ts-node prisma/seed.ts',
  },
});
