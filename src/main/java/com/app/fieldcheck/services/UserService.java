package com.app.fieldcheck.services;

import com.app.fieldcheck.models.User;
import com.app.fieldcheck.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    public User saveUser(User user) {
        return userRepository.save(user);
    }
}
