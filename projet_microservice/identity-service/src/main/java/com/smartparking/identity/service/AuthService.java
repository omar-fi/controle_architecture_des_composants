package com.smartparking.identity.service;

import com.smartparking.identity.model.UserCredential;
import com.smartparking.identity.repository.UserCredentialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserCredentialRepository repository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    public String saveUser(UserCredential credential) {
        credential.setPassword(passwordEncoder.encode(credential.getPassword()));
        if(credential.getRole() == null || credential.getRole().isEmpty()) {
            credential.setRole("USER");
        }
        repository.save(credential);
        return "user added to the system";
    }

    public String generateToken(String username) {
        UserCredential user = repository.findByName(username).orElseThrow(() -> new RuntimeException("User not found"));
        return jwtService.generateToken(username, user.getRole(), user.getEmail());
    }

    public void validateToken(String token) {
        jwtService.validateToken(token);
    }
}
