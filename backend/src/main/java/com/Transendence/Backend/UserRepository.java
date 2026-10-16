package com.Transendence.Backend;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, UUID> {

    List<User> findAllByDisplayName(String displayName);
    Optional<User> findByEmail(String email);
}
