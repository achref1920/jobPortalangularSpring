package com.app.jobportal.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "candidates")
@JsonIgnoreProperties({"password"})
public class Candidate extends User {

    private String phone;

    @Column(columnDefinition = "TEXT")
    private String skills;

    private String experience;

    private String education;

    private String resume;

    @OneToMany(mappedBy = "applicant", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Application> applications;

    @Override
    public String getRole() {
        return "candidate";
    }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }
    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }
    public String getEducation() { return education; }
    public void setEducation(String education) { this.education = education; }
    public String getResume() { return resume; }
    public void setResume(String resume) { this.resume = resume; }
    public List<Application> getApplications() { return applications; }
    public void setApplications(List<Application> applications) { this.applications = applications; }
}
