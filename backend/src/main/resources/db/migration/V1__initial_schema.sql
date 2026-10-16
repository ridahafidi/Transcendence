-- 1. Users and organizations

CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255),
    oauth_42_id VARCHAR(100),
    display_name VARCHAR(100) NOT NULL,
    bio TEXT,
    avatar_url VARCHAR(500),
    is_online BOOLEAN,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE organizations (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP
);

-- 2. Tables referencing users or organizations

CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    token VARCHAR(500) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP
);

CREATE TABLE friendships (
    requester_id UUID REFERENCES users(id),
    addressee_id UUID REFERENCES users(id),
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    PRIMARY KEY (requester_id, addressee_id)
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    type VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN,
    created_at TIMESTAMP
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    action VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45),
    created_at TIMESTAMP
);

CREATE TABLE workspaces (
    id UUID PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP
);

-- 3. Workspace membership, channels and files

CREATE TABLE workspace_members (
    user_id UUID REFERENCES users(id),
    workspace_id UUID REFERENCES workspaces(id),
    role VARCHAR(50) NOT NULL,
    joined_at TIMESTAMP,
    PRIMARY KEY (user_id, workspace_id)
);

CREATE TABLE channels (
    id UUID PRIMARY KEY,
    workspace_id UUID REFERENCES workspaces(id),
    name VARCHAR(255) NOT NULL,
    is_private BOOLEAN,
    created_at TIMESTAMP
);

CREATE TABLE files (
    id UUID PRIMARY KEY,
    uploader_id UUID REFERENCES users(id),
    workspace_id UUID REFERENCES workspaces(id),
    file_name VARCHAR(255) NOT NULL,
    storage_path VARCHAR(500) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    size_bytes BIGINT NOT NULL,
    created_at TIMESTAMP
);

-- 4. Messages

CREATE TABLE messages (
    id UUID PRIMARY KEY,
    channel_id UUID REFERENCES channels(id),
    sender_id UUID REFERENCES users(id),
    recipient_id UUID REFERENCES users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP
);

-- 5. Channel read receipts

CREATE TABLE channel_read_receipts (
    user_id UUID REFERENCES users(id),
    channel_id UUID REFERENCES channels(id),
    last_read_message_id UUID REFERENCES messages(id),
    updated_at TIMESTAMP,
    PRIMARY KEY (user_id, channel_id)
);