package com.app.fieldcheck.models;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Data
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name="bookings")
@Builder
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "booking_generator")
    @SequenceGenerator(name = "booking_generator", sequenceName = "booking_seq", allocationSize = 1)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime startDateTime;

    @Column(nullable = false)
    private LocalDateTime endDateTime;

    @Column(nullable = false)
    private Double totalPrice;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="field_id",nullable = false)
    private SportField sportField;

    @JoinColumn(name="user_id",nullable = false)
    @ManyToOne(fetch = FetchType.EAGER)
    private User user;
}
