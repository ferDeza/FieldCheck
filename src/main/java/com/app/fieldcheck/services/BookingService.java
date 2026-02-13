package com.app.fieldcheck.services;


import com.app.fieldcheck.models.Booking;
import com.app.fieldcheck.repositories.BookingRepository;
import com.app.fieldcheck.repositories.SportFieldRepository;
import com.app.fieldcheck.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final SportFieldRepository sportFieldRepository;
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
    public Booking createBooking(Long userId, Long fieldId, LocalDateTime startTime, LocalDateTime endTime) {
        var user = userRepository.findById(userId).orElseThrow(()
                -> new RuntimeException("User Not Found"));
        var field = sportFieldRepository.findById(fieldId).orElseThrow(()
                -> new RuntimeException("Field not found"));
        Booking booking = Booking.builder()
                .user(user)
                .sportField(field)
                .startDateTime(startTime)
                .endDateTime(endTime)
                .totalPrice(field.getBasePrice())
                .build();
        return bookingRepository.save(booking);
    }
}
