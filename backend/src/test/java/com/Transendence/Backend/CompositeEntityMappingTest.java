package com.Transendence.Backend;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class CompositeEntityMappingTest {

    @PersistenceContext
    private EntityManager entityManager;

    @Test
    void shouldPersistEntitiesWithCompositeIds() {
        User requester = new User();
        requester.setEmail("requester@example.com");
        requester.setDisplayName("requester");

        User addressee = new User();
        addressee.setEmail("addressee@example.com");
        addressee.setDisplayName("addressee");

        entityManager.persist(requester);
        entityManager.persist(addressee);

        Workspace workspace = new Workspace();
        workspace.setName("test-workspace");
        entityManager.persist(workspace);

        Channel channel = new Channel();
        channel.setName("general");
        channel.setWorkspace(workspace);
        entityManager.persist(channel);

        entityManager.flush();

        Friendship friendship = new Friendship();
        friendship.setRequester(requester);
        friendship.setAddressee(addressee);
        friendship.setStatus("PENDING");
        entityManager.persist(friendship);

        WorkspaceMember member = new WorkspaceMember();
        member.setUser(requester);
        member.setWorkspace(workspace);
        member.setRole("MEMBER");
        entityManager.persist(member);

        ChannelReadReceipt receipt = new ChannelReadReceipt();
        receipt.setUser(requester);
        receipt.setChannel(channel);
        entityManager.persist(receipt);

        entityManager.flush();

        assertNotNull(friendship.getId());
        assertEquals(requester.getId(),
            friendship.getId().getRequesterId());
        assertEquals(addressee.getId(),
            friendship.getId().getAddresseeId());

        assertNotNull(member.getId());
        assertEquals(requester.getId(), member.getId().getUserId());
        assertEquals(workspace.getId(),
            member.getId().getWorkspaceId());

        assertNotNull(receipt.getId());
        assertEquals(requester.getId(), receipt.getId().getUserId());
        assertEquals(channel.getId(), receipt.getId().getChannelId());
    }
}