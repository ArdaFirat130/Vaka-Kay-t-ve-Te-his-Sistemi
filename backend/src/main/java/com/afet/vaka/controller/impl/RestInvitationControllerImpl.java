package com.afet.vaka.controller.impl;

import com.afet.vaka.controller.IRestInvitationController;
import com.afet.vaka.dto.AcceptInvitationRequest;
import com.afet.vaka.dto.CreateInvitationRequest;
import com.afet.vaka.service.IInvitationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/invitations")
public class RestInvitationControllerImpl implements IRestInvitationController {

    @Autowired
    private IInvitationService invitationService;

    @Override
    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('FACILITY_ADMIN')")
    public ResponseEntity<String> createInvitation(@Valid @RequestBody CreateInvitationRequest request) {
        invitationService.createInvitation(request);
        return ResponseEntity.ok("Davetiye başarıyla gönderildi.");
    }

    @Override
    @GetMapping("/verify/{token}")
    public ResponseEntity<Boolean> verifyInvitation(@PathVariable String token) {
        return ResponseEntity.ok(invitationService.verifyInvitation(token));
    }

    @Override
    @PostMapping("/accept")
    public ResponseEntity<String> acceptInvitation(@Valid @RequestBody AcceptInvitationRequest request) {
        invitationService.acceptInvitation(request.getToken(), request.getPassword());
        return ResponseEntity.ok("Şifre başarıyla belirlendi. Artık giriş yapabilirsiniz.");
    }
}
