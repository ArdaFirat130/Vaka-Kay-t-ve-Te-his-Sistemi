package com.afet.vaka.exception;

import lombok.Getter;

@Getter
public enum MessageType {
    NO_RECORD_EXIST("1001", "Kayıt bulunamadı"),
    GENERAL_ERROR("9999", "Genel bir hata oluştu"),
    UNAUTHORIZED("1002", "Yetkisiz işlem"),
    BAD_REQUEST("1003", "Geçersiz istek"),
    ACCESS_DENIED("1004", "Bu işlem için yetkiniz bulunmamaktadır"),
    ALREADY_EXISTS("1005", "Kayıt zaten mevcut");

    private final String code;
    private final String message;

    MessageType(String code, String message) {
        this.code = code;
        this.message = message;
    }
}
