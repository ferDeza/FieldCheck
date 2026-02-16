package com.app.fieldcheck.repositories;

import com.app.fieldcheck.models.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;


@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    @Query("SELECT COUNT(b) > 0 FROM Booking b WHERE b.sportField.id = :fieldId " +
            "AND (:start < b.endDateTime AND :end > b.startDateTime)")
    boolean existsOverLapingBooking(@Param("fieldId")Long fieldId,
                                    @Param("start") LocalDateTime start,
                                    @Param("end")LocalDateTime end);

}
