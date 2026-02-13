package com.app.fieldcheck.web.dtos;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BookingRequest {
    private Long userId;
    private Long fieldId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
