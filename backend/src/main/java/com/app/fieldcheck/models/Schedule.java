package com.app.fieldcheck.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalTime;

@Entity
@Data
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "schedules")
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "schedule_generator")
    @SequenceGenerator(name = "schedule_generator", sequenceName = "schedule_seq", allocationSize = 1)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "field_id", nullable = false)
    private SportField sportField;

    @Column(nullable = false)
    private String dayOfWeek; // MON, TUE, WED, THU, FRI, SAT, SUN

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    @Column(nullable = false)
    private Boolean isAvailable;

    @Column(name = "created_at")
    private java.time.LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = java.time.LocalDateTime.now();
    }
}
