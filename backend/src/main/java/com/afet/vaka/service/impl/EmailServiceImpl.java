package com.afet.vaka.service.impl;

import com.afet.vaka.service.IEmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements IEmailService {

    @Autowired
    private JavaMailSender emailSender;

    @Override
    public void sendInvitationEmail(String toEmail, String token) {
        String inviteLink = "http://localhost:5173/invite?token=" + token;
        
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("ardafrt2806@gmail.com");
        message.setTo(toEmail);
        message.setSubject("Afet Vaka Kayıt ve Teşhis Sistemi - Personel Daveti");
        message.setText("Merhaba,\n\nSisteme yetkili personel olarak davet edildiniz. "
                + "Aşağıdaki bağlantıya tıklayarak şifrenizi belirleyebilir ve sisteme giriş yapabilirsiniz:\n\n"
                + inviteLink + "\n\nBu bağlantı 24 saat boyunca geçerlidir.");
        
        emailSender.send(message);
    }

    @Override
    public void sendPasswordResetEmail(String toEmail, String token) {
        String resetLink = "http://localhost:5173/reset-password?token=" + token;
        
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("ardafrt2806@gmail.com");
        message.setTo(toEmail);
        message.setSubject("Afet Vaka Kayıt Sistemi - Şifre Sıfırlama");
        message.setText("Merhaba,\n\nŞifrenizi sıfırlamak için bir talepte bulundunuz. "
                + "Aşağıdaki bağlantıya tıklayarak yeni şifrenizi belirleyebilirsiniz:\n\n"
                + resetLink + "\n\nBu bağlantı 24 saat boyunca geçerlidir ve sadece tek kullanımlıktır. "
                + "Eğer bu talebi siz yapmadıysanız lütfen bu e-postayı dikkate almayınız.");
        
        emailSender.send(message);
    }
}
