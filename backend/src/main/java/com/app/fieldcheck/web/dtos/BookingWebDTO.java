package com.app.fieldcheck.web.dtos;

import java.time.LocalDateTime;

public record BookingWebDTO (
     Long id,
     String customerName ,
     String fieldName,
     LocalDateTime startDateTime,
     LocalDateTime endDateTime,
     Double price,
     Boolean paid
){}
