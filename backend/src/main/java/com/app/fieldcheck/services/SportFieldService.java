package com.app.fieldcheck.services;
import com.app.fieldcheck.models.SportField;
import com.app.fieldcheck.repositories.SportFieldRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SportFieldService {
    private final SportFieldRepository sportFieldRepository;

    public List<SportField> getAllSportFields() {
        return sportFieldRepository.findAll();
    }

    public List<SportField> getFieldsByType(String type) {
        return sportFieldRepository.findByType(type);
    }

    public List<SportField> getFieldsByDistrict(String district) {
        return sportFieldRepository.findAll().stream()
                .filter(field -> field.getDistrict() != null && field.getDistrict().equalsIgnoreCase(district))
                .collect(Collectors.toList());
    }

    public List<SportField> getFieldsByDistrictAndType(String district, String type) {
        return sportFieldRepository.findAll().stream()
                .filter(field -> 
                    (field.getDistrict() != null && field.getDistrict().equalsIgnoreCase(district)) &&
                    (field.getType() != null && field.getType().equalsIgnoreCase(type))
                )
                .collect(Collectors.toList());
    }

    public SportField saveSportField(SportField sportField) {
        return sportFieldRepository.save(sportField);
    }
}

