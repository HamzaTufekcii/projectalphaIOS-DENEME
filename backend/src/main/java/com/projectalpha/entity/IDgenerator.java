package com.projectalpha.entity;

import java.util.UUID;

public class IDgenerator {
    public static String generateID(){
        return UUID.randomUUID().toString();
    }

}