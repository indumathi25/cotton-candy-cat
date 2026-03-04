package com.maplewood.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import com.maplewood.dto.ErrorResponse;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestControllerAdvice
public class GlobalExceptionHandler {
        private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

        @ExceptionHandler(IllegalArgumentException.class)
        public ResponseEntity<ErrorResponse> handleIllegalArgumentException(
                        IllegalArgumentException ex) {
                log.warn("Bad request: {}", ex.getMessage());
                return buildResponse(
                                HttpStatus.BAD_REQUEST,
                                ex.getMessage(),
                                null,
                                null);
        }

        @ExceptionHandler(ResourceNotFoundException.class)
        public ResponseEntity<ErrorResponse> handleResourceNotFoundException(
                        ResourceNotFoundException ex) {
                log.warn("Resource not found: {}", ex.getMessage());
                return buildResponse(
                                HttpStatus.NOT_FOUND,
                                ex.getMessage(),
                                null,
                                null);
        }

        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<ErrorResponse> handleValidationException(
                        MethodArgumentNotValidException ex) {

                Map<String, String> fieldErrors = ex.getBindingResult()
                                .getFieldErrors()
                                .stream()
                                .collect(Collectors.toMap(
                                                FieldError::getField,
                                                FieldError::getDefaultMessage,
                                                (existing, replacement) -> existing));

                return buildResponse(
                                HttpStatus.BAD_REQUEST,
                                "Validation failed",
                                fieldErrors,
                                null);
        }

        @ExceptionHandler(Exception.class)
        public ResponseEntity<ErrorResponse> handleGlobalException(Exception ex) {
                log.error("Unhandled exception: ", ex);
                return buildResponse(
                                HttpStatus.INTERNAL_SERVER_ERROR,
                                "An unexpected error occurred",
                                null,
                                ex.getMessage());
        }

        private ResponseEntity<ErrorResponse> buildResponse(
                        HttpStatus status,
                        String message,
                        Map<String, String> errors,
                        String details) {

                ErrorResponse response = new ErrorResponse(
                                LocalDateTime.now(),
                                status.value(),
                                status.getReasonPhrase(),
                                message,
                                errors,
                                details);

                return ResponseEntity.status(status).body(response);
        }
}
