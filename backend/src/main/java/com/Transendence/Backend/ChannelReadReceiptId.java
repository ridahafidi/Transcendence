package com.Transendence.Backend;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Embeddable
public class ChannelReadReceiptId implements Serializable {

    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "channel_id")
    private UUID channelId;

    protected ChannelReadReceiptId() {
    }

    public ChannelReadReceiptId(UUID userId, UUID channelId) {
        this.userId = userId;
        this.channelId = channelId;
    }

    public UUID getUserId() {
        return userId;
    }

    public UUID getChannelId() {
        return channelId;
    }

    @Override
    public boolean equals(Object object) {
        if (this == object) return true;
        if (!(object instanceof ChannelReadReceiptId that)) return false;
        return Objects.equals(userId, that.userId)
            && Objects.equals(channelId, that.channelId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, channelId);
    }
}