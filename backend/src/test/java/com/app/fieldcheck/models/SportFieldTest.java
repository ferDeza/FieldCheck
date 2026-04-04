package com.app.fieldcheck.models;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class SportFieldTest {

    private SportField sportField;

    @BeforeEach
    void setUp() {
        sportField = SportField.builder()
                .id(1L)
                .name("Football Field A")
                .type("Football")
                .basePrice(50.0)
                .description("Professional football field")
                .build();
    }

    @Test
    void testSportFieldCreation() {
        // Assert
        assertNotNull(sportField);
        assertEquals(1L, sportField.getId());
        assertEquals("Football Field A", sportField.getName());
        assertEquals("Football", sportField.getType());
        assertEquals(50.0, sportField.getBasePrice());
        assertEquals("Professional football field", sportField.getDescription());
    }

    @Test
    void testSportFieldGetters() {
        // Assert
        assertEquals("Football Field A", sportField.getName());
        assertEquals("Football", sportField.getType());
        assertEquals(50.0, sportField.getBasePrice());
    }

    @Test
    void testSportFieldBuilder() {
        // Act
        SportField builtField = SportField.builder()
                .id(2L)
                .name("Basketball Court")
                .type("Basketball")
                .basePrice(40.0)
                .description("Indoor court")
                .build();

        // Assert
        assertNotNull(builtField);
        assertEquals("Basketball Court", builtField.getName());
        assertEquals(40.0, builtField.getBasePrice());
    }

    @Test
    void testSportFieldSetters() {
        // Act
        sportField.setName("Updated Field");
        sportField.setBasePrice(60.0);
        sportField.setDescription("Updated description");

        // Assert
        assertEquals("Updated Field", sportField.getName());
        assertEquals(60.0, sportField.getBasePrice());
        assertEquals("Updated description", sportField.getDescription());
    }

    @Test
    void testSportFieldOptionalDescription() {
        // Arrange
        SportField fieldNoDesc = SportField.builder()
                .id(3L)
                .name("Tennis Court")
                .type("Tennis")
                .basePrice(35.0)
                .build();

        // Assert
        assertNull(fieldNoDesc.getDescription());
    }

    @Test
    void testSportFieldNoArgsConstructor() {
        // Act
        SportField noArgsField = new SportField();
        noArgsField.setId(4L);
        noArgsField.setName("Volleyball Court");
        noArgsField.setType("Volleyball");
        noArgsField.setBasePrice(45.0);

        // Assert
        assertEquals(4L, noArgsField.getId());
        assertEquals("Volleyball Court", noArgsField.getName());
        assertEquals("Volleyball", noArgsField.getType());
        assertEquals(45.0, noArgsField.getBasePrice());
    }

    @Test
    void testSportFieldEquality() {
        // Arrange
        SportField field2 = SportField.builder()
                .id(1L)
                .name("Football Field A")
                .type("Football")
                .basePrice(50.0)
                .description("Professional football field")
                .build();

        // Assert
        assertEquals(sportField, field2);
    }

    @Test
    void testSportFieldDifferentPrices() {
        // Arrange
        SportField expensiveField = SportField.builder()
                .id(1L)
                .name("Premium Field")
                .type("Football")
                .basePrice(100.0)
                .build();

        SportField cheapField = SportField.builder()
                .id(2L)
                .name("Budget Field")
                .type("Football")
                .basePrice(20.0)
                .build();

        // Assert
        assertEquals(100.0, expensiveField.getBasePrice());
        assertEquals(20.0, cheapField.getBasePrice());
        assertNotEquals(expensiveField.getBasePrice(), cheapField.getBasePrice());
    }

    @Test
    void testSportFieldTypes() {
        // Arrange
        SportField footballField = sportField;
        SportField basketballField = SportField.builder()
                .id(2L)
                .name("Basketball Court")
                .type("Basketball")
                .basePrice(40.0)
                .build();

        // Assert
        assertEquals("Football", footballField.getType());
        assertEquals("Basketball", basketballField.getType());
    }

    @Test
    void testSportFieldPriceValidation() {
        // Arrange
        SportField validField = SportField.builder()
                .id(1L)
                .name("Valid Field")
                .type("Football")
                .basePrice(0.0) // Minimum valid price
                .build();

        // Assert
        assertEquals(0.0, validField.getBasePrice());
    }
}
