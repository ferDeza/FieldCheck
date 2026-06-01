package com.app.fieldcheck.services;

import com.app.fieldcheck.models.Schedule;
import com.app.fieldcheck.models.SportField;
import com.app.fieldcheck.repositories.ScheduleRepository;
import com.app.fieldcheck.repositories.SportFieldRepository;
import com.app.fieldcheck.web.dtos.ScheduleDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScheduleService {
    private final ScheduleRepository scheduleRepository;
    private final SportFieldRepository sportFieldRepository;

    public List<ScheduleDTO> getSchedulesByFieldId(Long fieldId) {
        return scheduleRepository.findBySportFieldId(fieldId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ScheduleDTO> getSchedulesByFieldAndDay(Long fieldId, String dayOfWeek) {
        return scheduleRepository.findBySportFieldIdAndDayOfWeek(fieldId, dayOfWeek)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ScheduleDTO createSchedule(ScheduleDTO scheduleDTO) {
        SportField sportField = sportFieldRepository.findById(scheduleDTO.fieldId())
                .orElseThrow(() -> new RuntimeException("SportField not found"));

        Schedule schedule = Schedule.builder()
                .sportField(sportField)
                .dayOfWeek(scheduleDTO.dayOfWeek())
                .startTime(scheduleDTO.startTime())
                .endTime(scheduleDTO.endTime())
                .isAvailable(scheduleDTO.isAvailable())
                .build();

        Schedule savedSchedule = scheduleRepository.save(schedule);
        return convertToDTO(savedSchedule);
    }

    public List<ScheduleDTO> getAllSchedules() {
        return scheduleRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public void deleteSchedule(Long id) {
        scheduleRepository.deleteById(id);
    }

    private ScheduleDTO convertToDTO(Schedule schedule) {
        return new ScheduleDTO(
                schedule.getId(),
                schedule.getSportField().getId(),
                schedule.getDayOfWeek(),
                schedule.getStartTime(),
                schedule.getEndTime(),
                schedule.getIsAvailable()
        );
    }
}
