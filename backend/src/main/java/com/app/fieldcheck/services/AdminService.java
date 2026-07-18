package com.app.fieldcheck.services;

import com.app.fieldcheck.models.Booking;
import com.app.fieldcheck.repositories.BookingRepository;
import com.app.fieldcheck.repositories.SportFieldRepository;
import com.app.fieldcheck.repositories.UserRepository;
import com.app.fieldcheck.web.dtos.AdminDashboardDTO;
import com.app.fieldcheck.web.dtos.BookingWebDTO;
import com.app.fieldcheck.web.dtos.RevenueHistoryDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final BookingRepository bookingRepository;
    private final SportFieldRepository sportFieldRepository;
    private final UserRepository userRepository;

    public AdminDashboardDTO getDashboardStats() {
        List<Booking> allBookings = bookingRepository.findAll();
        
        Long totalReservations = (long) allBookings.size();
        Double totalRevenue = allBookings.stream()
                .mapToDouble(Booking::getTotalPrice)
                .sum();
        
        Long activeCustomers = userRepository.count() - 1; // Excluding admin
        Long activeSportFields = sportFieldRepository.count();
        
        List<BookingWebDTO> recentBookings = allBookings.stream()
                .sorted((b1, b2) -> b2.getStartDateTime().compareTo(b1.getStartDateTime()))
                .limit(5)
                .map(this::convertToBookingWebDTO)
                .collect(Collectors.toList());

        return new AdminDashboardDTO(
                totalReservations,
                totalRevenue,
                activeCustomers,
                activeSportFields,
                recentBookings
        );
    }

    public List<BookingWebDTO> getBookingsForToday() {
        LocalDateTime startOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MIDNIGHT);
        LocalDateTime endOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);
        
        return bookingRepository.findAll().stream()
                .filter(booking -> {
                    LocalDateTime start = booking.getStartDateTime();
                    return start.isAfter(startOfDay) && start.isBefore(endOfDay);
                })
                .map(this::convertToBookingWebDTO)
                .collect(Collectors.toList());
    }

    public List<RevenueHistoryDTO> getRevenueHistory() {
        List<RevenueHistoryDTO> history = new ArrayList<>();
        LocalDate today = LocalDate.now();

        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            double revenue = bookingRepository.findAll().stream()
                    .filter(booking -> booking.getStartDateTime().toLocalDate().equals(date))
                    .mapToDouble(Booking::getTotalPrice)
                    .sum();
            history.add(new RevenueHistoryDTO(date.toString(), revenue));
        }

        return history;
    }

    private BookingWebDTO convertToBookingWebDTO(Booking booking) {
        return new BookingWebDTO(
                booking.getId(),
                booking.getUser().getFullName(),
                booking.getSportField().getName(),
                booking.getStartDateTime(),
                booking.getEndDateTime(),
                booking.getTotalPrice(),
                booking.getPaid()
        );
    }
}
