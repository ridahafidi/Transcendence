package com.Transendence.Backend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class UserServiceTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Test
    void shouldFindExistingUserByEmail() {
        String unique = UUID.randomUUID().toString();
        String email = "test-" + unique + "@example.com";

        User user = new User();
        user.setEmail(email);
        user.setDisplayName("Test User");

        User savedUser = userRepository.saveAndFlush(user);

        Optional<User> result = userService.findByEmail(email);

        assertTrue(result.isPresent());
        assertEquals(savedUser.getId(), result.get().getId());
        assertEquals(email, result.get().getEmail());
    }
    @Test
    void shouldReturnEmptyWhenEmailDoesNotExist() {
        String email =
            "missing-" + UUID.randomUUID() + "@example.com";

        Optional<User> result = userService.findByEmail(email);

        assertTrue(result.isEmpty());
    }
    @Test
    void shouldRejectBlankEmail() {
        assertThrows(
            IllegalArgumentException.class,
            () -> userService.findByEmail("   ")
        );
    }
}
