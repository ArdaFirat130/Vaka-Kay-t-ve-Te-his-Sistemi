package com.afet.vaka;

import com.afet.vaka.controller.RootEntity;
import com.afet.vaka.dto.AuthRequest;
import com.afet.vaka.dto.AuthResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class AuthIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    public void testAdminLogin() {
        AuthRequest request = new AuthRequest();
        request.setEmail("admin@vaka.com");
        request.setPassword("123456");

        ResponseEntity<RootEntity<AuthResponse>> response = restTemplate.exchange(
                "/api/v1/auth/login",
                HttpMethod.POST,
                new HttpEntity<>(request),
                new ParameterizedTypeReference<RootEntity<AuthResponse>>() {}
        );

        assertEquals(HttpStatus.OK, response.getStatusCode(), "HTTP Status Code 200 (OK) dönmelidir");
        assertNotNull(response.getBody(), "Response body null olmamalıdır");
        assertTrue(response.getBody().isResult(), "RootEntity result alanı true olmalıdır");
        assertNotNull(response.getBody().getPayload().getToken(), "JWT Token null olmamalıdır");
        assertEquals("admin@vaka.com", response.getBody().getPayload().getEmail(), "Dönen email admin@vaka.com olmalıdır");
        
        System.out.println("\n=======================================================");
        System.out.println("TEST BASARILI! Admin Kullanicisi ile Giris Yapildi.");
        System.out.println("TEST JWT TOKEN: " + response.getBody().getPayload().getToken());
        System.out.println("=======================================================\n");
    }
}
