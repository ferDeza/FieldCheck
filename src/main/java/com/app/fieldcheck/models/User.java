package com.app.fieldcheck.models;
import com.app.fieldcheck.enums.UserRole;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name="users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE,generator ="user_generator")
    @SequenceGenerator(name="user_generator",sequenceName = "user_seq",allocationSize= 1)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false,unique = true)
    private String email;

    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    private UserRole role;
}
