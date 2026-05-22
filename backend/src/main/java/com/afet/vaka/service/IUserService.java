package com.afet.vaka.service;

import com.afet.vaka.dto.DtoUser;
import com.afet.vaka.dto.DtoUserIU;

import java.util.List;
import java.util.UUID;

public interface IUserService {
    
    public DtoUser createUser(DtoUserIU input);
    
    public DtoUser updateUser(UUID id, DtoUserIU input);
    
    public DtoUser getUserById(UUID id);
    
    public List<DtoUser> getAllUsers();
    
}
