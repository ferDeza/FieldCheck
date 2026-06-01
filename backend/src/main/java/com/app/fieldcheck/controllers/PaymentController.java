package com.app.fieldcheck.controllers;

import com.app.fieldcheck.models.Payment;
import com.app.fieldcheck.services.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<Payment> createPayment(@RequestParam Long bookingId,
                                                 @RequestParam Long payerId,
                                                 @RequestParam Double amount,
                                                 @RequestParam String method) {
        Payment p = paymentService.createPayment(bookingId, payerId, amount, method);
        return ResponseEntity.ok(p);
    }

    @PostMapping("/{id}/confirm")
    public ResponseEntity<Payment> confirmPayment(@PathVariable Long id) {
        Payment p = paymentService.confirmPayment(id);
        return ResponseEntity.ok(p);
    }

    @GetMapping
    public ResponseEntity<List<Payment>> getPayments() {
        return ResponseEntity.ok(paymentService.getPayments());
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<List<Payment>> getByBooking(@PathVariable Long bookingId) {
        return ResponseEntity.ok(paymentService.getPaymentsByBooking(bookingId));
    }
}
