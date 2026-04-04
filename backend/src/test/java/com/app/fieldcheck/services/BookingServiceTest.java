package com.app.fieldcheck.services;

import com.app.fieldcheck.enums.UserRole;
import com.app.fieldcheck.models.Booking;
import com.app.fieldcheck.models.SportField;
import com.app.fieldcheck.models.User;
import com.app.fieldcheck.repositories.BookingRepository;
import com.app.fieldcheck.repositories.SportFieldRepository;
import com.app.fieldcheck.repositories.UserRepository;
import com.app.fieldcheck.web.dtos.BookingRequest;
import com.app.fieldcheck.web.dtos.BookingWebDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SportFieldRepository sportFieldRepository;

    @InjectMocks
    private BookingService bookingService;

    private User user;
    private SportField sportField;
    private Booking booking;
    private BookingRequest bookingRequest;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    @BeforeEach
    void setUp() {
        startTime = LocalDateTime.of(2026, 3, 28, 10, 0);
        endTime = LocalDateTime.of(2026, 3, 28, 12, 0);

        user = User.builder()
                .id(1L)
                .fullName("John Doe")
                .email("john@example.com")
                .password("password123")
                .role(UserRole.CUSTOMER)
                .build();

        sportField = SportField.builder()
                .id(1L)
                .name("Football Field")
                .type("Football")
                .basePrice(50.0)
                .description("Professional football field")
                .build();

        booking = Booking.builder()
                .id(1L)
                .user(user)
                .sportField(sportField)
                .startDateTime(startTime)
                .endDateTime(endTime)
                .totalPrice(100.0) // 2 hours * 50
                .build();

        bookingRequest = new BookingRequest();
        bookingRequest.setUserId(1L);
        bookingRequest.setFieldId(1L);
        bookingRequest.setStartTime(startTime);
        bookingRequest.setEndTime(endTime);
    }

    @Test
    void testGetAllBookings() {
        // Arrange
        List<Booking> bookings = Arrays.asList(booking);
        when(bookingRepository.findAll()).thenReturn(bookings);

        // Act
        List<Booking> result = bookingService.getAllBookings();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(booking.getId(), result.get(0).getId());
        verify(bookingRepository, times(1)).findAll();
    }

    @Test
    void testGetAllBookingsForWeb() {
        // Arrange
        List<Booking> bookings = Arrays.asList(booking);
        when(bookingRepository.findAll()).thenReturn(bookings);

        // Act
        List<BookingWebDTO> result = bookingService.getAllBookingsForWeb();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(booking.getId(), result.get(0).id());
        assertEquals(user.getFullName(), result.get(0).customerName());
        assertEquals(sportField.getName(), result.get(0).fieldName());
        verify(bookingRepository, times(1)).findAll();
    }

    @Test
    void testCreateBookingSuccess() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(sportFieldRepository.findById(1L)).thenReturn(Optional.of(sportField));
        when(bookingRepository.existsOverLapingBooking(1L, startTime, endTime)).thenReturn(false);
        when(bookingRepository.save(any(Booking.class))).thenReturn(booking);

        // Act
        BookingWebDTO result = bookingService.createBooking(bookingRequest);

        // Assert
        assertNotNull(result);
        assertEquals(booking.getId(), result.id());
        assertEquals(user.getFullName(), result.customerName());
        assertEquals(100.0, result.price());
        verify(userRepository, times(1)).findById(1L);
        verify(sportFieldRepository, times(1)).findById(1L);
        verify(bookingRepository, times(1)).existsOverLapingBooking(1L, startTime, endTime);
        verify(bookingRepository, times(1)).save(any(Booking.class));
    }

    @Test
    void testCreateBookingUserNotFound() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> bookingService.createBooking(bookingRequest));
        verify(userRepository, times(1)).findById(1L);
    }

    @Test
    void testCreateBookingFieldNotFound() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(sportFieldRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> bookingService.createBooking(bookingRequest));
        verify(sportFieldRepository, times(1)).findById(1L);
    }

    @Test
    void testCreateBookingOverlappingTimeSlot() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(sportFieldRepository.findById(1L)).thenReturn(Optional.of(sportField));
        when(bookingRepository.existsOverLapingBooking(1L, startTime, endTime)).thenReturn(true);

        // Act & Assert
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> bookingService.createBooking(bookingRequest)
        );

        assertEquals(HttpStatus.CONFLICT, exception.getStatusCode());
        assertTrue(exception.getReason().contains("La cancha esta ya reservada"));
    }

    @Test
    void testCreateBookingPriceCalculation() {
        // Arrange - 3 hours booking
        LocalDateTime start = LocalDateTime.of(2026, 3, 28, 10, 0);
        LocalDateTime end = LocalDateTime.of(2026, 3, 28, 13, 0);
        bookingRequest.setStartTime(start);
        bookingRequest.setEndTime(end);

        Booking calculatedBooking = Booking.builder()
                .id(1L)
                .user(user)
                .sportField(sportField)
                .startDateTime(start)
                .endDateTime(end)
                .totalPrice(150.0) // 3 hours * 50
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(sportFieldRepository.findById(1L)).thenReturn(Optional.of(sportField));
        when(bookingRepository.existsOverLapingBooking(1L, start, end)).thenReturn(false);
        when(bookingRepository.save(any(Booking.class))).thenReturn(calculatedBooking);

        // Act
        BookingWebDTO result = bookingService.createBooking(bookingRequest);

        // Assert
        assertEquals(150.0, result.price());
    }

    @Test
    void testDeleteBookingSuccess() {
        // Arrange
        when(bookingRepository.existsById(1L)).thenReturn(true);

        // Act
        bookingService.deleteBooking(1L);

        // Assert
        verify(bookingRepository, times(1)).existsById(1L);
        verify(bookingRepository, times(1)).deleteById(1L);
    }

    @Test
    void testDeleteBookingNotFound() {
        // Arrange
        when(bookingRepository.existsById(1L)).thenReturn(false);

        // Act & Assert
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> bookingService.deleteBooking(1L)
        );

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        assertTrue(exception.getReason().contains("La reserva no existe"));
        verify(bookingRepository, never()).deleteById(1L);
    }

    @Test
    void testGetBookings() {
        // Arrange
        List<Booking> bookings = Arrays.asList(booking);
        when(bookingRepository.findAll()).thenReturn(bookings);

        // Act
        List<Booking> result = bookingService.getBookings();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(bookingRepository, times(1)).findAll();
    }
}
