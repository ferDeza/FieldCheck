package com.app.fieldcheck.controllers;


import com.app.fieldcheck.services.AuthService;
import com.app.fieldcheck.web.dtos.LoginRequest;
import com.app.fieldcheck.web.dtos.LoginResponse;
import com.app.fieldcheck.web.dtos.RegisterRequest;
import com.app.fieldcheck.web.dtos.UserResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request){
            UserResponse userResponse = authService.register(request);
        return new ResponseEntity<>(userResponse, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request){
        String token = authService.login(request);
        return ResponseEntity.ok(new LoginResponse(token));
    }

}
