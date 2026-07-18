package com.app.fieldcheck.controllers;

import com.app.fieldcheck.services.AdminService;
import com.app.fieldcheck.web.dtos.AdminDashboardDTO;
import com.app.fieldcheck.web.dtos.BookingWebDTO;
import com.app.fieldcheck.web.dtos.RevenueHistoryDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    private final AdminService adminService;

    @GetMapping("/dashboard")
    public AdminDashboardDTO getDashboard() {
        return adminService.getDashboardStats();
    }

    @GetMapping("/bookings-today")
    public List<BookingWebDTO> getBookingsForToday() {
        return adminService.getBookingsForToday();
    }

    @GetMapping("/revenue-history")
    public List<RevenueHistoryDTO> getRevenueHistory() {
        return adminService.getRevenueHistory();
    }
}
