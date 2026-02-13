package com.app.fieldcheck.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Data
@Builder
@Getter
@Setter
@AllArgsConstructor
@Table(name="sports_field")
@NoArgsConstructor
public class SportField {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE,generator ="field_generator")
    @SequenceGenerator(name="field_generator",sequenceName = "sport_field_seq",allocationSize= 1)
    private Long id;
    @Column(nullable=false,length=100)
    @NotBlank(message = "el nombre del campo es obligatorio")
    private String name;
    @Column(nullable=false)
    private String type;
    @Column(name = "base_price",nullable=false)
    @Min(value = 0, message = "el valor no puede ser negativo")
    private Double basePrice;

    private String description;
}


