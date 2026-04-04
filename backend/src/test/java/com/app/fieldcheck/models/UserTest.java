package com.app.fieldcheck.models;

import com.app.fieldcheck.enums.UserRole;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

import static org.junit.jupiter.api.Assertions.*;

class UserTest {

    private User user;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id(1L)
                .fullName("John Doe")
                .email("john@example.com")
                .password("hashedPassword")
                .role(UserRole.CUSTOMER)
                .phoneNumber("1234567890")
                .build();
    }

    @Test
    void testUserCreation() {
        // Assert
        assertNotNull(user);
        assertEquals(1L, user.getId());
        assertEquals("John Doe", user.getFullName());
        assertEquals("john@example.com", user.getEmail());
        assertEquals("hashedPassword", user.getPassword());
        assertEquals(UserRole.CUSTOMER, user.getRole());
        assertEquals("1234567890", user.getPhoneNumber());
    }

    @Test
    void testUserDetailsGetUsername() {
        // Act
        String username = user.getUsername();

        // Assert
        assertEquals("john@example.com", username);
    }

    @Test
    void testUserDetailsGetPassword() {
        // Act
        String password = user.getPassword();

        // Assert
        assertEquals("hashedPassword", password);
    }

    @Test
    void testUserDetailsGetAuthorities() {
        // Act
        Collection<? extends GrantedAuthority> authorities = user.getAuthorities();

        // Assert
        assertNotNull(authorities);
        assertEquals(1, authorities.size());
        assertTrue(authorities.stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_CUSTOMER")));
    }

    @Test
    void testUserDetailsGetAuthoritiesAdmin() {
        // Arrange
        User adminUser = User.builder()
                .id(2L)
                .fullName("Admin")
                .email("admin@example.com")
                .password("password")
                .role(UserRole.ADMIN)
                .build();

        // Act
        Collection<? extends GrantedAuthority> authorities = adminUser.getAuthorities();

        // Assert
        assertTrue(authorities.stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")));
    }

    @Test
    void testUserEquality() {
        // Arrange
        User user2 = User.builder()
                .id(1L)
                .fullName("John Doe")
                .email("john@example.com")
                .password("hashedPassword")
                .role(UserRole.CUSTOMER)
                .phoneNumber("1234567890")
                .build();

        // Assert
        assertEquals(user, user2);
    }

    @Test
    void testUserPhoneNumberOptional() {
        // Arrange
        User userNoPhone = User.builder()
                .id(3L)
                .fullName("Jane")
                .email("jane@example.com")
                .password("password")
                .role(UserRole.CUSTOMER)
                .build();

        // Assert
        assertNull(userNoPhone.getPhoneNumber());
    }

    @Test
    void testUserBuilder() {
        // Act
        User builtUser = User.builder()
                .id(4L)
                .fullName("Bob Smith")
                .email("bob@example.com")
                .password("bobPassword")
                .role(UserRole.CUSTOMER)
                .phoneNumber("5555555555")
                .build();

        // Assert
        assertNotNull(builtUser);
        assertEquals("Bob Smith", builtUser.getFullName());
        assertEquals("bob@example.com", builtUser.getEmail());
    }

    @Test
    void testUserSetters() {
        // Act
        user.setFullName("Jane Doe");
        user.setPhoneNumber("9876543210");
        user.setEmail("jane@example.com");

        // Assert
        assertEquals("Jane Doe", user.getFullName());
        assertEquals("9876543210", user.getPhoneNumber());
        assertEquals("jane@example.com", user.getEmail());
    }
}
