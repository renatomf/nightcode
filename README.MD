NightCode
A terminal-based AI coding agent.

Plan, chat, and build inside your local project with a Bun-powered CLI, Hono API, Prisma ORM, Clerk auth, and AI SDK streaming.


Bun  OpenTUI  React  Hono  Neon  Clerk  Polar  CodeRabbit  Sentry  Railway

Features
Terminal AI Chat - Run an AI coding assistant directly in your terminal with an OpenTUI and React interface
Plan and Build Modes - Use read-only planning tools or enable write, edit, and shell execution tools for implementation
Streaming Responses - Stream model output through the AI SDK with persisted session history
Local Project Tools - Read files, list directories, glob, grep, write files, edit files, and run shell commands inside the current project
Multi-Model Support - Use supported Anthropic and OpenAI chat models from a shared model registry
Persistent Sessions - Store authenticated user sessions and messages in Postgres via Prisma
Clerk OAuth - Authenticate the CLI through a browser-based Clerk OAuth flow
Usage Billing - Meter AI usage as credits through Polar before allowing session and chat actions
Getting Started
Prerequisites
Bun installed
PostgreSQL database, such as Neon
Clerk application configured for OAuth
Anthropic and/or OpenAI API key
Polar account and credits meter
1. Clone and install
git clone git@github.com:code-with-antonio/nightcode.git
cd nightcode
bun install
2. Configure environment
cp .env.example .env
Fill in the required values:

API_URL=http://localhost:3000
DATABASE_URL=

ANTHROPIC_API_KEY=
OPENAI_API_KEY=

CLERK_FRONTEND_API=
CLERK_OAUTH_CLIENT_SECRET=
CLERK_OAUTH_CLIENT_ID=
CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
JWT_SECRET=jwt-secret

POLAR_ACCESS_TOKEN=
POLAR_PRODUCT_ID=
POLAR_SERVER=sandbox
POLAR_CREDITS_METER_ID=
3. Set up Clerk OAuth
NightCode authenticates the CLI through a browser-based Clerk OAuth flow. The CLI opens Clerk authorization in the browser, Clerk redirects to the server at /auth/callback, and the server forwards the authorization code back to the local CLI callback server.

In your Clerk dashboard:

Go to Configure > Developers > OAuth applications.
Click Add OAuth application.
Name it anything, for example NightCode.
Select these four scopes: openid, email, profile, and offline_access.
Turn on Public. This is required for the Authorization Code with PKCE flow used by the CLI.
Turn on Consent screen so users can approve the requested scopes.
Add http://localhost:3000/auth/callback as a redirect URI for local development.
Add your deployed callback URL as another redirect URI for production, for example https://your-deployment.com/auth/callback.
You can keep both local and production redirect URIs on the same OAuth application.

Copy the generated application credentials into .env:

Environment variable	Clerk value
CLERK_OAUTH_CLIENT_ID	OAuth application Client ID
CLERK_OAUTH_CLIENT_SECRET	OAuth application Client Secret
CLERK_FRONTEND_API	Clerk frontend API URL
CLERK_PUBLISHABLE_KEY	Clerk publishable key
CLERK_SECRET_KEY	Clerk secret key
4. Set up Polar billing
NightCode uses Polar credits to gate new work and bill completed AI usage. The server checks the user's active meter balance before creating sessions or sending chat requests, then ingests usage events after AI responses finish.

In your Polar dashboard, use sandbox mode for local development and create a meter with these exact settings:

Setting	Value
Meter name	nightcode_credits
Filter	Name equals nightcode_usage
Aggregation	Sum
Aggregation property	credits
The event name and metadata key must match exactly. The server sends usage events like this:

{
  name: "nightcode_usage",
  metadata: { credits }
}
Next, create a meter credits benefit and attach it to a one-time purchase product:

Create a benefit using the nightcode_credits meter.
Set the credited units, for example 1000 credits.
Create a one-time purchase product, for example $20 for 1000 credits.
Attach the credits benefit to that product.
Set the customer portal visibility to private so purchases happen through API-generated checkout links.
Then copy the required Polar values into .env:

Environment variable	Where to find it
POLAR_ACCESS_TOKEN	Polar developer settings token
POLAR_PRODUCT_ID	Product ID from the credits product
POLAR_SERVER	Use sandbox locally, production for live billing
POLAR_CREDITS_METER_ID	Meter ID from the meter URL
The CLI upgrade flow calls /billing/checkout, which opens a Polar checkout URL. The usage flow calls /billing/portal, which opens the customer's Polar portal.

5. Set up the database
Generate the Prisma client:

bun run --cwd packages/database db:generate
Apply your Prisma schema to the configured Postgres database using your preferred Prisma workflow.

6. Run the server
bun run dev:server
The API runs on http://localhost:3000.

7. Run the CLI
In another terminal:

bun run dev:cli
To build and link the local CLI binary:

bun run link:cli
nightcode
Project Structure
packages/
├── cli/                         # OpenTUI + React terminal client
│   ├── bin/                     # nightcode executable shim
│   └── src/
│       ├── components/          # Terminal UI components, dialogs, messages
│       ├── hooks/               # Chat and UI hooks
│       ├── layouts/             # Root terminal layouts
│       ├── lib/                 # API client, auth, OAuth, local tool execution
│       ├── providers/           # Dialog, keyboard, prompt, theme, toast providers
│       └── screens/             # Home, new session, and session screens
├── database/                    # Prisma schema, generated client, database exports
├── server/                      # Hono API for auth, billing, sessions, and chat
└── shared/                      # Shared schemas, tool contracts, and model registry
Scripts
Command	Description
bun run dev:cli	Start the CLI in watch mode
bun run dev:server	Start the Hono server with hot reload
bun run build:cli	Build the CLI package
bun run link:cli	Build and link the nightcode executable
bun run --cwd packages/database db:generate	Generate the Prisma client
Packages
Package	Description
@nightcode/cli	Terminal UI and client-side tool execution
@nightcode/server	Hono API, AI streaming, auth checks, and billing ingestion
@nightcode/database	Prisma client and database schema
@nightcode/shared	Shared Zod schemas, AI tool contracts, and model definitions
