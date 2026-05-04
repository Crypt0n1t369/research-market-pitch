# Research Market Pitch

Mobile-first investor website for the research-market pivot.

Live site: https://crypt0n1t369.github.io/research-market-pitch/

## Signup storage

GitHub Pages is static and cannot securely store submissions by itself. The signup form is structured around this lead schema:

```json
{
  "email": "person@example.com",
  "name": "Person Name",
  "profile": "Investor / fund",
  "interests": "Topics or expertise",
  "proof": "Capital, track record, institution, publications, etc.",
  "source": "page URL",
  "submittedAt": "ISO timestamp"
}
```

The live site is wired to this private endpoint:

```text
https://research-market-signups.kristapsbarons369.workers.dev/submit
```

Submissions are stored in Cloudflare D1. If the endpoint is unreachable, submissions are preserved in the visitor browser localStorage and downloaded as structured JSON so no data is silently lost.

Admin export is available at `/submissions` with the saved `SIGNUPS_ADMIN_TOKEN`.
