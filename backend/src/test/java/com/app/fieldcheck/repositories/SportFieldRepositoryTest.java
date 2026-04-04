package com.app.fieldcheck.repositories;

import com.app.fieldcheck.models.SportField;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
class SportFieldRepositoryTest {

    @Autowired
    private SportFieldRepository sportFieldRepository;

    private SportField field1;
    private SportField field2;
    private SportField field3;

    @BeforeEach
    void setUp() {
        field1 = SportField.builder()
                .name("Football Field A")
                .type("Football")
                .basePrice(50.0)
                .description("Professional football field")
                .build();

        field2 = SportField.builder()
                .name("Basketball Court B")
                .type("Basketball")
                .basePrice(40.0)
                .description("Indoor basketball court")
                .build();

        field3 = SportField.builder()
                .name("Football Field C")
                .type("Football")
                .basePrice(55.0)
                .description("Another football field")
                .build();
    }

    @Test
    void testSaveSportField() {
        // Act
        SportField savedField = sportFieldRepository.save(field1);

        // Assert
        assertNotNull(savedField);
        assertNotNull(savedField.getId());
        assertEquals("Football Field A", savedField.getName());
        assertEquals("Football", savedField.getType());
        assertEquals(50.0, savedField.getBasePrice());
    }

    @Test
    void testFindById() {
        // Arrange
        SportField savedField = sportFieldRepository.save(field1);

        // Act
        Optional<SportField> foundField = sportFieldRepository.findById(savedField.getId());

        // Assert
        assertTrue(foundField.isPresent());
        assertEquals(savedField.getId(), foundField.get().getId());
        assertEquals(field1.getName(), foundField.get().getName());
    }

    @Test
    void testFindByIdNotFound() {
        // Act
        Optional<SportField> foundField = sportFieldRepository.findById(999L);

        // Assert
        assertFalse(foundField.isPresent());
    }

    @Test
    void testFindByType() {
        // Arrange
        sportFieldRepository.save(field1);
        sportFieldRepository.save(field2);
        sportFieldRepository.save(field3);

        // Act
        List<SportField> footballFields = sportFieldRepository.findByType("Football");

        // Assert
        assertNotNull(footballFields);
        assertEquals(2, footballFields.size());
        assertTrue(footballFields.stream().allMatch(f -> f.getType().equals("Football")));
    }

    @Test
    void testFindByTypeNotFound() {
        // Act
        List<SportField> tennisFields = sportFieldRepository.findByType("Tennis");

        // Assert
        assertNotNull(tennisFields);
        assertTrue(tennisFields.isEmpty());
    }

    @Test
    void testFindByTypeSingleResult() {
        // Arrange
        sportFieldRepository.save(field1);
        sportFieldRepository.save(field2);

        // Act
        List<SportField> basketballFields = sportFieldRepository.findByType("Basketball");

        // Assert
        assertEquals(1, basketballFields.size());
        assertEquals("Basketball Court B", basketballFields.get(0).getName());
    }

    @Test
    void testFindAllSportFields() {
        // Arrange
        sportFieldRepository.save(field1);
        sportFieldRepository.save(field2);
        sportFieldRepository.save(field3);

        // Act
        List<SportField> allFields = sportFieldRepository.findAll();

        // Assert
        assertEquals(3, allFields.size());
    }

    @Test
    void testDeleteSportField() {
        // Arrange
        SportField savedField = sportFieldRepository.save(field1);
        Long fieldId = savedField.getId();

        // Act
        sportFieldRepository.deleteById(fieldId);

        // Assert
        assertFalse(sportFieldRepository.findById(fieldId).isPresent());
    }

    @Test
    void testUpdateSportField() {
        // Arrange
        SportField savedField = sportFieldRepository.save(field1);

        // Act
        savedField.setName("Updated Football Field");
        savedField.setBasePrice(60.0);
        SportField updatedField = sportFieldRepository.save(savedField);

        // Assert
        assertEquals("Updated Football Field", updatedField.getName());
        assertEquals(60.0, updatedField.getBasePrice());
    }

    @Test
    void testMultipleFieldsOfDifferentTypes() {
        // Arrange
        SportField tennisField = SportField.builder()
                .name("Tennis Court")
                .type("Tennis")
                .basePrice(35.0)
                .build();

        sportFieldRepository.save(field1);
        sportFieldRepository.save(field2);
        sportFieldRepository.save(tennisField);

        // Act
        List<SportField> allFields = sportFieldRepository.findAll();
        List<SportField> footballFields = sportFieldRepository.findByType("Football");
        List<SportField> tennisFields = sportFieldRepository.findByType("Tennis");

        // Assert
        assertEquals(3, allFields.size());
        assertEquals(1, footballFields.size());
        assertEquals(1, tennisFields.size());
    }
}
