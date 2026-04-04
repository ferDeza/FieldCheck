package com.app.fieldcheck.repositories;

import com.app.fieldcheck.enums.UserRole;
import com.app.fieldcheck.models.Booking;
import com.app.fieldcheck.models.SportField;
import com.app.fieldcheck.models.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
class BookingRepositoryTest {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SportFieldRepository sportFieldRepository;

    private User user;
    private SportField sportField;
    private Booking booking;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    @BeforeEach
    void setUp() {
        startTime = LocalDateTime.of(2026, 3, 28, 10, 0);
        endTime = LocalDateTime.of(2026, 3, 28, 12, 0);

        user = User.builder()
                .fullName("John Doe")
                .email("john@example.com")
                .password("password123")
                .role(UserRole.CUSTOMER)
                .build();
        userRepository.save(user);

        sportField = SportField.builder()
                .name("Football Field")
                .type("Football")
                .basePrice(50.0)
                .description("Professional football field")
                .build();
        sportFieldRepository.save(sportField);

        booking = Booking.builder()
                .user(user)
                .sportField(sportField)
                .startDateTime(startTime)
                .endDateTime(endTime)
                .totalPrice(100.0)
                .build();
    }

    @Test
    void testSaveBooking() {
        // Act
        Booking savedBooking = bookingRepository.save(booking);

        // Assert
        assertNotNull(savedBooking);
        assertNotNull(savedBooking.getId());
        assertEquals(user.getId(), savedBooking.getUser().getId());
        assertEquals(sportField.getId(), savedBooking.getSportField().getId());
        assertEquals(100.0, savedBooking.getTotalPrice());
    }

    @Test
    void testFindById() {
        // Arrange
        Booking savedBooking = bookingRepository.save(booking);

        // Act
        Optional<Booking> foundBooking = bookingRepository.findById(savedBooking.getId());

        // Assert
        assertTrue(foundBooking.isPresent());
        assertEquals(savedBooking.getId(), foundBooking.get().getId());
        assertEquals(booking.getTotalPrice(), foundBooking.get().getTotalPrice());
    }

    @Test
    void testFindByIdNotFound() {
        // Act
        Optional<Booking> foundBooking = bookingRepository.findById(999L);

        // Assert
        assertFalse(foundBooking.isPresent());
    }

    @Test
    void testFindAllBookings() {
        // Arrange
        bookingRepository.save(booking);

        User user2 = User.builder()
                .fullName("Jane Smith")
                .email("jane@example.com")
                .password("password123")
                .role(UserRole.CUSTOMER)
                .build();
        userRepository.save(user2);

        Booking booking2 = Booking.builder()
                .user(user2)
                .sportField(sportField)
                .startDateTime(LocalDateTime.of(2026, 3, 29, 14, 0))
                .endDateTime(LocalDateTime.of(2026, 3, 29, 16, 0))
                .totalPrice(100.0)
                .build();
        bookingRepository.save(booking2);

        // Act
        List<Booking> allBookings = bookingRepository.findAll();

        // Assert
        assertEquals(2, allBookings.size());
    }

    @Test
    void testDeleteBooking() {
        // Arrange
        Booking savedBooking = bookingRepository.save(booking);
        Long bookingId = savedBooking.getId();

        // Act
        bookingRepository.deleteById(bookingId);

        // Assert
        assertFalse(bookingRepository.findById(bookingId).isPresent());
    }

    @Test
    void testUpdateBooking() {
        // Arrange
        Booking savedBooking = bookingRepository.save(booking);

        // Act
        savedBooking.setTotalPrice(150.0);
        Booking updatedBooking = bookingRepository.save(savedBooking);

        // Assert
        assertEquals(150.0, updatedBooking.getTotalPrice());
    }

    @Test
    void testExistsOverlappingBooking() {
        // Arrange
        bookingRepository.save(booking);

        // Act - Exact time match
        boolean overlaps = bookingRepository.existsOverLapingBooking(
                sportField.getId(), startTime, endTime
        );

        // Assert
        assertTrue(overlaps);
    }

