package com.app.fieldcheck.controllers;

import com.app.fieldcheck.enums.UserRole;
import com.app.fieldcheck.services.AuthService;
import com.app.fieldcheck.web.dtos.LoginRequest;
import com.app.fieldcheck.web.dtos.RegisterRequest;
import com.app.fieldcheck.web.dtos.UserResponse;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import tools.jackson.databind.ObjectMapper;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AuthService authService;

    @Autowired
    private ObjectMapper objectMapper;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private UserResponse userResponse;

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

        userResponse = new UserResponse(
                1L,
                "John Doe",
                "john@example.com",
                UserRole.CUSTOMER.name()
        );
    }

    @Test
    void testRegisterSuccess() throws Exception {
        // Arrange
        when(authService.register(any(RegisterRequest.class))).thenReturn(userResponse);

        // Act
        ResultActions response = mockMvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)));

        // Assert
        response.andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.fullName", is("John Doe")))
                .andExpect(jsonPath("$.email", is("john@example.com")))
                .andExpect(jsonPath("$.role", is("CUSTOMER")));

        verify(authService, times(1)).register(any(RegisterRequest.class));
    }

    @Test
    void testRegisterInvalidEmail() throws Exception {
        // Arrange
        RegisterRequest invalidRequest = new RegisterRequest(
                "John Doe",
                "invalid-email",
                "password123"
        );

        // Act
        ResultActions response = mockMvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)));

        // Assert
        response.andExpect(status().isBadRequest());
        verify(authService, never()).register(any(RegisterRequest.class));
    }

    @Test
    void testRegisterShortPassword() throws Exception {
        // Arrange
        RegisterRequest invalidRequest = new RegisterRequest(
                "John Doe",
                "john@example.com",
                "short"
        );

        // Act
        ResultActions response = mockMvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)));

        // Assert
        response.andExpect(status().isBadRequest());
        verify(authService, never()).register(any(RegisterRequest.class));
    }

    @Test
    void testLoginSuccess() throws Exception {
        // Arrange
        when(authService.login(any(LoginRequest.class))).thenReturn("jwt-token-123");

        // Act
        ResultActions response = mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)));

        // Assert
        response.andExpect(status().isOk())
                .andExpect(jsonPath("$.token", is("jwt-token-123")));

        verify(authService, times(1)).login(any(LoginRequest.class));
    }

    @Test
    void testLoginInvalidEmail() throws Exception {
        // Arrange
        LoginRequest invalidRequest = new LoginRequest(
                "invalid-email",
                "password123"
        );

        // Act
        ResultActions response = mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)));

        // Assert
        response.andExpect(status().isBadRequest());
        verify(authService, never()).login(any(LoginRequest.class));
    }

    @Test
    void testLoginMissingEmail() throws Exception {
        // Arrange
        String requestJson = "{\"password\": \"password123\"}";

        // Act
        ResultActions response = mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestJson));

        // Assert
        response.andExpect(status().isBadRequest());
        verify(authService, never()).login(any(LoginRequest.class));
    }

    @Test
    void testRegisterMissingFields() throws Exception {
        // Arrange
        String requestJson = "{\"fullName\": \"John Doe\"}";

        // Act
        ResultActions response = mockMvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestJson));

        // Assert
        response.andExpect(status().isBadRequest());
        verify(authService, never()).register(any(RegisterRequest.class));
    }
}
