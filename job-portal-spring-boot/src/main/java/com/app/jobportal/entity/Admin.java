package com.app.jobportal.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "admins")
@JsonIgnoreProperties({"password"})
public class Admin extends User {

    @Override
    public String getRole() {
        return "admin";
    }
}
