package com.app.fieldcheck.web.dtos;

public record UserResponse(
        Long id,
        String fullName,
        String email,
        String role
)
{ }
