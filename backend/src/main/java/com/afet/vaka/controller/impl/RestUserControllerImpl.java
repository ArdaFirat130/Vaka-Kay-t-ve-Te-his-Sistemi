package com.afet.vaka.controller.impl;

import com.afet.vaka.controller.IRestUserController;
import com.afet.vaka.controller.RootEntity;
import com.afet.vaka.dto.DtoUser;
import com.afet.vaka.dto.DtoUserIU;
import com.afet.vaka.service.IUserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/users")
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FACILITY_ADMIN')")
public class RestUserControllerImpl implements IRestUserController {

    @Autowired
    private IUserService userService;

    @PostMapping
    @Override
    public RootEntity<DtoUser> createUser(@Valid @RequestBody DtoUserIU input) {
        return RootEntity.ok(userService.createUser(input));
    }

    @PutMapping("/{id}")
    @Override
    public RootEntity<DtoUser> updateUser(@PathVariable UUID id, @Valid @RequestBody DtoUserIU input) {
        return RootEntity.ok(userService.updateUser(id, input));
    }

    @GetMapping("/{id}")
    @Override
    public RootEntity<DtoUser> getUserById(@PathVariable UUID id) {
        return RootEntity.ok(userService.getUserById(id));
    }

    @GetMapping
    @Override
    public RootEntity<List<DtoUser>> getAllUsers(@org.springframework.security.core.annotation.AuthenticationPrincipal com.afet.vaka.service.impl.UserServiceImpl.UserDetailsImpl currentUser) {
        return RootEntity.ok(userService.getAllUsers(currentUser));
    }
}
