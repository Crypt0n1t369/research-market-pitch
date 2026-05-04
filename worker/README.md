# Research Market signup endpoint

Cloudflare Worker + D1 endpoint for private signup storage.

## Routes

- `POST /submit` — public form endpoint. Stores structured signup rows.
- `GET /submissions` — private admin export. Requires `Authorization: Bearer <ADMIN_TOKEN>`.
- `GET /health` — health check.

## Deploy

```bash
cd worker
wrangler login
wrangler d1 create research_market_signups
# Copy the returned database_id into wrangler.toml
wrangler d1 execute research_market_signups --file=./schema/schema.sql --remote
wrangler secret put ADMIN_TOKEN
wrangler deploy
```

Then set the site endpoint before `script.js` loads:

```html
<script>
  window.RESEARCH_MARKET_SIGNUP_ENDPOINT = "https://research-market-signups.<your-subdomain>.workers.dev/submit";
</script>
```

View submissions:

```bash
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  https://research-market-signups.<your-subdomain>.workers.dev/submissions
```
