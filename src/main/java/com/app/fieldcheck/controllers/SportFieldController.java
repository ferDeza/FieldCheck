package com.app.fieldcheck.controllers;

import com.app.fieldcheck.models.SportField;
import com.app.fieldcheck.services.SportFieldService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fields")
@RequiredArgsConstructor
public class SportFieldController {
    private final SportFieldService sportFieldService;
    @GetMapping
    public List<SportField> getAllSportFields() {
        return sportFieldService.getAllSportFields();
    }
    @PostMapping
    public SportField createSportField(@Valid @RequestBody SportField sportField) {
        return sportFieldService.saveSportField(sportField);
    }
}
