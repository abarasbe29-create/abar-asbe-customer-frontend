# Abar Asbe Customer Portal — Vercel Migration

This project moves only the customer-facing `Customer.html` to Vercel. The existing Google Apps Script + Google Sheet backend remains the source of truth.

## Files
- `index.html` — current customer frontend with a compatibility bridge.
- `api/bridge.js` — Vercel same-origin API proxy to the existing Apps Script `doPost(e)`.
- `package.json` — minimal Vercel project metadata.

## Before deploying
The existing Apps Script project must already contain the new customer `doPost(e)` bridge and that deployment must be updated. Do not replace the existing live customer deployment.

## Vercel environment variable
Create:
`GAS_BACKEND_URL` = your existing Apps Script `/exec` URL.

A fallback URL is already present in `api/bridge.js`, so the project can still work if the environment variable is omitted, but setting it in Vercel is recommended.

## Important
Do not change the existing Google Sheet, customer functions, Meta attribution logic, OTP flow, or order flow. Test the Vercel deployment before changing DNS or Meta Ads destinations.
