package com.afet.vaka.service.impl;

import com.afet.vaka.dto.DtoFacility;
import com.afet.vaka.dto.DtoUser;
import com.afet.vaka.dto.DtoUserIU;
import com.afet.vaka.model.Facility;
import com.afet.vaka.model.User;
import com.afet.vaka.repository.FacilityRepository;
import com.afet.vaka.repository.UserRepository;
import com.afet.vaka.service.IUserService;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements IUserService, UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FacilityRepository facilityRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // --- IUserService Metotları ---

    @Override
    @Transactional
    public DtoUser createUser(DtoUserIU input) {
        if (userRepository.findByEmail(input.getEmail()).isPresent()) {
            throw new RuntimeException("Bu e-posta adresi zaten kullanılıyor");
        }

        Facility facility = null;
        if (input.getFacilityId() != null) {
            java.util.Optional<Facility> facilityOpt = facilityRepository.findById(input.getFacilityId());
            
            if (!facilityOpt.isPresent()) {
                throw new RuntimeException("Tesis bulunamadı");
            }
            
            facility = facilityOpt.get();
        }

        User user = User.builder()
                .email(input.getEmail())
                .password(passwordEncoder.encode(input.getPassword()))
                .role(input.getRole())
                .facility(facility)
                .build();

        return mapToDto(userRepository.save(user));
    }

    @Override
    @Transactional
    public DtoUser updateUser(UUID id, DtoUserIU input) {
        java.util.Optional<User> userOpt = userRepository.findById(id);
        
        if (!userOpt.isPresent()) {
            throw new RuntimeException("Kullanıcı bulunamadı");
        }
        
        User user = userOpt.get();

        if (!user.getEmail().equals(input.getEmail()) && userRepository.findByEmail(input.getEmail()).isPresent()) {
            throw new RuntimeException("Bu e-posta adresi zaten kullanılıyor");
        }

        Facility facility = null;
        if (input.getFacilityId() != null) {
            java.util.Optional<Facility> facilityOpt = facilityRepository.findById(input.getFacilityId());
            
            if (!facilityOpt.isPresent()) {
                throw new RuntimeException("Tesis bulunamadı");
            }
            
            facility = facilityOpt.get();
        }

        user.setEmail(input.getEmail());
        if (input.getPassword() != null && !input.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(input.getPassword()));
        }
        user.setRole(input.getRole());
        user.setFacility(facility);

        return mapToDto(userRepository.save(user));
    }

    @Override
    public DtoUser getUserById(UUID id) {
        java.util.Optional<User> userOpt = userRepository.findById(id);
        
        if (!userOpt.isPresent()) {
            throw new RuntimeException("Kullanıcı bulunamadı");
        }
        
        return mapToDto(userOpt.get());
    }

    @Override
    public List<DtoUser> getAllUsers(UserDetailsImpl currentUser) {
        boolean isSuperAdmin = currentUser.getAuthorities().contains(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_SUPER_ADMIN"));
        
        List<User> users;
        if (isSuperAdmin) {
            users = userRepository.findAll();
        } else {
            if (currentUser.getFacilityId() == null) {
                throw new org.springframework.security.access.AccessDeniedException("Herhangi bir tesise atanmadığınız için personelleri göremezsiniz.");
            }
            users = userRepository.findByFacilityId(currentUser.getFacilityId());
        }
        
        List<DtoUser> dtoUsers = new java.util.ArrayList<>();
        
        for (User user : users) {
            dtoUsers.add(mapToDto(user));
        }
        
        return dtoUsers;
    }

    private DtoUser mapToDto(User user) {
        DtoFacility dtoFacility = null;
        if (user.getFacility() != null) {
            dtoFacility = DtoFacility.builder()
                    .id(user.getFacility().getId())
                    .name(user.getFacility().getName())
                    .type(user.getFacility().getType())
                    .build();
        }

        return DtoUser.builder()
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole())
                .facility(dtoFacility)
                .build();
    }

    // --- UserDetailsService Metodu ---

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        java.util.Optional<User> userOpt = userRepository.findByEmail(email);
        
        if (!userOpt.isPresent()) {
            throw new UsernameNotFoundException("Kullanıcı bulunamadı: " + email);
        }
        
        User user = userOpt.get();

        return UserDetailsImpl.build(user);
    }

    // --- İç İçe (Inner) UserDetailsImpl Sınıfı ---

    public static class UserDetailsImpl implements UserDetails {
        private static final long serialVersionUID = 1L;

        private UUID id;
        private String email;
        @JsonIgnore
        private String password;
        private UUID facilityId;
        private Collection<? extends GrantedAuthority> authorities;

        public UserDetailsImpl(UUID id, String email, String password, UUID facilityId,
                               Collection<? extends GrantedAuthority> authorities) {
            this.id = id;
            this.email = email;
            this.password = password;
            this.facilityId = facilityId;
            this.authorities = authorities;
        }

        public static UserDetailsImpl build(User user) {
            List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
            UUID facId = user.getFacility() != null ? user.getFacility().getId() : null;

            return new UserDetailsImpl(
                    user.getId(),
                    user.getEmail(),
                    user.getPassword(),
                    facId,
                    authorities);
        }

        public UUID getId() {
            return id;
        }

        public String getEmail() {
            return email;
        }

        public UUID getFacilityId() {
            return facilityId;
        }

        @Override
        public Collection<? extends GrantedAuthority> getAuthorities() {
            return authorities;
        }

        @Override
        public String getPassword() {
            return password;
        }

        @Override
        public String getUsername() {
            return email;
        }

        @Override
        public boolean isAccountNonExpired() {
            return true;
        }

        @Override
        public boolean isAccountNonLocked() {
            return true;
        }

        @Override
        public boolean isCredentialsNonExpired() {
            return true;
        }

        @Override
        public boolean isEnabled() {
            return true;
        }
    }
}
