CREATE TABLE facilities (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    address VARCHAR(255),
    coordinates JSONB,
    contact_info JSONB
);

CREATE TABLE users (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    facility_id UUID REFERENCES facilities(id)
);

CREATE TABLE victims (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    case_number VARCHAR(255) NOT NULL UNIQUE,
    facility_id UUID NOT NULL REFERENCES facilities(id),
    province VARCHAR(255) NOT NULL,
    district VARCHAR(255) NOT NULL,
    recorded_at TIMESTAMP NOT NULL,
    sync_status VARCHAR(50) NOT NULL,
    local_id UUID,
    
    -- Physical Basic
    gender VARCHAR(50),
    age_group VARCHAR(50),
    
    -- Appearance
    height_range VARCHAR(50),
    body_type VARCHAR(50),
    skin_tone VARCHAR(50),
    eye_color VARCHAR(50),
    hair_color VARCHAR(50),
    hair_length VARCHAR(50),
    hair_type VARCHAR(50),
    facial_hair VARCHAR(50),
    
    -- Distinctive Features
    has_tattoo BOOLEAN,
    tattoo_location TEXT[],
    has_scar BOOLEAN,
    scar_location TEXT[],
    has_birthmark BOOLEAN,
    birthmark_location TEXT[],
    prosthetics TEXT[],
    wears_glasses VARCHAR(50),
    dental_features TEXT[],
    
    -- Accessories
    jewelry TEXT[],
    wears_headscarf VARCHAR(50),
    
    -- Clothing
    upper_clothing_color TEXT[],
    lower_clothing_color TEXT[],
    
    -- Health
    health_status VARCHAR(50),
    consciousness VARCHAR(50),
    chronic_conditions TEXT[],
    spoken_languages TEXT[],
    
    -- Photo
    photo_url VARCHAR(255),
    photo_hash VARCHAR(255),
    
    -- Audit
    created_by_id UUID NOT NULL REFERENCES users(id)
);

CREATE TABLE relative_sessions (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    phone_hash VARCHAR(255) NOT NULL,
    national_id_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    relationship VARCHAR(50) NOT NULL,
    otp_code VARCHAR(255),
    otp_expires_at TIMESTAMP,
    session_expires_at TIMESTAMP
);

CREATE TABLE search_logs (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    relative_session_id UUID NOT NULL REFERENCES relative_sessions(id),
    query_params JSONB NOT NULL,
    matched_victim_ids UUID[],
    searched_at TIMESTAMP NOT NULL
);
