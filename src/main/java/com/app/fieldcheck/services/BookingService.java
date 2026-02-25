package com.app.fieldcheck.services;


import com.app.fieldcheck.models.Booking;
import com.app.fieldcheck.repositories.BookingRepository;
import com.app.fieldcheck.repositories.SportFieldRepository;
import com.app.fieldcheck.repositories.UserRepository;
import com.app.fieldcheck.web.dtos.BookingRequest;
import com.app.fieldcheck.web.dtos.BookingWebDTO;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.hibernate.annotations.TypeRegistration;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final SportFieldRepository sportFieldRepository;
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<BookingWebDTO> getAllBookingsForWeb(){
        return bookingRepository.findAll().stream()
                .map(booking -> new BookingWebDTO(
                   booking.getId(),
                   booking.getUser().getFullName(),
                   booking.getSportField().getName(),
                   booking.getStartDateTime().toString()+ "a"+ booking.getEndDateTime(),
                   booking.getTotalPrice()
                )).toList();
    }


    @Transactional
    public BookingWebDTO createBooking(BookingRequest booking) {
        var user = userRepository.findById(booking.getUserId()).orElseThrow(()
                -> new RuntimeException("Usuario no encontrado"));
        var field = sportFieldRepository.findById(booking.getFieldId()).orElseThrow(()
                -> new RuntimeException("Cancha no encontrada"));
        LocalDateTime start = booking.getStartTime();
        LocalDateTime end = booking.getEndTime();

        long hours = Duration.between(start, end).toHours();
        if (hours <= 0) {hours=1;}
        Double calculatedPrice= field.getBasePrice()*hours;
        if(bookingRepository.existsOverLapingBooking(field.getId(), start, end)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "La cancha esta ya reservada");
        }
        Booking newBooking = Booking.builder()
                .user(user)
                .sportField(field)
                .startDateTime(start)
                .endDateTime(end)
                .totalPrice(calculatedPrice)
                .build();
        Booking saved = bookingRepository.save(newBooking);

        return new BookingWebDTO(
                saved.getId(),
                user.getFullName(),
                field.getName(),
                saved.getStartDateTime()+"a"+saved.getEndDateTime(),
                saved.getTotalPrice()
        );
    }

    public List<Booking> getBookings() {
        return bookingRepository.findAll();
    }

    public void deleteBooking(Long Id) {
        if(!bookingRepository.existsById(Id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "La reserva no existe");
        }
        bookingRepository.deleteById(Id);
    }
}
