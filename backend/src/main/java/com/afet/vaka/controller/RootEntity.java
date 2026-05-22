package com.afet.vaka.controller;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RootEntity<T> {

    private boolean result;
    private String errorMessage;
    private T payload;

    public static <T> RootEntity<T> ok(T payload) {
        return RootEntity.<T>builder()
                .result(true)
                .payload(payload)
                .errorMessage(null)
                .build();
    }

    public static <T> RootEntity<T> error(String errorMessage) {
        return RootEntity.<T>builder()
                .result(false)
                .payload(null)
                .errorMessage(errorMessage)
                .build();
    }
}
