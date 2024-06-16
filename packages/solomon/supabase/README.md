# Supabase Local Development Guide

## Overview

This guide provides instructions to set up a local Supabase instance with essential features and third-party authentication. Follow the steps below to ensure your Supabase instance starts correctly and all required features are enabled.

## Prerequisites

Ensure you have the following prerequisites installed on your machine:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- [Deno](https://docs.deno.com/runtime/manual/getting_started/installation)

## Setup

1. **Clone the Repository**  
   Clone the repository to your local machine.

   ```bash
   git clone git@github.com:SolomonAIEngineering/solomon-ai-platform.git
   cd ./packages/supabase
   ```

2. **Create a `.env` File**  
   Create a `.env` file one directory above the supabase package root. This file should contain the following environment variables:

   ```env
   SUPABASE_AUTH_GITHUB_CLIENT_ID=
   SUPABASE_AUTH_GITHUB_SECRET=

   SUPABASE_AUTH_GOOGLE_CLIENT_ID=
   SUPABASE_AUTH_GOOGLE_SECRET=

   SUPABASE_AUTH_APPLE_CLIENT_ID=
   SUPABASE_AUTH_APPLE_SECRET=

   SUPABASE_AUTH_SLACK_CLIENT_ID=
   SUPABASE_AUTH_SLACK_SECRET=
   ```

   Fill in the values with your actual client IDs and secrets from the respective third-party providers.

3. **Start Supabase**  
   Use the Supabase CLI to start your local instance.

   ```bash
   supabase start
   ```

4. **Access Supabase Studio**  
   Once your Supabase instance is running, you can access Supabase Studio at `http://localhost:54323`. This is the web interface for managing your Supabase project.

## Third-Party Authentication

Supabase supports various third-party authentication providers. Ensure you have registered your application with each provider and obtained the necessary credentials. Below are the links to register and obtain credentials:

- **GitHub**: [Register a new OAuth application](https://github.com/settings/developers)
- **Google**: [Set up OAuth 2.0](https://console.developers.google.com/apis/credentials)
- **Apple**: [Set up Sign in with Apple](https://developer.apple.com/documentation/sign_in_with_apple)
- **Slack**: [Create a Slack app](https://api.slack.com/apps)

## Troubleshooting

- **Supabase instance fails to start**: Ensure Docker is running and the `.env` file is correctly placed with valid credentials.
- **Authentication issues**: Verify that the client IDs and secrets in the `.env` file are correct and correspond to your registered applications.

## Useful Commands

- **Stop Supabase**: `supabase stop`
- **Reset Supabase**: `supabase db reset`
- **Check Supabase Status**: `supabase status`

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase GitHub Repository](https://github.com/supabase/supabase)
- [Supabase Community](https://community.supabase.com/)

By following this guide, you should be able to set up and run a local Supabase instance with third-party authentication. If you encounter any issues, refer to the troubleshooting section or consult the Supabase documentation for further assistance.
