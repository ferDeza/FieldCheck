package com.app.fieldcheck.controllers;
import com.app.fieldcheck.services.BookingService;
import com.app.fieldcheck.web.dtos.BookingRequest;
import com.app.fieldcheck.web.dtos.BookingWebDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/booking")
@RequiredArgsConstructor
public class BookingController {
    private final BookingService bookingService;
    @GetMapping
    public ResponseEntity<List<BookingWebDTO>> getAllBookings() {

        return ResponseEntity.ok(bookingService.getAllBookingsForWeb());
    }
    @PostMapping
    public ResponseEntity<BookingWebDTO> createBooking(@Valid @RequestBody BookingRequest request) {

        BookingWebDTO response = bookingService.createBooking(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }
}
