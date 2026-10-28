ALTER TABLE users
    ADD COLUMN IF NOT EXISTS avatar_data BYTEA,
    ADD COLUMN IF NOT EXISTS avatar_mime_type VARCHAR(32);

UPDATE users
SET avatar_url = NULL
WHERE avatar_url LIKE '/uploads/avatars/%';
