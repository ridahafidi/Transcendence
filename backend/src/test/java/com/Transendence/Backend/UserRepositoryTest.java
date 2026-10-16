package com.Transendence.Backend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    void shouldSaveAndFindUserByDisplayName() {
        //Arrange: create a unique test user
        String unique = UUID.randomUUID().toString();
        String displayName = "test-" + unique;
        User user = new User();
        user.setEmail("test-" + unique + "@example.com");
        user.setDisplayName(displayName);
        //Act: persist the user
        User savedUser = userRepository.saveAndFlush(user);
        //Act: query PostgreSQL through the repository
        List<User> results = userRepository.findAllByDisplayName(displayName);
        //Assert: verify the database round trip
        assertNotNull(savedUser.getId());
        assertEquals(1, results.size());
        assertEquals(savedUser.getId(), results.get(0).getId());
        assertEquals(displayName, results.get(0).getDisplayName());
    }
}
