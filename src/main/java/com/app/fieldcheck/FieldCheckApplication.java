package com.app.fieldcheck;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;


@SpringBootApplication
public class FieldCheckApplication {
    public static void main(String[] args) {
        SpringApplication.run(FieldCheckApplication.class, args);
    }
    @Bean
    public UserDetailsService userDetailsService(PasswordEncoder passwordEncoder) {
        UserDetails user = User.builder()
                .username("fernando").
                password(passwordEncoder.encode("pass12345")).
                roles("USER").
                build();
        UserDetails admin = User.builder().
                username("admin").
                password(passwordEncoder.encode("pass56789")).
                roles("ADMIN").
                build();
        return new InMemoryUserDetailsManager(user, admin);
    }
}
