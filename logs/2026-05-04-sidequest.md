# 2026-05-04 — Research market pitch sidequest log

## Request/context
- Kristaps asked to convert the pitch from slides into a phone-first website.
- Added signup capture so visitors can leave email and key context about who they are.
- Then created a private form endpoint so submissions can be viewed.

## Repository/site
- Repo: https://github.com/Crypt0n1t369/research-market-pitch
- Local path: `/home/drg/projects/research-pitch-site`
- Live site: https://crypt0n1t369.github.io/research-market-pitch/

## Built/deployed
- Reworked `index.html`, `styles.css`, and `script.js` from slide deck into mobile-first website.
- Added signup form fields:
  - email
  - name
  - profile type
  - interests/topics/expertise
  - proof/capital/collaboration context
  - source URL and timestamp
- Created Cloudflare Worker + D1 backend in `worker/`:
  - Public submit route: `POST /submit`
  - Private admin export: `GET /submissions`
  - Health check: `GET /health`
- Deployed Worker:
  - Base URL: `https://research-market-signups.kristapsbarons369.workers.dev`
- D1 database:
  - name: `research_market_signups`
  - id: `41479d41-295e-4ccb-84ba-88f4435750fd`
- Wired GitHub Pages site to Worker submit endpoint.

## Secrets / safe storage
- Cloudflare account ID, account API token, and admin export token are stored locally at:
  - `/home/drg/.config/research-market-pitch/cloudflare.env`
- File permissions confirmed owner-only: `600 drg:drg`.
- Secret values are intentionally not logged here.

## Verification
- Cloudflare token access verified via API.
- D1 database schema applied remotely.
- Worker deployed successfully.
- `/health` returned ok.
- Test submission stored and admin export returned it.
- Test submission was deleted afterward.
- CORS preflight from GitHub Pages origin returned HTTP 200.
- Live GitHub Pages update confirmed contains the Worker submit endpoint.
- Real submission observed afterward:
  - email: `kristapsbarons369@gmail.com`
  - name/profile/interests/proof were test-like values.

## Cleanup
- No subagents were spawned for this sidequest.
- No local bot/process was left running for this sidequest.
- Temporary local `.wrangler` directory removed from repo working tree.

## Useful commands

View submissions from this machine:

```bash
source /home/drg/.config/research-market-pitch/cloudflare.env
curl -H "Authorization: Bearer $SIGNUPS_ADMIN_TOKEN" \
  https://research-market-signups.kristapsbarons369.workers.dev/submissions
```

Deploy Worker again:

```bash
cd /home/drg/projects/research-pitch-site/worker
source /home/drg/.config/research-market-pitch/cloudflare.env
npx wrangler deploy
```
