package com.afet.vaka.controller;

import com.afet.vaka.dto.DtoUser;
import com.afet.vaka.dto.DtoUserIU;

import java.util.UUID;

public interface IRestUserController {
    public RootEntity<DtoUser> createUser(DtoUserIU input);
    public RootEntity<DtoUser> updateUser(UUID id, DtoUserIU input);
    public RootEntity<DtoUser> getUserById(UUID id);
    public RootEntity<java.util.List<DtoUser>> getAllUsers(@org.springframework.security.core.annotation.AuthenticationPrincipal com.afet.vaka.service.impl.UserServiceImpl.UserDetailsImpl currentUser);
}
