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

To store centrally, add a private form/backend endpoint before `script.js` loads:

```html
<script>
  window.RESEARCH_MARKET_SIGNUP_ENDPOINT = "https://your-private-form-endpoint.example/lead";
</script>
```

Until an endpoint is configured, submissions are preserved in the visitor browser localStorage and downloaded as structured JSON so no data is silently lost.
