package com.afet.vaka.service.impl;

import com.afet.vaka.exception.BaseException;
import com.afet.vaka.exception.ErrorMessage;
import com.afet.vaka.exception.MessageType;
import com.afet.vaka.model.Facility;
import com.afet.vaka.model.Invitation;
import com.afet.vaka.model.User;
import com.afet.vaka.model.enums.Role;
import com.afet.vaka.repository.FacilityRepository;
import com.afet.vaka.repository.InvitationRepository;
import com.afet.vaka.repository.UserRepository;
import com.afet.vaka.service.IEmailService;
import com.afet.vaka.service.IInvitationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class InvitationServiceImpl implements IInvitationService {

    @Autowired
    private InvitationRepository invitationRepository;

    @Autowired
    private FacilityRepository facilityRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private IEmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void createInvitation(com.afet.vaka.dto.CreateInvitationRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new BaseException(new ErrorMessage(MessageType.GENERAL_ERROR, "Bu e-posta adresi ile zaten bir kullanıcı mevcut."));
        }

        // Get current user from security context
        String currentUserEmail = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new BaseException(new ErrorMessage(MessageType.GENERAL_ERROR, "Kullanıcı bulunamadı.")));

        UUID finalFacilityId;
        Role finalTargetRole;

        if (currentUser.getRole() == Role.SUPER_ADMIN) {
            // SUPER_ADMIN can invite FACILITY_ADMIN or PERSONNEL to ANY facility
            if (request.getFacilityId() == null) {
                throw new BaseException(new ErrorMessage(MessageType.GENERAL_ERROR, "Super Admin davet gönderirken tesis seçmelidir."));
            }
            finalFacilityId = request.getFacilityId();
            finalTargetRole = request.getTargetRole();
        } else if (currentUser.getRole() == Role.FACILITY_ADMIN) {
            // FACILITY_ADMIN can only invite PERSONNEL to THEIR OWN facility
            finalFacilityId = currentUser.getFacility().getId();
            finalTargetRole = Role.PERSONNEL;
        } else {
            throw new BaseException(new ErrorMessage(MessageType.GENERAL_ERROR, "Davet oluşturma yetkiniz yok."));
        }

        Facility facility = facilityRepository.findById(finalFacilityId)
                .orElseThrow(() -> new BaseException(new ErrorMessage(MessageType.GENERAL_ERROR, "Tesis bulunamadı!")));

        String token = UUID.randomUUID().toString();
        
        Invitation invitation = Invitation.builder()
                .token(token)
                .email(request.getEmail())
                .facility(facility)
                .targetRole(finalTargetRole)
                .expiresAt(LocalDateTime.now().plusHours(24))
                .isUsed(false)
                .build();
                
        invitationRepository.save(invitation);
        
        emailService.sendInvitationEmail(request.getEmail(), token);
    }

    @Override
    public boolean verifyInvitation(String token) {
        Invitation invitation = invitationRepository.findByToken(token)
                .orElseThrow(() -> new BaseException(new ErrorMessage(MessageType.GENERAL_ERROR, "Davet bulunamadı veya geçersiz.")));
                
        if (invitation.isUsed()) {
            throw new BaseException(new ErrorMessage(MessageType.GENERAL_ERROR, "Bu davet daha önce kullanılmış."));
        }
        
        if (invitation.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BaseException(new ErrorMessage(MessageType.GENERAL_ERROR, "Bu davetin süresi dolmuş."));
        }
        
        return true;
    }

    @Override
    @Transactional
    public void acceptInvitation(String token, String newPassword) {
        Invitation invitation = invitationRepository.findByToken(token)
                .orElseThrow(() -> new BaseException(new ErrorMessage(MessageType.GENERAL_ERROR, "Davet bulunamadı veya geçersiz.")));
                
        if (invitation.isUsed()) {
            throw new BaseException(new ErrorMessage(MessageType.GENERAL_ERROR, "Bu davet daha önce kullanılmış."));
        }
        
        if (invitation.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BaseException(new ErrorMessage(MessageType.GENERAL_ERROR, "Bu davetin süresi dolmuş."));
        }

        User user = new User();
        user.setEmail(invitation.getEmail());
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setRole(invitation.getTargetRole() != null ? invitation.getTargetRole() : Role.PERSONNEL);
        user.setFacility(invitation.getFacility());

        userRepository.save(user);

        invitation.setUsed(true);
        invitationRepository.save(invitation);
    }
}
