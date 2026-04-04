package com.app.fieldcheck.web.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest (
        @NotBlank(message = "Email obligatorio")
        @Email(message ="Se necesita un formato de email valido")
        String email,
        @NotBlank(message ="contraseña obligatoria")
        String password
){

}
