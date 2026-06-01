package com.app.fieldcheck.web.dtos;

public record AdminDashboardDTO(
        Long totalReservations,
        Double totalRevenue,
        Long activeCustomers,
        Long activeSportFields,
        java.util.List<BookingWebDTO> recentBookings
) {}
