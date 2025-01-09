# Wassup chat

Simple chatting application allowing for group and direct conversations implemented in [Nuxt.js](https://nuxt.com/).

## Setup

Make sure to install dependencies:

```bash
pnpm install
```

And initialize database with defined schema (we use sqlite as database backend)

```bash
pnpm prisma db push
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Production

Build the application for production:

```bash
pnpm build
```

Locally preview production build:

```bash
pnpm preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
