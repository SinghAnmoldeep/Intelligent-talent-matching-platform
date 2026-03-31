package com.talentmatching.exception;

// Exception used when a requested resource cannot be found
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}


