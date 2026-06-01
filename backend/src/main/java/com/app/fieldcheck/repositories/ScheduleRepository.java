package com.app.fieldcheck.repositories;

import com.app.fieldcheck.models.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findBySportFieldId(Long sportFieldId);
    List<Schedule> findBySportFieldIdAndDayOfWeek(Long sportFieldId, String dayOfWeek);
}
