package com.app.fieldcheck.controllers;

import com.app.fieldcheck.enums.UserRole;
import com.app.fieldcheck.services.BookingService;
import com.app.fieldcheck.web.dtos.BookingRequest;
import com.app.fieldcheck.web.dtos.BookingWebDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.boot.test.context.SpringBootTest;

import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
@WithMockUser(roles = "CUSTOMER")
class BookingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private BookingService bookingService;

    @Autowired
    private ObjectMapper objectMapper;

    private BookingRequest bookingRequest;
    private BookingWebDTO bookingWebDTO;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    @BeforeEach
    void setUp() {
        objectMapper.registeredModules();
        startTime = LocalDateTime.of(2026, 3, 28, 10, 0);
        endTime = LocalDateTime.of(2026, 3, 28, 12, 0);

        bookingRequest = new BookingRequest();
        bookingRequest.setUserId(1L);
        bookingRequest.setFieldId(1L);
        bookingRequest.setStartTime(startTime);
        bookingRequest.setEndTime(endTime);

        bookingWebDTO = new BookingWebDTO(
                1L,
                "John Doe",
                "Football Field",
                "2026-03-28T10:00a2026-03-28T12:00",
                100.0
        );
    }

    @Test
    void testGetAllBookings() throws Exception {
        // Arrange
        BookingWebDTO booking2 = new BookingWebDTO(
                2L,
                "Jane Smith",
                "Basketball Court",
                "2026-03-29T14:00a2026-03-29T16:00",
                80.0
        );
        List<BookingWebDTO> bookings = Arrays.asList(bookingWebDTO, booking2);
        when(bookingService.getAllBookingsForWeb()).thenReturn(bookings);

        // Act
        ResultActions response = mockMvc.perform(get("/api/v1/booking")
                .contentType(MediaType.APPLICATION_JSON));

        // Assert
        response.andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].userName", is("John Doe")))
                .andExpect(jsonPath("$[0].fieldName", is("Football Field")))
                .andExpect(jsonPath("$[0].totalPrice", is(100.0)))
                .andExpect(jsonPath("$[1].id", is(2)))
                .andExpect(jsonPath("$[1].userName", is("Jane Smith")));

        verify(bookingService, times(1)).getAllBookingsForWeb();
    }

    @Test
    void testGetAllBookingsEmpty() throws Exception {
        // Arrange
        when(bookingService.getAllBookingsForWeb()).thenReturn(Arrays.asList());

        // Act
        ResultActions response = mockMvc.perform(get("/api/v1/booking")
                .contentType(MediaType.APPLICATION_JSON));

        // Assert
        response.andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));

        verify(bookingService, times(1)).getAllBookingsForWeb();
    }

    @Test
    void testCreateBookingSuccess() throws Exception {
        // Arrange
        when(bookingService.createBooking(any(BookingRequest.class))).thenReturn(bookingWebDTO);

        // Act
        ResultActions response = mockMvc.perform(post("/api/v1/booking")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(bookingRequest)));

        // Assert
        response.andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.userName", is("John Doe")))
                .andExpect(jsonPath("$.fieldName", is("Football Field")))
                .andExpect(jsonPath("$.totalPrice", is(100.0)));

        verify(bookingService, times(1)).createBooking(any(BookingRequest.class));
    }

    @Test
    void testCreateBookingInvalidDates() throws Exception {
        // Arrange - End time before start time
        BookingRequest invalidRequest = new BookingRequest();
        invalidRequest.setUserId(1L);
        invalidRequest.setFieldId(1L);
        invalidRequest.setStartTime(endTime);
        invalidRequest.setEndTime(startTime);

        // Act
        ResultActions response = mockMvc.perform(post("/api/v1/booking")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)));

        // Assert
        response.andExpect(status().isBadRequest());
        verify(bookingService, never()).createBooking(any(BookingRequest.class));
    }

    @Test
    void testCreateBookingMissingFields() throws Exception {
        // Arrange
        String requestJson = "{\"userId\": 1}";

        // Act
        ResultActions response = mockMvc.perform(post("/api/v1/booking")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestJson));

        // Assert
        response.andExpect(status().isBadRequest());
        verify(bookingService, never()).createBooking(any(BookingRequest.class));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testDeleteBookingSuccess() throws Exception {
        doNothing().when(bookingService).deleteBooking(1L);

        mockMvc.perform(delete("/api/v1/booking/1")
                        .with(csrf())) // <--- Add this line
                .andExpect(status().isNoContent());

        verify(bookingService, times(1)).deleteBooking(1L);
    }

    @Test
    void testDeleteBookingNotFound() throws Exception {
        // Arrange
        doThrow(new RuntimeException("Booking not found"))
                .when(bookingService).deleteBooking(999L);

        // Act
        ResultActions response = mockMvc.perform(delete("/api/v1/booking/999")
                .contentType(MediaType.APPLICATION_JSON));

        // Assert
        response.andExpect(status().isInternalServerError());
        verify(bookingService, times(1)).deleteBooking(999L);
    }

    @Test
    void testCreateMultipleBookings() throws Exception {
        // Arrange
        BookingWebDTO booking2 = new BookingWebDTO(
                2L,
                "Jane Smith",
                "Basketball Court",
                "time slot",
                80.0
        );

        when(bookingService.createBooking(any(BookingRequest.class)))
                .thenReturn(bookingWebDTO)
                .thenReturn(booking2);

        // Act
        ResultActions response1 = mockMvc.perform(post("/api/v1/booking")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(bookingRequest)));

        ResultActions response2 = mockMvc.perform(post("/api/v1/booking")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(bookingRequest)));

        // Assert
        response1.andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", is(1)));

        response2.andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", is(2)));

        verify(bookingService, times(2)).createBooking(any(BookingRequest.class));
    }
}
