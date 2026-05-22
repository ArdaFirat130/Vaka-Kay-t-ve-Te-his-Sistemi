package com.afet.vaka.handler;

import com.afet.vaka.exception.BaseException;
import com.afet.vaka.exception.MessageType;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BaseException.class)
    public ResponseEntity<ApiError<ExceptionDetails>> handleBaseException(BaseException exception, HttpServletRequest request) {
        ExceptionDetails exceptionDetails = ExceptionDetails.builder()
                .code(exception.getErrorMessage().getMessageType() != null ? 
                      exception.getErrorMessage().getMessageType().getCode() : MessageType.GENERAL_ERROR.getCode())
                .message(exception.getMessage())
                .build();

        return ResponseEntity.badRequest().body(createApiError(exceptionDetails, request.getRequestURI()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError<List<ExceptionDetails>>> handleValidationException(MethodArgumentNotValidException exception, HttpServletRequest request) {
        List<ExceptionDetails> detailsList = new ArrayList<>();

        for (FieldError fieldError : exception.getBindingResult().getFieldErrors()) {
            detailsList.add(ExceptionDetails.builder()
                    .code(MessageType.BAD_REQUEST.getCode())
                    .message(fieldError.getField() + " : " + fieldError.getDefaultMessage())
                    .build());
        }

        return ResponseEntity.badRequest().body(createApiError(detailsList, request.getRequestURI()));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiError<ExceptionDetails>> handleAccessDeniedException(AccessDeniedException exception, HttpServletRequest request) {
        ExceptionDetails exceptionDetails = ExceptionDetails.builder()
                .code(MessageType.ACCESS_DENIED.getCode())
                .message(MessageType.ACCESS_DENIED.getMessage())
                .build();

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(createApiError(exceptionDetails, request.getRequestURI()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError<ExceptionDetails>> handleGeneralException(Exception exception, HttpServletRequest request) {
        ExceptionDetails exceptionDetails = ExceptionDetails.builder()
                .code(MessageType.GENERAL_ERROR.getCode())
                .message(MessageType.GENERAL_ERROR.getMessage() + " - " + exception.getMessage())
                .build();

        return ResponseEntity.internalServerError().body(createApiError(exceptionDetails, request.getRequestURI()));
    }

    private <T> ApiError<T> createApiError(T errors, String path) {
        return ApiError.<T>builder()
                .id(UUID.randomUUID().toString())
                .errorTime(LocalDateTime.now())
                .path(path)
                .errors(errors)
                .build();
    }
}
