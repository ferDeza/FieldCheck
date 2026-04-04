package com.app.fieldcheck.services;

import com.app.fieldcheck.enums.UserRole;
import com.app.fieldcheck.models.User;
import com.app.fieldcheck.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User user1;
    private User user2;

    @BeforeEach
    void setUp() {
        user1 = User.builder()
                .id(1L)
                .fullName("John Doe")
                .email("john@example.com")
                .password("password123")
                .role(UserRole.CUSTOMER)
                .phoneNumber("1234567890")
                .build();

        user2 = User.builder()
                .id(2L)
                .fullName("Jane Smith")
                .email("jane@example.com")
                .password("password123")
                .role(UserRole.CUSTOMER)
                .phoneNumber("0987654321")
                .build();
    }

    @Test
    void testGetAllUsers() {
        // Arrange
        List<User> users = Arrays.asList(user1, user2);
        when(userRepository.findAll()).thenReturn(users);

        // Act
        List<User> result = userService.getAllUsers();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(user1.getFullName(), result.get(0).getFullName());
        assertEquals(user2.getEmail(), result.get(1).getEmail());
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void testGetAllUsersEmpty() {
        // Arrange
        when(userRepository.findAll()).thenReturn(Arrays.asList());

        // Act
        List<User> result = userService.getAllUsers();

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void testSaveUser() {
        // Arrange
        when(userRepository.save(user1)).thenReturn(user1);

        // Act
        User result = userService.saveUser(user1);

        // Assert
        assertNotNull(result);
        assertEquals(user1.getId(), result.getId());
        assertEquals(user1.getFullName(), result.getFullName());
        assertEquals(user1.getEmail(), result.getEmail());
        verify(userRepository, times(1)).save(user1);
    }

    @Test
    void testSaveUserWithNull() {
        // Arrange
        User nullUser = null;

        // Act & Assert
        assertThrows(NullPointerException.class, () -> userService.saveUser(nullUser));
    }

    @Test
    void testSaveMultipleUsers() {
        // Arrange
        when(userRepository.save(user1)).thenReturn(user1);
        when(userRepository.save(user2)).thenReturn(user2);

        // Act
        User result1 = userService.saveUser(user1);
        User result2 = userService.saveUser(user2);

        // Assert
        assertNotNull(result1);
        assertNotNull(result2);
        assertEquals(user1.getId(), result1.getId());
        assertEquals(user2.getId(), result2.getId());
        verify(userRepository, times(2)).save(any(User.class));
    }
}
