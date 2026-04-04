package com.app.fieldcheck.controllers;

import com.app.fieldcheck.models.SportField;
import com.app.fieldcheck.services.SportFieldService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import tools.jackson.databind.ObjectMapper;

import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
class SportFieldControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private SportFieldService sportFieldService;

    @Autowired
    private ObjectMapper objectMapper;

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
    void testGetAllSportFields() throws Exception {
        // Arrange
        List<SportField> fields = Arrays.asList(field1, field2);
        when(sportFieldService.getAllSportFields()).thenReturn(fields);

        // Act
        ResultActions response = mockMvc.perform(get("/api/fields")
                .contentType(MediaType.APPLICATION_JSON));

        // Assert
        response.andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].name", is("Football Field A")))
                .andExpect(jsonPath("$[0].type", is("Football")))
                .andExpect(jsonPath("$[0].basePrice", is(50.0)))
                .andExpect(jsonPath("$[1].id", is(2)))
                .andExpect(jsonPath("$[1].name", is("Basketball Court B")))
                .andExpect(jsonPath("$[1].basePrice", is(40.0)));

        verify(sportFieldService, times(1)).getAllSportFields();
    }

    @Test
    void testGetAllSportFieldsEmpty() throws Exception {
        // Arrange
        when(sportFieldService.getAllSportFields()).thenReturn(Arrays.asList());

        // Act
        ResultActions response = mockMvc.perform(get("/api/fields")
                .contentType(MediaType.APPLICATION_JSON));

        // Assert
        response.andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));

        verify(sportFieldService, times(1)).getAllSportFields();
    }

    @Test
    void testCreateSportField() throws Exception {
        // Arrange
        when(sportFieldService.saveSportField(any(SportField.class))).thenReturn(field1);

        // Act
        ResultActions response = mockMvc.perform(post("/api/fields")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(field1)));

        // Assert
        response.andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.name", is("Football Field A")))
                .andExpect(jsonPath("$.type", is("Football")))
                .andExpect(jsonPath("$.basePrice", is(50.0)))
                .andExpect(jsonPath("$.description", is("Professional football field")));

        verify(sportFieldService, times(1)).saveSportField(any(SportField.class));
    }

    @Test
    void testCreateSportFieldValidation() throws Exception {
        // Arrange
        SportField invalidField = SportField.builder()
                .id(3L)
                .name("")  // Empty name should fail validation
                .type("Tennis")
                .basePrice(35.0)
                .build();

        // Act
        ResultActions response = mockMvc.perform(post("/api/fields")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidField)));

        // Assert
        response.andExpect(status().isBadRequest());
        verify(sportFieldService, never()).saveSportField(any(SportField.class));
    }

    @Test
    void testCreateSportFieldNegativePrice() throws Exception {
        // Arrange
        SportField invalidField = SportField.builder()
                .id(3L)
                .name("Tennis Court")
                .type("Tennis")
                .basePrice(-10.0)  // Negative price should fail validation
                .build();

        // Act
        ResultActions response = mockMvc.perform(post("/api/fields")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidField)));

        // Assert
        response.andExpect(status().isBadRequest());
        verify(sportFieldService, never()).saveSportField(any(SportField.class));
    }

    @Test
    void testCreateMultipleSportFields() throws Exception {
        // Arrange
        when(sportFieldService.saveSportField(any(SportField.class)))
                .thenReturn(field1)
                .thenReturn(field2);

        // Act
        ResultActions response1 = mockMvc.perform(post("/api/fields")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(field1)));

        ResultActions response2 = mockMvc.perform(post("/api/fields")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(field2)));

        // Assert
        response1.andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.name", is("Football Field A")));

        response2.andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(2)))
                .andExpect(jsonPath("$.name", is("Basketball Court B")));

        verify(sportFieldService, times(2)).saveSportField(any(SportField.class));
    }

    @Test
    void testGetAllSportFieldsWithDescriptions() throws Exception {
        // Arrange
        List<SportField> fields = Arrays.asList(field1, field2);
        when(sportFieldService.getAllSportFields()).thenReturn(fields);

        // Act
        ResultActions response = mockMvc.perform(get("/api/fields")
                .contentType(MediaType.APPLICATION_JSON));

        // Assert
        response.andExpect(status().isOk())
                .andExpect(jsonPath("$[0].description", is("Professional football field")))
                .andExpect(jsonPath("$[1].description", is("Indoor basketball court")));

        verify(sportFieldService, times(1)).getAllSportFields();
    }
}
