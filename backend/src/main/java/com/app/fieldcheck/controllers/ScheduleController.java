package com.app.fieldcheck.controllers;

import com.app.fieldcheck.services.ScheduleService;
import com.app.fieldcheck.web.dtos.ScheduleDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/schedules")
@RequiredArgsConstructor
public class ScheduleController {
    private final ScheduleService scheduleService;

    @GetMapping
    public List<ScheduleDTO> getAllSchedules() {
        return scheduleService.getAllSchedules();
    }

    @GetMapping("/field/{fieldId}")
    public List<ScheduleDTO> getSchedulesByField(@PathVariable Long fieldId) {
        return scheduleService.getSchedulesByFieldId(fieldId);
    }

    @GetMapping("/field/{fieldId}/day/{dayOfWeek}")
    public List<ScheduleDTO> getSchedulesByFieldAndDay(
            @PathVariable Long fieldId,
            @PathVariable String dayOfWeek) {
        return scheduleService.getSchedulesByFieldAndDay(fieldId, dayOfWeek);
    }

    @PostMapping
    public ScheduleDTO createSchedule(@Valid @RequestBody ScheduleDTO scheduleDTO) {
        return scheduleService.createSchedule(scheduleDTO);
    }

    @DeleteMapping("/{id}")
    public void deleteSchedule(@PathVariable Long id) {
        scheduleService.deleteSchedule(id);
    }
}
