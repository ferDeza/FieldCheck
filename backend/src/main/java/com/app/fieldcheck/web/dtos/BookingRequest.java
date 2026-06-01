package com.app.fieldcheck.web.dtos;

import jakarta.validation.constraints.FutureOrPresent;
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
    @FutureOrPresent(message = "La fecha de inicio debe ser futura o presente")
    private LocalDateTime startTime;
    @FutureOrPresent(message = "El fin debe ser futuro o presente")
    @NotNull(message = "La fecha de fin es obligatoria")
    private LocalDateTime endTime;
}
