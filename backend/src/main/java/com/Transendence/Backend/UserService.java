package com.Transendence.Backend;

import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    public Optional<User> findByEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException(
                "Email must not be empty"
            );
        }

        return userRepository.findByEmail(email.trim());
    }
}
