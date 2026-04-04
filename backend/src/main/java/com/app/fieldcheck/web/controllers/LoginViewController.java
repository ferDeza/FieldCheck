package com.app.fieldcheck.web.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
@Controller
@RequestMapping("/login")
@RequiredArgsConstructor
public class LoginViewController {
    @GetMapping
    public String login() {
        return "login";
    }
}
