import { defineConfig, env } from 'prisma/config';
import { loadEnvConfig } from '@next/env';

// Load environment variables using Next.js native environment loader
loadEnvConfig(process.cwd());

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL') ?? 'file:./dev.db',
  },
});
