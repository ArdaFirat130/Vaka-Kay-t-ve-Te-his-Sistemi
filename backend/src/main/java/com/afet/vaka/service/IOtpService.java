package com.afet.vaka.service;

import com.afet.vaka.dto.SendOtpRequest;
import com.afet.vaka.dto.VerifyOtpRequest;

public interface IOtpService {
    void sendOtp(SendOtpRequest request);
    String verifyOtp(VerifyOtpRequest request); // Returns JWT session token
}
