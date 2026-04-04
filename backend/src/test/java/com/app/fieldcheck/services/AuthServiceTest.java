package com.app.fieldcheck.services;

import com.app.fieldcheck.enums.UserRole;
import com.app.fieldcheck.models.User;
import com.app.fieldcheck.repositories.UserRepository;
import com.app.fieldcheck.web.dtos.LoginRequest;
import com.app.fieldcheck.web.dtos.RegisterRequest;
import com.app.fieldcheck.web.dtos.UserResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private UserRepository userRepository;

    @Mock
    private TokenService tokenService;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthService authService;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private User user;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest(
                "John Doe",
                "john@example.com",
                "password123"
        );

        loginRequest = new LoginRequest(
                "john@example.com",
                "password123"
        );

        user = User.builder()
                .id(1L)
                .fullName("John Doe")
                .email("john@example.com")
                .password("encodedPassword")
                .role(UserRole.CUSTOMER)
                .build();
    }

    @Test
    void testRegisterSuccess() {
        // Arrange
        when(userRepository.findByEmail(registerRequest.email())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(registerRequest.password())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(user);

        // Act
        UserResponse response = authService.register(registerRequest);

        // Assert
        assertNotNull(response);
        assertEquals(user.getId(), response.id());
        assertEquals(user.getFullName(), response.fullName());
        assertEquals(user.getEmail(), response.email());
        assertEquals(UserRole.CUSTOMER.name(), response.role());
        verify(userRepository, times(1)).findByEmail(registerRequest.email());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testRegisterDuplicateEmail() {
        // Arrange
        when(userRepository.findByEmail(registerRequest.email())).thenReturn(Optional.of(user));

        // Act & Assert
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> authService.register(registerRequest)
        );

        assertEquals(HttpStatus.BAD_GATEWAY, exception.getStatusCode());
        assertTrue(exception.getReason().contains("Email ya registrado"));
        verify(userRepository, times(1)).findByEmail(registerRequest.email());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testLoginSuccess() {
        // Arrange
        Authentication authentication = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(tokenService.generateToken(authentication)).thenReturn("jwt-token-123");

        // Act
        String token = authService.login(loginRequest);

        // Assert
        assertNotNull(token);
        assertEquals("jwt-token-123", token);
        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(tokenService, times(1)).generateToken(authentication);
    }

    @Test
    void testRegisterPasswordEncoding() {
        // Arrange
        when(userRepository.findByEmail(registerRequest.email())).thenReturn(Optional.empty());
        when(passwordEncoder.encode("password123")).thenReturn("hashedPassword123");
        User savedUser = User.builder()
                .id(1L)
                .fullName(registerRequest.fullName())
                .email(registerRequest.email())
                .password("hashedPassword123")
                .role(UserRole.CUSTOMER)
                .build();
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        // Act
        UserResponse response = authService.register(registerRequest);

        // Assert
        verify(passwordEncoder, times(1)).encode("password123");
        assertNotNull(response);
    }
}
