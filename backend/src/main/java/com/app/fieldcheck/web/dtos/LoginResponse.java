package com.app.fieldcheck.web.dtos;

public record LoginResponse (
        String token,
        Long userId,
        String email,
        String fullName,
        String role
){
}
