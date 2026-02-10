package com.example.server.converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Converter
public class FitbAnswerConverter implements AttributeConverter<Map<Integer, List<String>>, String> {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(Map<Integer, List<String>> attribute) {
        if (attribute == null) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(attribute);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Error converting fitb_answer to JSON", e);
        }
    }

    @Override
    public Map<Integer, List<String>> convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        try {
            return objectMapper.readValue(dbData, new TypeReference<Map<Integer, List<String>>>() {});
        } catch (IOException e) {
            throw new IllegalArgumentException("Error reading fitb_answer from JSON", e);
        }
    }
}