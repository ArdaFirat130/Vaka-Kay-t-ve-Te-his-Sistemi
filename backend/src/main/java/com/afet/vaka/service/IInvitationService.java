package com.afet.vaka.service;

import com.afet.vaka.dto.CreateInvitationRequest;

public interface IInvitationService {
    void createInvitation(CreateInvitationRequest request);
    boolean verifyInvitation(String token);
    void acceptInvitation(String token, String newPassword);
}
