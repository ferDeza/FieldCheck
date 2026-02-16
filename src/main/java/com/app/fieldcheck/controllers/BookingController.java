package com.app.fieldcheck.controllers;


import com.app.fieldcheck.models.Booking;
import com.app.fieldcheck.services.BookingService;
import com.app.fieldcheck.web.dtos.BookingRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/booking")
@RequiredArgsConstructor
public class BookingController {
    private final BookingService bookingService;
    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }
    @PostMapping
    public Booking createBooking(@RequestBody BookingRequest request) {
        return bookingService.createBooking(request);
    }
    @DeleteMapping("/{id}")
    public void deleteBooking(@PathVariable long id) {
        bookingService.deleteBooking(id);
    }
}
