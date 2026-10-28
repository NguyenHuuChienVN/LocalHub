ALTER TABLE users
    ADD COLUMN IF NOT EXISTS date_of_birth DATE,
    ADD COLUMN IF NOT EXISTS gender VARCHAR(10),
    ADD COLUMN IF NOT EXISTS city VARCHAR(100),
    ADD COLUMN IF NOT EXISTS district VARCHAR(100),
    ADD COLUMN IF NOT EXISTS address_line VARCHAR(250),
    ADD COLUMN IF NOT EXISTS bio VARCHAR(200);

ALTER TABLE users
    DROP CONSTRAINT IF EXISTS users_gender_check;

ALTER TABLE users
    ADD CONSTRAINT users_gender_check
    CHECK (gender IS NULL OR gender IN ('male', 'female', 'other'));