package com.Transendence.Backend;

import com.github.f4b6a3.uuid.UuidCreator;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "users")
@EntityListeners(AuditingEntityListener.class)
public class User {

    @Id
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id = UuidCreator.getTimeOrderedEpoch();

    @Column(name = "email", nullable = false, length = 255)
    private String email;

    @Column(name = "password_hash", length = 255)
    private String passwordHash;

    @Column(name = "oauth_42_id", length = 100)
    private String oauth42Id;

    @Column(name = "display_name", nullable = false, length = 100)
    private String displayName;

    @Column(name = "bio", columnDefinition = "text")
    private String bio;

    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;

    @Column(name = "is_online")
    private Boolean isOnline;

    @CreatedDate
    @Column(
        name = "created_at",
        nullable = false,
        updatable = false
    )
    private Instant createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    // Required by JPA
    protected User() {
    }
    // Getters
    public UUID getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public String getOauth42Id() {
        return oauth42Id;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getBio() {
        return bio;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public Boolean getIsOnline() {
        return isOnline;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    // Setters
    public void setEmail(String email) {
        this.email = email;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public void setOauth42Id(String oauth42Id) {
        this.oauth42Id = oauth42Id;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public void setIsOnline(Boolean isOnline) {
        this.isOnline = isOnline;
    }
}