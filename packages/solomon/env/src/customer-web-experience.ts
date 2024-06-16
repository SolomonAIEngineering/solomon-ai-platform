// src/env.mjs

import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  shared: {
    NODE_ENV: z.enum(['development', 'test', 'production']).optional(),
    ENABLE_SHARE_FEATURE: z.boolean().optional(),
  },
  /*
   * Serverside Environment variables, not available on the client.
   * Will throw if you access these variables on the client.
   */
  server: {
    // Upstash redis url: https://upstash.com/docs/rest-api
    UPSTASH_REDIS_REST_URL: z.string().url(),
    // Uspstash redis token: https://upstash.com/docs/rest-api
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
    // Tavily API Key: https://tavily.com/
    TAVILY_API_KEY: z.string().min(1),
    // OpenAI API Key: https://platform.openai.com/docs/guides/authentication
    EXA_API_KEY: z.string().min(1),
    OPENAI_API_KEY: z.string().min(1),
    // Used to set the base URL path for OpenAI API requests.
    // If you need to set a BASE URL, uncomment and set the following
    OPENAI_API_BASE: z.string().optional(),
    // Used to set the model for OpenAI API requests.
    // If not set, the default is gpt-4o.
    OPENAI_API_MODEL: z.string().optional(),
    // Only writers can set a specific model. It must be compatible with the OpenAI API.
    USE_SPECIFIC_API_FOR_WRITER: z.boolean().optional(),
    SPECIFIC_API_BASE: z.string().optional(),
    SPECIFIC_API_MODEL: z.string().optional(),
    SPECIFIC_API_KEY: z.string().optional(),
    SPECIFIC_PROVIDER: z.string().optional(),
    // enable the share feature If you enable this feature, separate account management implementation is required.
    ENABLE_SHARE_FEATURE: z.boolean().optional(),
    // The node environment (development, test, production)
    NODE_ENV: z.string().min(1),
    // Jwt token key
    NEXT_JWT_TOKEN_KEY: z.string().min(1),
    // Mixpanel Token
    MIXPANEL_TOKEN: z.string().min(1),
    AUTH0_SECRET: z.string().min(1),
    AUTH0_BASE_URL: z.string().min(1),
    AUTH0_ISSUER_BASE_URL: z.string().min(1),
    AUTH0_CLIENT_ID: z.string().min(1),
    AUTH0_CLIENT_SECRET: z.string().min(1),
    AUTH0_AUDIENCE: z.string().min(1),
    TIPTAP_COLLAB_SECRET: z.string().min(1),
    TIPTAP_AI_SECRET: z.string().min(1),
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
    NEXT_PUBLIC_STATSIG_CLIENT_KEY: z.string().min(1),
    NEXT_PUBLIC_PAYMENT_PORTAL_LINK: z.string().min(1),
    NEXT_PUBLIC_REVALIDATE_INTERVAL: z.number().min(1),
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
    ENABLE_SHARE_FEATURE: process.env['ENABLE_SHARE_FEATURE'],
    NEXT_PUBLIC_STATSIG_CLIENT_KEY:
      process.env['NEXT_PUBLIC_STATSIG_CLIENT_KEY'],
    NEXT_PUBLIC_PAYMENT_PORTAL_LINK: process.env['NEXT_PAYMENT_PORTAL_LINK'],
    NEXT_PUBLIC_REVALIDATE_INTERVAL:
      process.env['NEXT_PUBLIC_REVALIDATE_INTERVAL'],
  },
  emptyStringAsUndefined: true,
  skipValidation: !!process.env['SKIP_ENV_VALIDATION'],
});
