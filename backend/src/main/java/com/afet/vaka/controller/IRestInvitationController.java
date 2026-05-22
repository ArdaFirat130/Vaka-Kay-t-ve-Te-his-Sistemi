package com.afet.vaka.controller;

import com.afet.vaka.dto.AcceptInvitationRequest;
import com.afet.vaka.dto.CreateInvitationRequest;
import org.springframework.http.ResponseEntity;

public interface IRestInvitationController {
    ResponseEntity<String> createInvitation(CreateInvitationRequest request);
    ResponseEntity<Boolean> verifyInvitation(String token);
    ResponseEntity<String> acceptInvitation(AcceptInvitationRequest request);
}
