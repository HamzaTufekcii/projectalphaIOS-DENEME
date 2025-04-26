package com.projectalpha.entity;

public class User {
    private String id;
    private String name;
    private String email;
    private String password;  // Yeni eklenen alan

    public User() {
        this.id = IDgenerator.generateID();
        //exception eklenebilir
    }

    public User(String email, String password) {
        this.id = IDgenerator.generateID();
        this.email = email;
        this.password = password;  // Yeni eklenen alan
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {  // Getter metodu
        return password;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {  // Setter metodu
        this.password = password;
    }
}

