ALTER TABLE service_bookings
    ADD COLUMN IF NOT EXISTS customer_uuid UUID REFERENCES users(id) ON DELETE RESTRICT,
    ADD COLUMN IF NOT EXISTS provider_uuid UUID REFERENCES users(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS service_key VARCHAR(80),
    ADD COLUMN IF NOT EXISTS service_name VARCHAR(150),
    ADD COLUMN IF NOT EXISTS provider_name VARCHAR(150),
    ADD COLUMN IF NOT EXISTS location VARCHAR(250),
    ADD COLUMN IF NOT EXISTS review_rating SMALLINT,
    ADD COLUMN IF NOT EXISTS review_comment VARCHAR(1000);

ALTER TABLE service_bookings
    DROP CONSTRAINT IF EXISTS chk_booking_status;

ALTER TABLE service_bookings
    ADD CONSTRAINT chk_booking_status
    CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'rejected'));

ALTER TABLE service_bookings
    DROP CONSTRAINT IF EXISTS chk_service_booking_review;

ALTER TABLE service_bookings
    ADD CONSTRAINT chk_service_booking_review
    CHECK (
        (review_rating IS NULL AND review_comment IS NULL)
        OR (
            review_rating BETWEEN 1 AND 5
            AND review_comment IS NOT NULL
            AND length(trim(review_comment)) > 0
        )
    );

CREATE INDEX IF NOT EXISTS service_bookings_customer_uuid_created_idx
    ON service_bookings (customer_uuid, created_at DESC);

CREATE INDEX IF NOT EXISTS service_bookings_provider_uuid_status_idx
    ON service_bookings (provider_uuid, status, created_at DESC);
