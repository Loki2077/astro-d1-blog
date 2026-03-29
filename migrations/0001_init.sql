PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  summary TEXT,
  cover_url TEXT,
  content TEXT NOT NULL,
  page_config TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(page_config)),
  status TEXT NOT NULL DEFAULT 'pub' CHECK (status IN ('draft', 'pub')),
  tags TEXT,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_posts_status_updated_at ON posts(status, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);

CREATE TRIGGER IF NOT EXISTS trg_posts_updated_at
AFTER UPDATE ON posts
FOR EACH ROW
WHEN NEW.updated_at = OLD.updated_at
BEGIN
  UPDATE posts
  SET updated_at = CURRENT_TIMESTAMP
  WHERE id = OLD.id;
END;

CREATE TABLE IF NOT EXISTS site_configs (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL CHECK (json_valid(value))
);

INSERT OR IGNORE INTO site_configs (key, value) VALUES
(
  'base',
  json('{
    "siteTitle": "Astro D1 Blog",
    "theme": "ink",
    "showSidebar": true,
    "navLinks": [{"name":"首页","url":"/"},{"name":"管理","url":"/admin"}]
  }')
);
