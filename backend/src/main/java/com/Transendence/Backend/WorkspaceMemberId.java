package com.Transendence.Backend;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Embeddable
public class WorkspaceMemberId implements Serializable {

    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "workspace_id")
    private UUID workspaceId;

    protected WorkspaceMemberId() {
    }

    public WorkspaceMemberId(UUID userId, UUID workspaceId) {
        this.userId = userId;
        this.workspaceId = workspaceId;
    }

    public UUID getUserId() {
        return userId;
    }

    public UUID getWorkspaceId() {
        return workspaceId;
    }

    @Override
    public boolean equals(Object object) {
        if (this == object) return true;
        if (!(object instanceof WorkspaceMemberId that)) return false;
        return Objects.equals(userId, that.userId)
            && Objects.equals(workspaceId, that.workspaceId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, workspaceId);
    }
}