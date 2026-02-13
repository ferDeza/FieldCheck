package com.app.fieldcheck.controllers;
import com.app.fieldcheck.models.User;
import com.app.fieldcheck.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UsersController {
    private final UserService userService;
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.saveUser(user);
    }
}
