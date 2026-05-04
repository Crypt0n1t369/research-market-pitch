const SIGNUP_ENDPOINT = window.RESEARCH_MARKET_SIGNUP_ENDPOINT || '';
const form = document.querySelector('#signupForm');
const statusEl = document.querySelector('#formStatus');

function serializeForm(formEl) {
  const data = Object.fromEntries(new FormData(formEl).entries());
  return {
    email: String(data.email || '').trim(),
    name: String(data.name || '').trim(),
    profile: String(data.profile || '').trim(),
    interests: String(data.interests || '').trim(),
    proof: String(data.proof || '').trim(),
    source: window.location.href,
    submittedAt: new Date().toISOString(),
  };
}

function storeLocalLead(lead) {
  const key = 'research-market-leads';
  const current = JSON.parse(localStorage.getItem(key) || '[]');
  current.push(lead);
  localStorage.setItem(key, JSON.stringify(current));
}

function downloadLead(lead) {
  const blob = new Blob([JSON.stringify(lead, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `research-market-lead-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function setStatus(message, type = '') {
  statusEl.textContent = message;
  statusEl.className = `form-status ${type}`.trim();
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const lead = serializeForm(form);
  storeLocalLead(lead);

  if (!SIGNUP_ENDPOINT) {
    downloadLead(lead);
    setStatus('Saved locally and downloaded as structured JSON. Connect a private form endpoint to store centrally.', 'ok');
    form.reset();
    return;
  }

  try {
    const response = await fetch(SIGNUP_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    setStatus('Submitted. We stored your context and will follow up.', 'ok');
    form.reset();
  } catch (error) {
    downloadLead(lead);
    setStatus('Could not reach the signup backend. Your structured signup was saved locally and downloaded.', 'error');
  }
});
