# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:


## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


# Smart City Traffic Management — Frontend

This repo is a React + Vite frontend for a Smart City Traffic Management System.
It demonstrates an MVP that connects to Appwrite for authentication, databases,
functions, and (optionally) realtime updates.

Quick start
1. Copy `.env.example` to `.env` and set `VITE_APPWRITE_ENDPOINT` and `VITE_APPWRITE_PROJECT`.
	- If you have the Appwrite project ID and database ID (provided by the backend), set them in `.env` as `VITE_APPWRITE_PROJECT` and `VITE_APPWRITE_DATABASE`.
	- Do NOT commit secrets or API keys to source control. Use Appwrite Sites environment variables or CI secrets when deploying.
2. Install dependencies: `npm install`.
3. Run dev server: `npm run dev`.

Appwrite integration notes
- `src/services/appwrite.js` reads `VITE_APPWRITE_ENDPOINT` and `VITE_APPWRITE_PROJECT`.
- `src/services/database.js` contains helpers for fetching traffic data and incidents.
- `src/services/functions.js` has stubs to call Appwrite cloud functions (prediction/reporting).
- Realtime: `subscribeToTrafficUpdates` will attempt to wire Appwrite Realtime; if
	your environment doesn't have the Realtime SDK available, it falls back to a no-op.

Quick note about provided project/database identifiers

- If you were given an Appwrite project id or database id for the hackathon, place
	those values in `.env` as `VITE_APPWRITE_PROJECT` and `VITE_APPWRITE_DATABASE`.
- The frontend uses these env vars at build time. Example values you might have received:
	- project id: `par1raay2sahm8aarn1` (replace with your actual project id)
	- database id: `68b596a0003c2896aecb` (replace with the real database id)

If you want, I can help set up the Appwrite collections and provide a small
seed script to populate demo traffic/incident documents for your judges.

Deploying to Appwrite Sites (GitHub -> Sites)
1. Push this repo to GitHub.
2. In Appwrite console, create a new Site. Link it to your GitHub repo and set the
	 build command to `npm run build` and the output directory to `dist`.
3. Add the environment variables in Appwrite Sites settings (VITE_APPWRITE_ENDPOINT & VITE_APPWRITE_PROJECT).

If you want, I can help implement the Appwrite Realtime wiring, create a demo dataset,
or add GitHub Action workflow for automated deployments.
