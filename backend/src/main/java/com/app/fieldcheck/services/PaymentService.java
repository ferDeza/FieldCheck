package com.app.fieldcheck.services;

import com.app.fieldcheck.models.Payment;
import com.app.fieldcheck.models.Booking;
import com.app.fieldcheck.models.User;
import com.app.fieldcheck.repositories.PaymentRepository;
import com.app.fieldcheck.repositories.BookingRepository;
import com.app.fieldcheck.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    public Payment createPayment(Long bookingId, Long payerId, Double amount, String method) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));
        User payer = userRepository.findById(payerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Payment payment = Payment.builder()
                .booking(booking)
                .payer(payer)
                .amount(amount)
                .method(method)
                .status("PENDING")
                .build();

        return paymentRepository.save(payment);
    }

    public Payment confirmPayment(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment not found"));

        payment.setStatus("PAID");
        payment.setPaidAt(LocalDateTime.now());

        // mark booking as paid
        Booking booking = payment.getBooking();
        booking.setPaid(true);
        bookingRepository.save(booking);

        return paymentRepository.save(payment);
    }

    public List<Payment> getPayments() {
        return paymentRepository.findAll();
    }

    public List<Payment> getPaymentsByBooking(Long bookingId) {
        return paymentRepository.findByBookingId(bookingId);
    }
}
