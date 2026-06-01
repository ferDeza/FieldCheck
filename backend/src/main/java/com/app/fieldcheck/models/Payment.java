package com.app.fieldcheck.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "payment_generator")
    @SequenceGenerator(name = "payment_generator", sequenceName = "payment_seq", allocationSize = 1)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "payer_id", nullable = false)
    private User payer;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private String method; // e.g., "CARD", "TRANSFER", "Culqui"

    @Column(nullable = false)
    private String status; // PENDING, PAID, FAILED

    private LocalDateTime paidAt;
}
