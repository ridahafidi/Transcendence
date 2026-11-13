CREATE TABLE users(
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(100),
    display_name VARCHAR(100),
    avatar_file_id bigint REFERENCES files(id),
    bio VARCHAR(250),
    global_role VARCHAR(50) NOT NULL DEFAULT 'GUEST' CHECK(global_role IN ('ADMIN', 'MODERATOR', 'USER', 'GUEST')),
    user_status VARCHAR(50) NOT NULL DEFAULT 'OFFLINE' CHECK(user_status IN ('ONLINE', 'OFFLINE', 'AWAY')),
    last_seen_at TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE oauth_accounts(
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id bigint NOT NULL REFERENCES users(id),
    provider VARCHAR(100) NOT NULL  DEFAULT '42',
    provider_user_id varchar(100) NOT NULL ,
    UNIQUE (provider, provider_user_id)
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW() 
);

CREATE TABLE ORGANIZATIONS(
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    description VARCHAR (250) NOT NULL,
    logo_file_id bigint NOT NULL,
    owner_id bigint NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);