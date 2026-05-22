package com.afet.vaka.exception;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorMessage {

    private MessageType messageType;
    private String ofStatic;

    public String prepareMessage() {
        StringBuilder builder = new StringBuilder();
        if (messageType != null) {
            builder.append(messageType.getMessage());
        }
        if (ofStatic != null && !ofStatic.isEmpty()) {
            builder.append(" : ").append(ofStatic);
        }
        return builder.toString();
    }
}
