package com.app.fieldcheck.controllers;

import com.app.fieldcheck.enums.UserRole;
import com.app.fieldcheck.models.User;
import com.app.fieldcheck.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import tools.jackson.databind.ObjectMapper;

import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
class UsersControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

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
    @WithMockUser(roles = "ADMIN")
    void testGetAllUsers() throws Exception {
        // Arrange
        List<User> users = Arrays.asList(user1, user2);
        when(userService.getAllUsers()).thenReturn(users);

        // Act
        ResultActions response = mockMvc.perform(get("/api/users")
                .contentType(MediaType.APPLICATION_JSON));

        // Assert
        response.andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].fullName", is("John Doe")))
                .andExpect(jsonPath("$[0].email", is("john@example.com")))
                .andExpect(jsonPath("$[1].id", is(2)))
                .andExpect(jsonPath("$[1].fullName", is("Jane Smith")));

        verify(userService, times(1)).getAllUsers();
    }

    @Test
    void testGetAllUsersEmpty() throws Exception {
        // Arrange
        when(userService.getAllUsers()).thenReturn(Arrays.asList());

        // Act
        ResultActions response = mockMvc.perform(get("/api/users")
                .contentType(MediaType.APPLICATION_JSON));

        // Assert
        response.andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));

        verify(userService, times(1)).getAllUsers();
    }

    @Test
    @WithMockUser
    void testCreateUser() throws Exception {
        // Arrange
        when(userService.saveUser(any(User.class))).thenReturn(user1);

        // Act
        ResultActions response = mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user1)));

        // Assert
        response.andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.fullName", is("John Doe")))
                .andExpect(jsonPath("$.email", is("john@example.com")));

        verify(userService, times(1)).saveUser(any(User.class));
    }

    @Test
    void testCreateUserWithPhoneNumber() throws Exception {
        // Arrange
        when(userService.saveUser(any(User.class))).thenReturn(user1);

        // Act
        ResultActions response = mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user1)));

        // Assert
        response.andExpect(status().isOk())
                .andExpect(jsonPath("$.phoneNumber", is("1234567890")));

        verify(userService, times(1)).saveUser(any(User.class));
    }

    @Test
    void testCreateMultipleUsers() throws Exception {
        // Arrange
        when(userService.saveUser(any(User.class)))
                .thenReturn(user1)
                .thenReturn(user2);

        // Act
        ResultActions response1 = mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user1)));

        ResultActions response2 = mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user2)));

        // Assert
        response1.andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)));

        response2.andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(2)));

        verify(userService, times(2)).saveUser(any(User.class));
    }
}
