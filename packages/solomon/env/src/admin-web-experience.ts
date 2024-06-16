// src/env.mjs

import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  shared: {
    NODE_ENV: z.enum(['development', 'test', 'production']).optional(),
  },
  /*
   * Serverside Environment variables, not available on the client.
   * Will throw if you access these variables on the client.
   */
  server: {
    // Postgres URL: https://vercel.com/docs/connect/database-url#overview
    POSTGRES_PRISMA_URL: z.string().url(),
    // Non Pooling Postgres URL: https://vercel.com/docs/connect/database-url#overview
    POSTGRES_URL_NON_POOLING: z.string().min(1),
    // Google API Key: https://developers.google.com/maps/documentation/javascript/get-api-key
    GOOGLE_CLIENT_ID: z.string().min(1),
    // Google Client Secret: https://developers.google.com/maps/documentation/javascript/get-api-key
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    // Only for production – generate one here: https://generate-secret.vercel.app/32
    NEXTAUTH_SECRET: z.string().min(1),
    // Auth0 URL: https://auth0.com/docs/quickstart/webapp/nextjs/
    NEXTAUTH_URL: z.string().min(1),
    // The node environment (development, test, production)
    NODE_ENV: z.string().min(1),
    // Jwt token key
    NEXT_JWT_TOKEN_KEY: z.string().min(1),
    // Mixpanel Token
    MIXPANEL_TOKEN: z.string().min(1),
    // Algolia App Id
    ALGOLIA_APP_ID: z.string().min(1),
    // Algolia Search Api Key
    ALGOLIA_SEARCH_API_KEY: z.string().min(1),
    AUTH0_SECRET: z.string().min(1),
    AUTH0_BASE_URL: z.string().min(1),
    AUTH0_ISSUER_BASE_URL: z.string().min(1),
    AUTH0_CLIENT_ID: z.string().min(1),
    AUTH0_CLIENT_SECRET: z.string().min(1),
    AUTH0_AUDIENCE: z.string().min(1),
    TIPTAP_COLLAB_SECRET: z.string().min(1),
    TIPTAP_AI_SECRET: z.string().min(1),
    OPENAI_API_KEY: z.string().min(1),
    KV_REST_API_READ_ONLY_TOKEN: z.string().min(1),
    KV_REST_API_TOKEN: z.string().min(1),
    KV_REST_API_URL: z.string().min(1),
    KV_URL: z.string().min(1),
    CANNY_APP_ID: z.string().min(1),
    CANNY_BOARD_TOKEN: z.string().min(1),
    SENTRY_AUTH_TOKEN: z.string().min(1),
  },
  /*
   * Environment variables available on the client (and server).
   *
   * 💡 You'll get type errors if these are not prefixed with NEXT_PUBLIC_.
   */
  client: {
    NEXT_PUBLIC_USER_ID_KEY: z.string().min(1),
    NEXT_PUBLIC_USER_PROFILE_ID_KEY: z.string().min(1),
    NEXT_PUBLIC_USER_PROFILE_KEY: z.string().min(1),
    NEXT_PUBLIC_USER_ACCOUNT_KEY: z.string().min(1),
    NEXT_PUBLIC_PROFILE_PICTURE: z.string().min(1),
    NEXT_PUBLIC_ALGOLIA_INDEX: z.string().min(1),
    NEXT_PUBLIC_BACKEND_URL: z.string().min(1),
    NEXT_PUBLIC_TIPTAP_COLLAB_APP_ID: z.string().min(1),
    NEXT_PUBLIC_COLLAB_DOC_PREFIX: z.string().min(1),
    NEXT_PUBLIC_TIPTAP_AI_APP_ID: z.string().min(1),
  },
  /*
   * Due to how Next.js bundles environment variables on Edge and Client,
   * we need to manually destructure them to make sure all are included in bundle.
   *
   * 💡 You'll get type errors if not all variables from `server` & `client` are included here.
   */
  experimental__runtimeEnv: {
    NEXT_PUBLIC_USER_ID_KEY: process.env['NEXT_PUBLIC_USER_ID_KEY'],
    NEXT_PUBLIC_USER_PROFILE_ID_KEY:
      process.env['NEXT_PUBLIC_USER_PROFILE_ID_KEY'],
    NEXT_PUBLIC_USER_PROFILE_KEY: process.env['NEXT_PUBLIC_USER_PROFILE_KEY'],
    NEXT_PUBLIC_USER_ACCOUNT_KEY: process.env['NEXT_PUBLIC_USER_ACCOUNT_KEY'],
    NEXT_PUBLIC_PROFILE_PICTURE: process.env['NEXT_PUBLIC_PROFILE_PICTURE'],
    NEXT_PUBLIC_ALGOLIA_INDEX: process.env['NEXT_PUBLIC_ALGOLIA_INDEX'],
    NEXT_PUBLIC_BACKEND_URL: process.env['NEXT_PUBLIC_BACKEND_URL'],
    NEXT_PUBLIC_TIPTAP_COLLAB_APP_ID:
      process.env['NEXT_PUBLIC_TIPTAP_COLLAB_APP_ID'],
    NEXT_PUBLIC_COLLAB_DOC_PREFIX: process.env['NEXT_PUBLIC_COLLAB_DOC_PREFIX'],
    NEXT_PUBLIC_TIPTAP_AI_APP_ID: process.env['NEXT_PUBLIC_TIPTAP_AI_APP_ID'],
    NODE_ENV: process.env.NODE_ENV,
  },
  emptyStringAsUndefined: true,
  skipValidation: !!process.env['SKIP_ENV_VALIDATION'],
});
