package com.app.fieldcheck.services;


import com.app.fieldcheck.enums.UserRole;
import com.app.fieldcheck.models.User;
import com.app.fieldcheck.repositories.UserRepository;
import com.app.fieldcheck.web.dtos.RegisterRequest;
import com.app.fieldcheck.web.dtos.UserResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.beans.Transient;

@Service
@RequiredArgsConstructor

public class AuthService {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    @Transactional
    public UserResponse register(RegisterRequest request){
        if(userRepository.findByEmail(request.email()).isPresent()){
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,"Email ya registrado");
        }
        String encodedPassword = passwordEncoder.encode(request.password());
        User user = User.builder().
                fullName(request.fullName()).
                email(request.email()).
                password(encodedPassword).
                role(UserRole.CUSTOMER).
                build();
        User savedUser = userRepository.save(user);
        return new  UserResponse(savedUser.getId()
                ,savedUser.getFullName(),
                savedUser.getEmail(),
                savedUser.getRole().name());
    }
}
