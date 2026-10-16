package com.Transendence.Backend;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "channel_read_receipts")
public class ChannelReadReceipt {

    @EmbeddedId
    private ChannelReadReceiptId id;

    @MapsId("userId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @MapsId("channelId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "channel_id", nullable = false)
    private Channel channel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "last_read_message_id")
    private Message lastReadMessage;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    protected ChannelReadReceipt() {
    }

    public ChannelReadReceiptId getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Channel getChannel() {
        return channel;
    }

    public void setChannel(Channel channel) {
        this.channel = channel;
    }

    public Message getLastReadMessage() {
        return lastReadMessage;
    }

    public void setLastReadMessage(Message lastReadMessage) {
        this.lastReadMessage = lastReadMessage;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}