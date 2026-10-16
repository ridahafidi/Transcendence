package com.Transendence.Backend;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "workspace_members")
public class WorkspaceMember {

    @EmbeddedId
    private WorkspaceMemberId id;

    @MapsId("userId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @MapsId("workspaceId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workspace_id", nullable = false)
    private Workspace workspace;

    @Column(name = "role", nullable = false, length = 50)
    private String role;

    @Column(name = "joined_at")
    private LocalDateTime joinedAt;

    protected WorkspaceMember() {
    }

    public WorkspaceMemberId getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Workspace getWorkspace() {
        return workspace;
    }

    public void setWorkspace(Workspace workspace) {
        this.workspace = workspace;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public LocalDateTime getJoinedAt() {
        return joinedAt;
    }
}