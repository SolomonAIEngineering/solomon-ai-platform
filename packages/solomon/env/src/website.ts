// env.mjs
import { createEnv } from '@t3-oss/env-nextjs';
import { vercel } from '@t3-oss/env-nextjs/presets';
import { z } from 'zod';

export const env = createEnv({
  extends: [vercel()],
  shared: {
    NODE_ENV: z.enum(['development', 'test', 'production']).optional(),
  },
  server: {
    PLAIN_API_KEY: z.string(),
    UPSTASH_REDIS_REST_URL: z.string(),
    UPSTASH_REDIS_REST_API_KEY: z.string(),
    SUPABASE_SERVICE_KEY: z.string(),
    RESEND_API_KEY: z.string(),
    LOOPS_API_KEY: z.string(),
  },
  client: {
    NEXT_PUBLIC_LOGSNAG_TOKEN: z.string(),
    NEXT_PUBLIC_LOGSNAG_PROJECT: z.string(),
    NEXT_PUBLIC_SUPABASE_URL: z.string(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
    NEXT_PUBLIC_SUPABASE_ID: z.string(),
    NEXT_PUBLIC_OPENPANEL_CLIENT_ID: z.string(),
  },
  experimental__runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_LOGSNAG_TOKEN: process.env['NEXT_PUBLIC_LOGSNAG_TOKEN'],
    NEXT_PUBLIC_LOGSNAG_PROJECT: process.env['NEXT_PUBLIC_LOGSNAG_PROJECT'],
    NEXT_PUBLIC_SUPABASE_URL: process.env['NEXT_PUBLIC_SUPABASE_URL'],
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'],
    NEXT_PUBLIC_SUPABASE_ID: process.env['NEXT_PUBLIC_SUPABASE_ID'],
    NEXT_PUBLIC_OPENPANEL_CLIENT_ID: process.env['NEXT_PUBLIC_OPENPANEL_CLIENT_ID'],
  },
  emptyStringAsUndefined: true,
  skipValidation: !!process.env['SKIP_ENV_VALIDATION'],
});

export default env;
