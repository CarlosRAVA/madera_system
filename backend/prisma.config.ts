import 'dotenv/config';
import { defineConfig } from 'prisma/config';

// Para migraciones y db push usamos la URL directa (session pooler, puerto 5432)
// Para la app en runtime usamos el transaction pooler (puerto 6543)
const migrationUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL!;

export default defineConfig({
  datasource: {
    url: migrationUrl,
  },
  migrations: {
    seed: 'ts-node prisma/seed.ts',
  },
});
