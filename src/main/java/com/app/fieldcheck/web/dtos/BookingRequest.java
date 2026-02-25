package com.app.fieldcheck.web.dtos;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BookingRequest {
    @NotNull(message = "El Id del usuario es obligatorio")
    private Long userId;
    @NotNull(message = "El Id de la cancha es obligatorio")
    private Long fieldId;
    @NotNull(message = "La fecha de inicio es obligatorio")
    @Future(message = "La fecha de inicio debe ser futura")
    private LocalDateTime startTime;
    @Future(message = "El fin debe ser futuro")
    @NotNull(message = "La fecha de fin es obligatoria")
    private LocalDateTime endTime;
}
