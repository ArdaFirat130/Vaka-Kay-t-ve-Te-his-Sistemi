package com.afet.vaka.handler;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiError<T> {
    private String id;
    private LocalDateTime errorTime;
    private String path;
    private T errors;
}
