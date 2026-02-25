package com.app.fieldcheck.web.dtos;

public record BookingWebDTO (
     Long id,
     String customerName ,
     String fieldName,
     String schedule,
     Double price
){}