package com.app.fieldcheck.repositories;

import com.app.fieldcheck.enums.UserRole;
import com.app.fieldcheck.models.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;


import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    private User user;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .fullName("John Doe")
                .email("john@example.com")
                .password("password123")
                .role(UserRole.CUSTOMER)
                .phoneNumber("1234567890")
                .build();
    }

    @Test
    void testSaveUser() {
        // Act
        User savedUser = userRepository.save(user);

        // Assert
        assertNotNull(savedUser);
        assertNotNull(savedUser.getId());
        assertEquals("John Doe", savedUser.getFullName());
        assertEquals("john@example.com", savedUser.getEmail());
    }

    @Test
    void testFindByEmail() {
        // Arrange
        userRepository.save(user);

        // Act
        Optional<User> foundUser = userRepository.findByEmail("john@example.com");

        // Assert
        assertTrue(foundUser.isPresent());
        assertEquals(user.getFullName(), foundUser.get().getFullName());
        assertEquals(user.getEmail(), foundUser.get().getEmail());
    }

    @Test
    void testFindByEmailNotFound() {
        // Act
        Optional<User> foundUser = userRepository.findByEmail("nonexistent@example.com");

        // Assert
        assertFalse(foundUser.isPresent());
    }

    @Test
    void testFindById() {
        // Arrange
        User savedUser = userRepository.save(user);

        // Act
        Optional<User> foundUser = userRepository.findById(savedUser.getId());

        // Assert
        assertTrue(foundUser.isPresent());
        assertEquals(savedUser.getId(), foundUser.get().getId());
        assertEquals(savedUser.getFullName(), foundUser.get().getFullName());
    }

    @Test
    void testFindByIdNotFound() {
        // Act
        Optional<User> foundUser = userRepository.findById(999L);

        // Assert
        assertFalse(foundUser.isPresent());
    }

    @Test
    void testDeleteUser() {
        // Arrange
        User savedUser = userRepository.save(user);
        Long userId = savedUser.getId();

        // Act
        userRepository.deleteById(userId);

        // Assert
        assertFalse(userRepository.findById(userId).isPresent());
    }

    @Test
    void testUpdateUser() {
        // Arrange
        User savedUser = userRepository.save(user);

        // Act
        savedUser.setFullName("Updated Name");
        savedUser.setPhoneNumber("9876543210");
        User updatedUser = userRepository.save(savedUser);

        // Assert
        assertEquals("Updated Name", updatedUser.getFullName());
        assertEquals("9876543210", updatedUser.getPhoneNumber());
    }

    @Test
    void testFindAllUsers() {
        // Arrange
        User user2 = User.builder()
                .fullName("Jane Smith")
                .email("jane@example.com")
                .password("password123")
                .role(UserRole.CUSTOMER)
                .build();

        userRepository.save(user);
        userRepository.save(user2);

        // Act
        var users = userRepository.findAll();

        // Assert
        assertEquals(2, users.size());
    }

    @Test
    void testUniqueEmailConstraint() {
        // Arrange
        userRepository.save(user);

        User duplicateUser = User.builder()
                .fullName("Another User")
                .email("john@example.com")  // Duplicate email
                .password("password123")
                .role(UserRole.CUSTOMER)
                .build();

        // Act & Assert
        assertThrows(Exception.class, () -> userRepository.save(duplicateUser));
    }
}
