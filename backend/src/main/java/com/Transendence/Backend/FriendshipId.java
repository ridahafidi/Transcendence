package com.Transendence.Backend;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Embeddable
public class FriendshipId implements Serializable {

    @Column(name = "requester_id")
    private UUID requesterId;

    @Column(name = "addressee_id")
    private UUID addresseeId;

    protected FriendshipId() {
    }

    public FriendshipId(UUID requesterId, UUID addresseeId) {
        this.requesterId = requesterId;
        this.addresseeId = addresseeId;
    }

    public UUID getRequesterId() {
        return requesterId;
    }

    public UUID getAddresseeId() {
        return addresseeId;
    }

    @Override
    public boolean equals(Object object) {
        if (this == object) return true;
        if (!(object instanceof FriendshipId that)) return false;
        return Objects.equals(requesterId, that.requesterId)
            && Objects.equals(addresseeId, that.addresseeId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(requesterId, addresseeId);
    }
}