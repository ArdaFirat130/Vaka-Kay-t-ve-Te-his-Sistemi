package com.afet.vaka;

import com.afet.vaka.model.User;
import com.afet.vaka.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

// @Component // GÜVENLİK NEDENİYLE DEVRE DIŞI BIRAKILDI. Sadece lokal testlerde şifrenizi unutursanız açın.
public class PasswordResetRunner implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        Optional<User> adminOpt = userRepository.findByEmail("admin@vaka.com");
        if (adminOpt.isPresent()) {
            User admin = adminOpt.get();
            admin.setPassword(passwordEncoder.encode("123456"));
            userRepository.save(admin);
            System.out.println("ADMIN PASSWORD RESET TO 123456 SUCCESSFULLY!");
        }
    }
}
