package com.afet.vaka.service;

public interface IEmailService {
    void sendInvitationEmail(String toEmail, String token);
    void sendPasswordResetEmail(String toEmail, String token);
}
