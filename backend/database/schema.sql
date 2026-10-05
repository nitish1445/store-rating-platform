-- PostgreSQL Database Schema

-- UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- 1. USERS TABLE

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(60) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    address VARCHAR(400) NOT NULL,
    password VARCHAR(255) NOT NULL,

    role VARCHAR(20) NOT NULL DEFAULT 'user',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Allowed roles
    CONSTRAINT users_role_check
        CHECK (role IN ('admin', 'user', 'owner')),

    -- Name must be 20-60 characters
    CONSTRAINT users_name_length_check
        CHECK (char_length(trim(name)) BETWEEN 20 AND 60),

    -- Address maximum 400 characters
    CONSTRAINT users_address_length_check
        CHECK (char_length(address) <= 400)
);

-- 2. STORES TABLE

CREATE TABLE IF NOT EXISTS stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    address VARCHAR(400) NOT NULL,

    -- UUID because users.id is UUID
    owner_id UUID NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Store owner must exist
    CONSTRAINT stores_owner_fk
        FOREIGN KEY (owner_id)
        REFERENCES users(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    -- Store name cannot be empty
    CONSTRAINT stores_name_check
        CHECK (char_length(trim(name)) > 0),

    -- Address maximum 400 characters
    CONSTRAINT stores_address_length_check
        CHECK (char_length(address) <= 400)
);

-- 3. RATINGS TABLE

CREATE TABLE IF NOT EXISTS ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- UUID because users.id is UUID
    user_id UUID NOT NULL,

    -- UUID because stores.id is UUID
    store_id UUID NOT NULL,

    rating INTEGER NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Rating must be between 1 and 5
    CONSTRAINT ratings_value_check
        CHECK (rating BETWEEN 1 AND 5),

    -- User must exist
    CONSTRAINT ratings_user_fk
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    -- Store must exist
    CONSTRAINT ratings_store_fk
        FOREIGN KEY (store_id)
        REFERENCES stores(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    -- One user can rate a store only once
    CONSTRAINT unique_user_store_rating
        UNIQUE (user_id, store_id)
);


-- 4. INDEXES

-- ----------------------------
-- Users
-- ----------------------------

CREATE INDEX IF NOT EXISTS idx_users_name
    ON users(name);

CREATE INDEX IF NOT EXISTS idx_users_email
    ON users(email);

CREATE INDEX IF NOT EXISTS idx_users_role
    ON users(role);


-- ----------------------------
-- Stores
-- ----------------------------

CREATE INDEX IF NOT EXISTS idx_stores_name
    ON stores(name);

CREATE INDEX IF NOT EXISTS idx_stores_address
    ON stores(address);

CREATE INDEX IF NOT EXISTS idx_stores_owner
    ON stores(owner_id);


-- ----------------------------
-- Ratings
-- ----------------------------

CREATE INDEX IF NOT EXISTS idx_ratings_user
    ON ratings(user_id);

CREATE INDEX IF NOT EXISTS idx_ratings_store
    ON ratings(store_id);

-- 5. UPDATED_AT TRIGGER FUNCTION

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. UPDATED_AT TRIGGERS

-- Users
DROP TRIGGER IF EXISTS update_users_updated_at
ON users;

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


-- Stores
DROP TRIGGER IF EXISTS update_stores_updated_at
ON stores;

CREATE TRIGGER update_stores_updated_at
BEFORE UPDATE ON stores
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


-- Ratings
DROP TRIGGER IF EXISTS update_ratings_updated_at
ON ratings;

CREATE TRIGGER update_ratings_updated_at
BEFORE UPDATE ON ratings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


-- 7. STORE RATING SUMMARY VIEW

CREATE OR REPLACE VIEW store_rating_summary AS
SELECT
    s.id AS store_id,
    s.name AS store_name,
    s.email AS store_email,
    s.address,
    s.owner_id,

    COALESCE(
        ROUND(AVG(r.rating)::numeric, 2),
        0
    ) AS average_rating,

    COUNT(r.id) AS total_ratings

FROM stores s

LEFT JOIN ratings r
    ON s.id = r.store_id

GROUP BY
    s.id,
    s.name,
    s.email,
    s.address,
    s.owner_id;


-- 8. USER RATING DETAILS VIEW

CREATE OR REPLACE VIEW user_rating_details AS
SELECT
    r.id AS rating_id,
    r.rating,
    r.created_at,
    r.updated_at,

    u.id AS user_id,
    u.name AS user_name,
    u.email AS user_email,
    u.address AS user_address,

    s.id AS store_id,
    s.name AS store_name,
    s.address AS store_address

FROM ratings r

INNER JOIN users u
    ON r.user_id = u.id

INNER JOIN stores s
    ON r.store_id = s.id;

-- SCHEMA COMPLET