    @Test
    void testExistsOverlappingBookingPartialOverlap() {
        // Arrange
        bookingRepository.save(booking);
        LocalDateTime newStart = LocalDateTime.of(2026, 3, 28, 11, 0);
        LocalDateTime newEnd = LocalDateTime.of(2026, 3, 28, 13, 0);

        // Act - Partial overlap
        boolean overlaps = bookingRepository.existsOverLapingBooking(
                sportField.getId(), newStart, newEnd
        );

        // Assert
        assertTrue(overlaps);
    }

    @Test
    void testExistsOverlappingBookingNoOverlap() {
        // Arrange
        bookingRepository.save(booking);
        LocalDateTime newStart = LocalDateTime.of(2026, 3, 28, 14, 0);
        LocalDateTime newEnd = LocalDateTime.of(2026, 3, 28, 16, 0);

        // Act - No overlap
        boolean overlaps = bookingRepository.existsOverLapingBooking(
                sportField.getId(), newStart, newEnd
        );

        // Assert
        assertFalse(overlaps);
    }

    @Test
    void testExistsOverlappingBookingDifferentField() {
        // Arrange
        bookingRepository.save(booking);

        SportField anotherField = SportField.builder()
                .name("Basketball Court")
                .type("Basketball")
                .basePrice(40.0)
                .build();
        sportFieldRepository.save(anotherField);

        // Act
        boolean overlaps = bookingRepository.existsOverLapingBooking(
                anotherField.getId(), startTime, endTime
        );

        // Assert
        assertFalse(overlaps);
    }

    @Test
    void testExistsOverlappingBookingMultipleBookings() {
        // Arrange
        bookingRepository.save(booking);

        User user2 = User.builder()
                .fullName("Jane Smith")
                .email("jane@example.com")
                .password("password123")
                .role(UserRole.CUSTOMER)
                .build();
        userRepository.save(user2);

        Booking booking2 = Booking.builder()
                .user(user2)
                .sportField(sportField)
                .startDateTime(LocalDateTime.of(2026, 3, 28, 13, 0))
                .endDateTime(LocalDateTime.of(2026, 3, 28, 15, 0))
                .totalPrice(100.0)
                .build();
        bookingRepository.save(booking2);

        // Act - Check first booking time (should exist)
        boolean overlapsFirst = bookingRepository.existsOverLapingBooking(
                sportField.getId(), startTime, endTime
        );

        // Check second booking time (should exist)
        boolean overlapsSecond = bookingRepository.existsOverLapingBooking(
                sportField.getId(),
                LocalDateTime.of(2026, 3, 28, 13, 0),
                LocalDateTime.of(2026, 3, 28, 15, 0)
        );

        // Check gap between bookings (should not exist)
        boolean noOverlapGap = bookingRepository.existsOverLapingBooking(
                sportField.getId(),
                LocalDateTime.of(2026, 3, 28, 12, 0),
                LocalDateTime.of(2026, 3, 28, 13, 0)
        );

        // Assert
        assertTrue(overlapsFirst);
        assertTrue(overlapsSecond);
        assertFalse(noOverlapGap);
    }

    @Test
    void testExistsOverlappingBookingEdgeCases() {
        // Arrange
        bookingRepository.save(booking);

        // Act - Booking starts exactly when existing ends
        boolean touchesEnd = bookingRepository.existsOverLapingBooking(
                sportField.getId(),
                LocalDateTime.of(2026, 3, 28, 12, 0),
                LocalDateTime.of(2026, 3, 28, 14, 0)
        );

        // Booking ends exactly when existing starts
        boolean touchesStart = bookingRepository.existsOverLapingBooking(
                sportField.getId(),
                LocalDateTime.of(2026, 3, 28, 8, 0),
                LocalDateTime.of(2026, 3, 28, 10, 0)
        );

        // Assert
        assertFalse(touchesEnd);
        assertFalse(touchesStart);
    }
}
