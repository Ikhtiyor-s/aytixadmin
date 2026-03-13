-- AyTiX Marketplace Database Migration
-- Run this on production server to create all tables

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============ ENUMS ============
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'seller', 'admin');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE product_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE project_status AS ENUM ('active', 'inactive');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE content_status AS ENUM ('active', 'inactive');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE target_audience AS ENUM ('all', 'users', 'sellers', 'admins');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE message_status AS ENUM ('new', 'read', 'replied', 'archived');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE partner_status AS ENUM ('active', 'inactive', 'pending');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE integration_status AS ENUM ('active', 'inactive', 'coming_soon');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ============ USERS TABLE ============
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(20) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255),
    profile_image VARCHAR(500),
    role VARCHAR(20) DEFAULT 'user' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ============ CATEGORIES TABLE ============
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============ CATEGORY_PROJECTS TABLE ============
CREATE TABLE IF NOT EXISTS category_projects (
    id SERIAL PRIMARY KEY,
    name_uz VARCHAR(255) NOT NULL,
    name_ru VARCHAR(255),
    name_en VARCHAR(255),
    description_uz TEXT,
    description_ru TEXT,
    description_en TEXT,
    icon VARCHAR(50),
    "order" INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_category_projects_name_uz ON category_projects(name_uz);
CREATE INDEX IF NOT EXISTS idx_category_projects_is_active ON category_projects(is_active);

-- ============ SUBCATEGORY_PROJECTS TABLE ============
CREATE TABLE IF NOT EXISTS subcategory_projects (
    id SERIAL PRIMARY KEY,
    name_uz VARCHAR(255) NOT NULL,
    name_ru VARCHAR(255),
    name_en VARCHAR(255),
    category_id INTEGER REFERENCES category_projects(id) ON DELETE CASCADE NOT NULL,
    "order" INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_subcategory_projects_category_id ON subcategory_projects(category_id);

-- ============ PRODUCTS TABLE ============
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(12, 2) NOT NULL,
    stock INTEGER DEFAULT 0 NOT NULL,
    image_url VARCHAR(500),
    video_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'pending' NOT NULL,
    seller_id INTEGER REFERENCES users(id) NOT NULL,
    category_id INTEGER REFERENCES categories(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_products_seller_id ON products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);

-- ============ ORDERS TABLE ============
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    total_amount DECIMAL(12, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' NOT NULL,
    buyer_id INTEGER REFERENCES users(id) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- ============ ORDER_ITEMS TABLE ============
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    quantity INTEGER NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    product_id INTEGER REFERENCES products(id) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- ============ PROJECTS TABLE ============
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    name_uz VARCHAR(255) NOT NULL,
    name_ru VARCHAR(255),
    name_en VARCHAR(255),
    description_uz TEXT NOT NULL,
    description_ru TEXT,
    description_en TEXT,
    category VARCHAR(255) NOT NULL,
    subcategory VARCHAR(255),
    technologies JSON,
    features JSON,
    integrations JSON,
    color VARCHAR(100) DEFAULT 'from-primary-500 to-primary-600',
    image_url VARCHAR(500),
    video_url VARCHAR(500),
    images JSON,
    views INTEGER DEFAULT 0,
    favorites INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' NOT NULL,
    is_top BOOLEAN DEFAULT FALSE,
    is_new BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_is_top ON projects(is_top);

-- ============ NEWS TABLE ============
CREATE TABLE IF NOT EXISTS news (
    id SERIAL PRIMARY KEY,
    title_uz VARCHAR(500) NOT NULL,
    title_ru VARCHAR(500),
    title_en VARCHAR(500),
    content_uz TEXT NOT NULL,
    content_ru TEXT,
    content_en TEXT,
    image_url VARCHAR(500),
    video_url VARCHAR(500),
    target VARCHAR(20) DEFAULT 'all',
    views INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

-- ============ BANNERS TABLE ============
CREATE TABLE IF NOT EXISTS banners (
    id SERIAL PRIMARY KEY,
    title_uz VARCHAR(500) NOT NULL,
    title_ru VARCHAR(500),
    title_en VARCHAR(500),
    description_uz TEXT,
    description_ru TEXT,
    description_en TEXT,
    image_url VARCHAR(500),
    video_url VARCHAR(500),
    link_url VARCHAR(500),
    project_id INTEGER,
    "order" INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_banners_status ON banners(status);
CREATE INDEX IF NOT EXISTS idx_banners_order ON banners("order");

-- ============ NOTIFICATIONS TABLE ============
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    title_uz VARCHAR(500) NOT NULL,
    title_ru VARCHAR(500),
    title_en VARCHAR(500),
    message_uz TEXT,
    message_ru TEXT,
    message_en TEXT,
    icon VARCHAR(50),
    target VARCHAR(20) DEFAULT 'all',
    scheduled_at TIMESTAMPTZ,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

-- ============ MESSAGES TABLE ============
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(500) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'new',
    reply TEXT,
    replied_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);

-- ============ PARTNERS TABLE ============
CREATE TABLE IF NOT EXISTS partners (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo_url VARCHAR(500),
    website VARCHAR(500),
    description_uz TEXT,
    description_ru TEXT,
    description_en TEXT,
    partner_type VARCHAR(100),
    "order" INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

-- ============ INTEGRATIONS TABLE ============
CREATE TABLE IF NOT EXISTS integrations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(50),
    description_uz TEXT,
    description_ru TEXT,
    description_en TEXT,
    category VARCHAR(100),
    docs_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

-- ============ INTEGRATION_PROJECTS TABLE ============
CREATE TABLE IF NOT EXISTS integration_projects (
    id SERIAL PRIMARY KEY,
    name_uz VARCHAR(255) NOT NULL,
    name_ru VARCHAR(255),
    name_en VARCHAR(255),
    description_uz TEXT,
    description_ru TEXT,
    description_en TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

-- ============ CONNECTED_INTEGRATIONS TABLE ============
CREATE TABLE IF NOT EXISTS connected_integrations (
    id SERIAL PRIMARY KEY,
    integration_project_id INTEGER REFERENCES integration_projects(id),
    integration_id VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    config JSON DEFAULT '{}' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_connected_integrations_project_id ON connected_integrations(integration_project_id);
CREATE INDEX IF NOT EXISTS idx_connected_integrations_integration_id ON connected_integrations(integration_id);

-- ============ OTP_REQUESTS TABLE ============
CREATE TABLE IF NOT EXISTS otp_requests (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(50),
    email VARCHAR(255),
    otp_code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    attempts INTEGER DEFAULT 0,
    blocked_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_otp_requests_phone ON otp_requests(phone);
CREATE INDEX IF NOT EXISTS idx_otp_requests_email ON otp_requests(email);

-- ============ PASSWORD_RESETS TABLE ============
CREATE TABLE IF NOT EXISTS password_resets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    attempts INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_password_resets_user_id ON password_resets(user_id);

-- ============ TELEGRAM_USERS TABLE ============
CREATE TABLE IF NOT EXISTS telegram_users (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(50) UNIQUE NOT NULL,
    chat_id VARCHAR(50) UNIQUE NOT NULL,
    telegram_username VARCHAR(100),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_telegram_users_phone ON telegram_users(phone);
CREATE INDEX IF NOT EXISTS idx_telegram_users_chat_id ON telegram_users(chat_id);

-- ============ AI_FEATURES TABLE ============
CREATE TABLE IF NOT EXISTS ai_features (
    id SERIAL PRIMARY KEY,
    name_uz VARCHAR(255) NOT NULL,
    name_ru VARCHAR(255),
    name_en VARCHAR(255),
    description_uz TEXT,
    description_ru TEXT,
    description_en TEXT,
    icon VARCHAR(50),
    category VARCHAR(100),
    is_available BOOLEAN DEFAULT TRUE,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

-- ============ ADD MISSING COLUMNS (for existing tables) ============
-- Add video_url to banners if not exists
DO $$
BEGIN
    ALTER TABLE banners ADD COLUMN video_url VARCHAR(500);
EXCEPTION WHEN duplicate_column THEN
    NULL;
END $$;

-- Add video_url to news if not exists
DO $$
BEGIN
    ALTER TABLE news ADD COLUMN video_url VARCHAR(500);
EXCEPTION WHEN duplicate_column THEN
    NULL;
END $$;

-- Add video_url to projects if not exists
DO $$
BEGIN
    ALTER TABLE projects ADD COLUMN video_url VARCHAR(500);
EXCEPTION WHEN duplicate_column THEN
    NULL;
END $$;

-- Add images to projects if not exists
DO $$
BEGIN
    ALTER TABLE projects ADD COLUMN images JSON;
EXCEPTION WHEN duplicate_column THEN
    NULL;
END $$;

-- ============ CREATE DEFAULT ADMIN USER ============
INSERT INTO users (phone, username, hashed_password, full_name, role, is_active)
VALUES ('+998901234567', 'admin', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VGUw/pFg.rJkmi', 'Admin User', 'admin', TRUE)
ON CONFLICT (username) DO NOTHING;

-- Print success message
SELECT 'Migration completed successfully!' as status;
