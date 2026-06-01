package com.app.fieldcheck.web.dtos;

import java.time.LocalTime;

public record ScheduleDTO(
        Long id,
        Long fieldId,
        String dayOfWeek,
        LocalTime startTime,
        LocalTime endTime,
        Boolean isAvailable
) {}
