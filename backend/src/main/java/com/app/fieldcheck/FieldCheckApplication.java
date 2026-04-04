package com.app.fieldcheck;

import com.app.fieldcheck.enums.UserRole;
import com.app.fieldcheck.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.app.fieldcheck.models.User;

@SpringBootApplication
public class FieldCheckApplication {
    public static void main(String[] args) {
        SpringApplication.run(FieldCheckApplication.class, args);
    }
    @Bean
    public CommandLineRunner initUsers(UserRepository repository, PasswordEncoder encoder) {
        return args -> {
            if (repository.findByEmail("admin@example.com").isEmpty()) {
                User admin = new User();
                admin.setFullName("Admin2");
                admin.setEmail("admin@example.com");
                admin.setPassword(encoder.encode("admin123"));
                admin.setRole(UserRole.ADMIN);
                repository.save(admin);

                User user = new User();
                user.setFullName("David");
                user.setEmail("user@example.com");
                user.setPassword(encoder.encode("user123"));
                user.setRole(UserRole.CUSTOMER);
                repository.save(user);
            }
        };
    }
}
