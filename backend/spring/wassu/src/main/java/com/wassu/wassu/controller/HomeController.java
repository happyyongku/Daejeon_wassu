package com.wassu.wassu.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/public")
    public String testPublic() {
        return "public";
    }

    @GetMapping("/admin")
    public String testAdmin(){
        return "admin";
    }

    @GetMapping("/login")
    public String testLogin(){
        return "login";
    }
}