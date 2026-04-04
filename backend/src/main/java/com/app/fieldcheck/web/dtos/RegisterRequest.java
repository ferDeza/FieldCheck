package com.app.fieldcheck.web.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest (
    @NotBlank(message = "Nombre obligatorio")
    @Size(min = 1, max = 100,message = "El nombre debe ser como maximo de 100 caracteres ")
    String fullName,
    @NotBlank(message = "el correo es obligatorio")
    @Email(message = "el formato de correo debe ser valido")
    String email,
    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 6,message = "La contraseña debe tener minimo 6 caracteres")
    String password
){}
