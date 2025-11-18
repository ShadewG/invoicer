# Frontwind Invoice Generator

This repository contains the Frontwind LLC invoice generator UI (`invoice.html`) plus a lightweight Node/Express server so the app can be hosted anywhere, including [Railway](https://railway.app/).

## Local development

```bash
cd invoicer
npm install
npm run dev
```

Visit `http://localhost:3000` in your browser.

## Deploying to Railway

1. Push this repo to GitHub (or any git host).
2. Create a new Railway project and select the repo. Railway automatically detects the `npm start` script.
3. Set the service root to the `invoicer` directory if the repo contains other files.
4. The default build command (`npm install`) and start command (`npm start`) work out of the box. No environment variables are required.

The Express server serves everything out of the project root, so `invoice.html` (and any future assets) are reachable at `/`.

## Notion integration

The web app performs all Notion API calls client-side. Ensure the browser running the invoice generator has network access to `https://api.notion.com`. No server-side secrets are stored.

## Dev utilities

- `pdf_dump.js`: quick Node script to dump the readable text from a generated invoice PDF. Helpful when verifying that PDF imports will parse correctly.
