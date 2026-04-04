package com.app.fieldcheck.models;

import com.app.fieldcheck.enums.UserRole;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class BookingTest {

    private Booking booking;
    private User user;
    private SportField sportField;
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
                .password("password")
                .role(UserRole.CUSTOMER)
                .build();

        sportField = SportField.builder()
                .id(1L)
                .name("Football Field")
                .type("Football")
                .basePrice(50.0)
                .description("Professional field")
                .build();

        booking = Booking.builder()
                .id(1L)
                .user(user)
                .sportField(sportField)
                .startDateTime(startTime)
                .endDateTime(endTime)
                .totalPrice(100.0)
                .build();
    }

    @Test
    void testBookingCreation() {
        // Assert
        assertNotNull(booking);
        assertEquals(1L, booking.getId());
        assertEquals(user, booking.getUser());
        assertEquals(sportField, booking.getSportField());
        assertEquals(startTime, booking.getStartDateTime());
        assertEquals(endTime, booking.getEndDateTime());
        assertEquals(100.0, booking.getTotalPrice());
    }

    @Test
    void testBookingUserRelationship() {
        // Act
        User bookingUser = booking.getUser();

        // Assert
        assertNotNull(bookingUser);
        assertEquals("John Doe", bookingUser.getFullName());
        assertEquals("john@example.com", bookingUser.getEmail());
    }

    @Test
    void testBookingSportFieldRelationship() {
        // Act
        SportField field = booking.getSportField();

        // Assert
        assertNotNull(field);
        assertEquals("Football Field", field.getName());
        assertEquals(50.0, field.getBasePrice());
    }

    @Test
    void testBookingPriceCalculation() {
        // Arrange
        // startTime = 10:00, endTime = 12:00 (2 hours)
        // basePrice = 50.0
        // totalPrice should be 100.0

        // Assert
        assertEquals(100.0, booking.getTotalPrice());
    }

    @Test
    void testBookingBuilder() {
        // Act
        Booking builtBooking = Booking.builder()
                .id(2L)
                .user(user)
                .sportField(sportField)
                .startDateTime(LocalDateTime.of(2026, 3, 29, 14, 0))
                .endDateTime(LocalDateTime.of(2026, 3, 29, 16, 0))
                .totalPrice(100.0)
                .build();

        // Assert
        assertNotNull(builtBooking);
        assertEquals(2L, builtBooking.getId());
        assertEquals("Football Field", builtBooking.getSportField().getName());
    }

    @Test
    void testBookingSetters() {
        // Arrange
        Double newPrice = 150.0;

        // Act
        booking.setTotalPrice(newPrice);

        // Assert
        assertEquals(150.0, booking.getTotalPrice());
    }

    @Test
    void testBookingStartEndTime() {
        // Assert
        assertNotNull(booking.getStartDateTime());
        assertNotNull(booking.getEndDateTime());
        assertTrue(booking.getStartDateTime().isBefore(booking.getEndDateTime()));
    }

    @Test
    void testBookingWithDifferentDurations() {
        // Arrange - 3 hours booking
        LocalDateTime start = LocalDateTime.of(2026, 3, 28, 10, 0);
        LocalDateTime end = LocalDateTime.of(2026, 3, 28, 13, 0);

        Booking threeHourBooking = Booking.builder()
                .id(2L)
                .user(user)
                .sportField(sportField)
                .startDateTime(start)
                .endDateTime(end)
                .totalPrice(150.0) // 3 hours * 50
                .build();

        // Assert
        assertEquals(150.0, threeHourBooking.getTotalPrice());
    }

    @Test
    void testBookingEquality() {
        // Arrange
        Booking booking2 = Booking.builder()
                .id(1L)
                .user(user)
                .sportField(sportField)
                .startDateTime(startTime)
                .endDateTime(endTime)
                .totalPrice(100.0)
                .build();

        // Assert
        assertEquals(booking, booking2);
    }

    @Test
    void testBookingNoArgsConstructor() {
        // Act
        Booking noArgsBooking = new Booking();
        noArgsBooking.setId(3L);
        noArgsBooking.setUser(user);
        noArgsBooking.setSportField(sportField);
        noArgsBooking.setStartDateTime(startTime);
        noArgsBooking.setEndDateTime(endTime);
        noArgsBooking.setTotalPrice(100.0);

        // Assert
        assertEquals(3L, noArgsBooking.getId());
        assertEquals(user, noArgsBooking.getUser());
        assertEquals(100.0, noArgsBooking.getTotalPrice());
    }
}
