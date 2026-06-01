package com.app.fieldcheck.web.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest (
    @NotBlank(message = "Primer nombre obligatorio")
    @Size(min = 1, max = 50, message = "El primer nombre debe ser como máximo de 50 caracteres")
    String firstName,
    @NotBlank(message = "Apellido obligatorio")
    @Size(min = 1, max = 50, message = "El apellido debe ser como máximo de 50 caracteres")
    String lastName,
    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "El formato de correo debe ser válido")
    String email,
    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 6, message = "La contraseña debe tener mínimo 6 caracteres")
    String password,
    String phone
){}
