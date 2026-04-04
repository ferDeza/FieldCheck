package com.app.fieldcheck.services;

import com.app.fieldcheck.models.SportField;
import com.app.fieldcheck.repositories.SportFieldRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SportFieldServiceTest {

    @Mock
    private SportFieldRepository sportFieldRepository;

    @InjectMocks
    private SportFieldService sportFieldService;

    private SportField field1;
    private SportField field2;

    @BeforeEach
    void setUp() {
        field1 = SportField.builder()
                .id(1L)
                .name("Football Field A")
                .type("Football")
                .basePrice(50.0)
                .description("Professional football field")
                .build();

        field2 = SportField.builder()
                .id(2L)
                .name("Basketball Court B")
                .type("Basketball")
                .basePrice(40.0)
                .description("Indoor basketball court")
                .build();
    }

    @Test
    void testGetAllSportFields() {
        // Arrange
        List<SportField> fields = Arrays.asList(field1, field2);
        when(sportFieldRepository.findAll()).thenReturn(fields);

        // Act
        List<SportField> result = sportFieldService.getAllSportFields();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(field1.getName(), result.get(0).getName());
        assertEquals(field2.getType(), result.get(1).getType());
        verify(sportFieldRepository, times(1)).findAll();
    }

    @Test
    void testGetAllSportFieldsEmpty() {
        // Arrange
        when(sportFieldRepository.findAll()).thenReturn(Arrays.asList());

        // Act
        List<SportField> result = sportFieldService.getAllSportFields();

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(sportFieldRepository, times(1)).findAll();
    }

    @Test
    void testSaveSportField() {
        // Arrange
        when(sportFieldRepository.save(field1)).thenReturn(field1);

        // Act
        SportField result = sportFieldService.saveSportField(field1);

        // Assert
        assertNotNull(result);
        assertEquals(field1.getId(), result.getId());
        assertEquals(field1.getName(), result.getName());
        assertEquals(field1.getBasePrice(), result.getBasePrice());
        verify(sportFieldRepository, times(1)).save(field1);
    }

    @Test
    void testSaveSportFieldWithValidation() {
        // Arrange
        SportField validField = SportField.builder()
                .id(3L)
                .name("Tennis Court")
                .type("Tennis")
                .basePrice(35.0)
                .description("Outdoor tennis court")
                .build();

        when(sportFieldRepository.save(validField)).thenReturn(validField);

        // Act
        SportField result = sportFieldService.saveSportField(validField);

        // Assert
        assertNotNull(result);
        assertEquals("Tennis Court", result.getName());
        assertEquals(35.0, result.getBasePrice());
        verify(sportFieldRepository, times(1)).save(validField);
    }

    @Test
    void testSaveMultipleSportFields() {
        // Arrange
        when(sportFieldRepository.save(field1)).thenReturn(field1);
        when(sportFieldRepository.save(field2)).thenReturn(field2);

        // Act
        SportField result1 = sportFieldService.saveSportField(field1);
        SportField result2 = sportFieldService.saveSportField(field2);

        // Assert
        assertNotNull(result1);
        assertNotNull(result2);
        assertEquals(field1.getId(), result1.getId());
        assertEquals(field2.getId(), result2.getId());
        verify(sportFieldRepository, times(2)).save(any(SportField.class));
    }
}
