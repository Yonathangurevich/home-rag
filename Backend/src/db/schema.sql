-- Home RAG schema (SQLite + sqlite-vec).
-- Foreign keys are only enforced when "PRAGMA foreign_keys = ON" is set on the connection (done in dal.ts).

CREATE TABLE IF NOT EXISTS entries (
    id              TEXT PRIMARY KEY,                   -- UUID
    title           TEXT NOT NULL,
    description     TEXT NOT NULL,
    content         TEXT NOT NULL,                      -- full original text
    current_version INTEGER NOT NULL DEFAULT 1,
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT NOT NULL DEFAULT (datetime('now')),
    deleted_at      TEXT
);

CREATE TABLE IF NOT EXISTS tags (
    id   INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS entry_tags (
    entry_id TEXT    NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
    tag_id   INTEGER NOT NULL REFERENCES tags(id)    ON DELETE CASCADE,
    PRIMARY KEY (entry_id, tag_id)
);

CREATE INDEX IF NOT EXISTS idx_entry_tags_tag ON entry_tags(tag_id);

-- Immutable full snapshots, one row per version:
CREATE TABLE IF NOT EXISTS entry_versions (
    entry_id      TEXT    NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
    version       INTEGER NOT NULL,
    title         TEXT    NOT NULL,
    description   TEXT    NOT NULL,
    content       TEXT    NOT NULL,
    tags_snapshot TEXT    NOT NULL DEFAULT '[]',        -- JSON array, e.g. ["typescript","auth"]
    created_at    TEXT    NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (entry_id, version)
);

-- One current searchable embedding per entry (sqlite-vec):
-- 768 = output size of EmbeddingGemma 2. Vectors are bound as Float32Array.
CREATE VIRTUAL TABLE IF NOT EXISTS entry_vectors USING vec0(
    entry_id      TEXT PRIMARY KEY,                     -- = entries.id
    embedding     FLOAT[768] distance_metric=cosine     -- appConfig.embeddingDimensions = 768
);
