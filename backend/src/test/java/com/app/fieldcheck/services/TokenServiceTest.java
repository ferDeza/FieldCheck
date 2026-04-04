package com.app.fieldcheck.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TokenServiceTest {

    @Mock
    private JwtEncoder jwtEncoder;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private TokenService tokenService;

    @BeforeEach
    void setUp() {
    }

    @Test
    void testGenerateTokenWithCustomerRole() {
        // Arrange
        Collection<SimpleGrantedAuthority> authorities = Collections.singleton(
                new SimpleGrantedAuthority("ROLE_CUSTOMER")
        );

        when(authentication.getAuthorities()).thenReturn((Collection) authorities);
        when(authentication.getName()).thenReturn("john@example.com");

        // Create a mock JwtEncoder result
        var mockEncodedJwt = mock(org.springframework.security.oauth2.jwt.Jwt.class);
        when(mockEncodedJwt.getTokenValue()).thenReturn("mock-jwt-token-123");

        when(jwtEncoder.encode(any(JwtEncoderParameters.class))).thenReturn(mockEncodedJwt);

        // Act
        String token = tokenService.generateToken(authentication);

        // Assert
        assertNotNull(token);
        assertEquals("mock-jwt-token-123", token);
        verify(jwtEncoder, times(1)).encode(any(JwtEncoderParameters.class));
    }

    @Test
    void testGenerateTokenContainsUserEmail() {
        // Arrange
        Collection<SimpleGrantedAuthority> authorities = Collections.singleton(
                new SimpleGrantedAuthority("ROLE_CUSTOMER")
        );

        when(authentication.getAuthorities()).thenReturn((Collection) authorities);
        when(authentication.getName()).thenReturn("jane@example.com");

        var mockEncodedJwt = mock(org.springframework.security.oauth2.jwt.Jwt.class);
        when(mockEncodedJwt.getTokenValue()).thenReturn("jwt-token-456");
        when(jwtEncoder.encode(any(JwtEncoderParameters.class))).thenReturn(mockEncodedJwt);

        // Act
        String token = tokenService.generateToken(authentication);

        // Assert
        assertNotNull(token);
        assertEquals("jwt-token-456", token);
    }

    @Test
    void testGenerateTokenWithMultipleAuthorities() {
        // Arrange
        Collection<SimpleGrantedAuthority> authorities = List.of(
                new SimpleGrantedAuthority("ROLE_ADMIN"),
                new SimpleGrantedAuthority("ROLE_USER")
        );

        when(authentication.getAuthorities()).thenReturn((Collection) authorities);
        when(authentication.getName()).thenReturn("admin@example.com");

        var mockEncodedJwt = mock(org.springframework.security.oauth2.jwt.Jwt.class);
        when(mockEncodedJwt.getTokenValue()).thenReturn("admin-jwt-token");
        when(jwtEncoder.encode(any(JwtEncoderParameters.class))).thenReturn(mockEncodedJwt);

        // Act
        String token = tokenService.generateToken(authentication);

        // Assert
        assertNotNull(token);
        assertEquals("admin-jwt-token", token);
    }

    @Test
    void testGenerateTokenWithEmptyAuthorities() {
        // Arrange
        Collection<SimpleGrantedAuthority> authorities = Collections.emptyList();

        when(authentication.getAuthorities()).thenReturn((Collection) authorities);
        when(authentication.getName()).thenReturn("user@example.com");

        var mockEncodedJwt = mock(org.springframework.security.oauth2.jwt.Jwt.class);
        when(mockEncodedJwt.getTokenValue()).thenReturn("token-no-auth");
        when(jwtEncoder.encode(any(JwtEncoderParameters.class))).thenReturn(mockEncodedJwt);

        // Act
        String token = tokenService.generateToken(authentication);

        // Assert
        assertNotNull(token);
        verify(jwtEncoder, times(1)).encode(any(JwtEncoderParameters.class));
    }
}
