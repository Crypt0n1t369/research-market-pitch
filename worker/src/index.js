const ALLOWED_ORIGINS = new Set([
  'https://crypt0n1t369.github.io',
  'http://127.0.0.1:8097',
  'http://localhost:8097',
]);

function corsHeaders(request) {
  const origin = request.headers.get('Origin') || '';
  const allowedOrigin = ALLOWED_ORIGINS.has(origin) ? origin : 'https://crypt0n1t369.github.io';
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Vary': 'Origin',
  };
}

function json(request, body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders(request),
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

function clean(value, max = 2000) {
  return String(value || '').trim().slice(0, max);
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function handleSubmit(request, env) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') return json(request, { ok: false, error: 'Invalid JSON' }, 400);

  const lead = {
    id: crypto.randomUUID(),
    email: clean(body.email, 320).toLowerCase(),
    name: clean(body.name, 180),
    profile: clean(body.profile, 120),
    interests: clean(body.interests, 2500),
    proof: clean(body.proof, 2500),
    source: clean(body.source, 500),
    userAgent: clean(request.headers.get('User-Agent'), 500),
    createdAt: new Date().toISOString(),
  };

  if (!isEmail(lead.email)) return json(request, { ok: false, error: 'Valid email is required' }, 400);
  if (!lead.name) return json(request, { ok: false, error: 'Name is required' }, 400);
  if (!lead.profile) return json(request, { ok: false, error: 'Profile type is required' }, 400);
  if (!lead.interests) return json(request, { ok: false, error: 'Interests/topics are required' }, 400);

  await env.DB.prepare(`
    INSERT INTO signups (id, email, name, profile, interests, proof, source, user_agent, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    lead.id,
    lead.email,
    lead.name,
    lead.profile,
    lead.interests,
    lead.proof,
    lead.source,
    lead.userAgent,
    lead.createdAt,
  ).run();

  return json(request, { ok: true, id: lead.id });
}

async function handleAdmin(request, env) {
  const auth = request.headers.get('Authorization') || '';
  const expected = `Bearer ${env.ADMIN_TOKEN || ''}`;
  if (!env.ADMIN_TOKEN || auth !== expected) {
    return json(request, { ok: false, error: 'Unauthorized' }, 401);
  }

  const result = await env.DB.prepare(`
    SELECT id, email, name, profile, interests, proof, source, user_agent, created_at
    FROM signups
    ORDER BY created_at DESC
    LIMIT 500
  `).all();

  return json(request, { ok: true, submissions: result.results || [] });
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders(request) });

    const url = new URL(request.url);
    if (url.pathname === '/submit' && request.method === 'POST') return handleSubmit(request, env);
    if (url.pathname === '/submissions' && request.method === 'GET') return handleAdmin(request, env);
    if (url.pathname === '/health') return json(request, { ok: true });

    return json(request, { ok: false, error: 'Not found' }, 404);
  },
};
