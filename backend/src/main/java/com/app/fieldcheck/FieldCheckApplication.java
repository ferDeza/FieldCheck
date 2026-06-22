package com.app.fieldcheck;

import com.app.fieldcheck.enums.UserRole;
import com.app.fieldcheck.repositories.UserRepository;
import com.app.fieldcheck.repositories.SportFieldRepository;
import com.app.fieldcheck.repositories.ScheduleRepository;
import com.app.fieldcheck.models.User;
import com.app.fieldcheck.models.SportField;
import com.app.fieldcheck.models.Schedule;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.app.fieldcheck.repositories.BookingRepository;
import java.time.LocalTime;
import java.util.Arrays;

@SpringBootApplication
public class FieldCheckApplication {
    public static void main(String[] args) {
        SpringApplication.run(FieldCheckApplication.class, args);
    }
    @Bean
    public CommandLineRunner initUsers(UserRepository repository, PasswordEncoder encoder) {
        return args -> {
            if (repository.findByEmail("admin@fieldcheck.com").isEmpty()) {
                User admin = new User();
                admin.setFullName("Admin FieldCheck");
                admin.setEmail("admin@fieldcheck.com");
                admin.setPassword(encoder.encode("admin123"));
                admin.setRole(UserRole.ADMIN);
                repository.save(admin);

                User user = new User();
                user.setFullName("Juan Pérez");
                user.setEmail("juan@email.com");
                user.setPassword(encoder.encode("password123"));
                user.setRole(UserRole.CUSTOMER);
                repository.save(user);
            }
        };
    }

    @Bean
    public CommandLineRunner initSportFields(SportFieldRepository repository) {
        return args -> {
            // Always ensure we have exactly 6 fields
            if (repository.count() < 6) {
                // Clear existing to start fresh
                repository.deleteAll();
                
                SportField field1 = new SportField();
                field1.setName("Cancha Ultra Cayma");
                field1.setType("Fútbol 5");
                field1.setDistrict("Cayma");
                field1.setDescription("Av. Ejército 450");
                field1.setBasePrice(50.0);
                field1.setPhotoUrl("https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&h=300&fit=crop");
                field1.setLatitude(-16.4089);
                field1.setLongitude(-71.5430);
                field1.setRating(4.8);
                repository.save(field1);

                SportField field2 = new SportField();
                field2.setName("Cancha Yanahuara Pro");
                field2.setType("Fútbol 7");
                field2.setDistrict("Yanahuara");
                field2.setDescription("Calle Lima 250");
                field2.setBasePrice(70.0);
                field2.setPhotoUrl("https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&h=300&fit=crop");
                field2.setLatitude(-16.4017);
                field2.setLongitude(-71.5340);
                field2.setRating(4.6);
                repository.save(field2);

                SportField field3 = new SportField();
                field3.setName("Complejo Cercado Central");
                field3.setType("Fútbol 11");
                field3.setDistrict("Cercado");
                field3.setDescription("Plaza de Armas S/N");
                field3.setBasePrice(100.0);
                field3.setPhotoUrl("https://images.unsplash.com/photo-1517466895453-b79a858ce64e?w=500&h=300&fit=crop");
                field3.setLatitude(-16.3988);
                field3.setLongitude(-71.5325);
                field3.setRating(4.9);
                repository.save(field3);

                SportField field4 = new SportField();
                field4.setName("Vóley La Joya");
                field4.setType("Vóley");
                field4.setDistrict("La Joya");
                field4.setDescription("Av. Kennedy 1200");
                field4.setBasePrice(40.0);
                field4.setPhotoUrl("https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=500&h=300&fit=crop");
                field4.setLatitude(-16.4256);
                field4.setLongitude(-71.5456);
                field4.setRating(4.5);
                repository.save(field4);

                SportField field5 = new SportField();
                field5.setName("Multicancha Sachaca");
                field5.setType("Fútbol 5");
                field5.setDistrict("Sachaca");
                field5.setDescription("Calle Principal 500");
                field5.setBasePrice(45.0);
                field5.setPhotoUrl("https://images.unsplash.com/photo-1516937941344-00b4ee3b2fe5?w=500&h=300&fit=crop");
                field5.setLatitude(-16.3650);
                field5.setLongitude(-71.5123);
                field5.setRating(4.7);
                repository.save(field5);

                SportField field6 = new SportField();
                field6.setName("Arena Socabaya");
                field6.setType("Fútbol 7");
                field6.setDistrict("Socabaya");
                field6.setDescription("Av. Socabaya 800");
                field6.setBasePrice(65.0);
                field6.setPhotoUrl("https://images.unsplash.com/photo-1525905388574-35e3a3c1ea9d?w=500&h=300&fit=crop");
                field6.setLatitude(-16.3789);
                field6.setLongitude(-71.5210);
                field6.setRating(4.4);
                repository.save(field6);
            }
        };
    }

    @Bean
    public CommandLineRunner initSchedules(ScheduleRepository scheduleRepository, SportFieldRepository fieldRepository) {
        return args -> {
            if (scheduleRepository.count() == 0) {
                var fields = fieldRepository.findAll();
                String[] days = {"MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"};
                
                for (SportField field : fields) {
                    for (String day : days) {
                        // Crear horarios de 7:00 a 22:00 con intervalos de 2 horas
                        for (int hour = 7; hour < 22; hour += 2) {
                            Schedule schedule = new Schedule();
                            schedule.setSportField(field);
                            schedule.setDayOfWeek(day);
                            schedule.setStartTime(LocalTime.of(hour, 0));
                            schedule.setEndTime(LocalTime.of(hour + 2, 0));
                            // Simular que algunos horarios están ocupados (~30% de probabilidad)
                            schedule.setIsAvailable(Math.random() > 0.3);
                            scheduleRepository.save(schedule);
                        }
                    }
                }
            }
        };
    }
}
