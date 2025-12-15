package com.smartparking.identity;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@EnableDiscoveryClient
public class IdentityServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(IdentityServiceApplication.class, args);
    }


    @Bean
    public org.springframework.boot.CommandLineRunner commandLineRunner(com.smartparking.identity.service.AuthService service) {
        return args -> {
            try {
                service.saveUser(new com.smartparking.identity.model.UserCredential(0, "admin", "admin@smartparking.com", "admin", "ADMIN"));
                System.out.println("Default admin user created: admin / admin");
            } catch (Exception e) {
                // Ignore if already exists (though H2 is in memory, so it won't)
                System.out.println("Admin user might already exist");
            }
        };
    }
}
