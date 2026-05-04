CREATE TABLE IF NOT EXISTS signups (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  profile TEXT NOT NULL,
  interests TEXT NOT NULL,
  proof TEXT,
  source TEXT,
  user_agent TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_signups_created_at ON signups(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_signups_profile ON signups(profile);
