package com.app.fieldcheck.web.controllers;

import com.app.fieldcheck.models.Booking;
import com.app.fieldcheck.models.SportField;
import com.app.fieldcheck.models.User;
import com.app.fieldcheck.services.BookingService;
import com.app.fieldcheck.services.SportFieldService;
import com.app.fieldcheck.services.UserService;
import com.app.fieldcheck.web.dtos.BookingRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/view/bookings")
@RequiredArgsConstructor
public class BookingViewController {
    private final BookingService bookingService;
    private final UserService userService;
    private final SportFieldService sportFieldService;
    @GetMapping
    public String listBookings(Model model) {
        model.addAttribute("bookings",bookingService.getAllBookings());
        return "bookings-list";
    }
    @GetMapping("/delete/{id}")
    public String deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return "redirect:/view/bookings";
    }
    @GetMapping("/new")
    public String showCreateBookingForm(Model model) {
        model.addAttribute("booking", new Booking());
        model.addAttribute("user", userService.getAllUsers());
        model.addAttribute("fields",sportFieldService.getAllSportFields());
        return "booking-form";
    }
    @PostMapping("/save")
    public String saveBooking(@ModelAttribute("booking") Booking booking) {
        BookingRequest request = new BookingRequest();
        request.setUserId(booking.getUser().getId());
        request.setFieldId(booking.getSportField().getId());
        request.setStartTime(booking.getStartDateTime());
        request.setEndTime(booking.getEndDateTime());
        bookingService.createBooking(request);
        return "redirect:/view/bookings";
    }
}
