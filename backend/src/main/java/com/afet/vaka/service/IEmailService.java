package com.afet.vaka.service;

public interface IEmailService {
    void sendInvitationEmail(String toEmail, String token);
}
