package com.app.fieldcheck.services;

import com.app.fieldcheck.models.SportField;
import com.app.fieldcheck.repositories.SportFieldRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SportFieldService {
    private final SportFieldRepository sportFieldRepository;

    public List<SportField> getAllSportFields() {
        return sportFieldRepository.findAll();
    }
    public SportField saveSportField(SportField sportField) {
        return sportFieldRepository.save(sportField);
    }
}
