package com.app.jobportal.controller;

import com.app.jobportal.entity.Job;
import com.app.jobportal.entity.Recruiter;
import com.app.jobportal.entity.User;
import com.app.jobportal.repository.JobRepository;
import com.app.jobportal.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/jobs")
public class JobController {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public JobController(JobRepository jobRepository, UserRepository userRepository) {
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return null;
        }
        String email = ((org.springframework.security.core.userdetails.UserDetails) authentication.getPrincipal()).getUsername();
        return userRepository.findByEmail(email).orElse(null);
    }

    @GetMapping
    public ResponseEntity<List<Job>> getAllJobs() {
        return ResponseEntity.ok(jobRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> getSingleJob(@PathVariable Long id) {
        Optional<Job> job = jobRepository.findById(id);
        return job.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/my-jobs")
    public ResponseEntity<List<Job>> getMyJobs() {
        User currentUser = getCurrentUser();
        if (!(currentUser instanceof Recruiter)) {
            return ResponseEntity.status(403).build();
        }
        List<Job> myJobs = jobRepository.findByCreatedBy((Recruiter) currentUser);
        return ResponseEntity.ok(myJobs);
    }

    @PostMapping
    public ResponseEntity<Job> addJob(@RequestBody Job job) {
        User currentUser = getCurrentUser();
        if (!(currentUser instanceof Recruiter)) {
            return ResponseEntity.status(403).build();
        }
        job.setCreatedBy((Recruiter) currentUser);
        Job savedJob = jobRepository.save(job);
        return ResponseEntity.status(201).body(savedJob);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Job> updateSingleJob(@PathVariable Long id, @RequestBody Job jobDetails) {
        User currentUser = getCurrentUser();
        if (!(currentUser instanceof Recruiter)) {
            return ResponseEntity.status(403).build();
        }

        Optional<Job> optionalJob = jobRepository.findById(id);
        if (optionalJob.isPresent()) {
            Job job = optionalJob.get();
            if (!job.getCreatedBy().getId().equals(currentUser.getId())) {
                return ResponseEntity.status(403).build();
            }
            if (jobDetails.getCompany() != null) job.setCompany(jobDetails.getCompany());
            if (jobDetails.getPosition() != null) job.setPosition(jobDetails.getPosition());
            if (jobDetails.getJobStatus() != null) job.setJobStatus(jobDetails.getJobStatus());
            if (jobDetails.getJobType() != null) job.setJobType(jobDetails.getJobType());
            if (jobDetails.getLocation() != null) job.setLocation(jobDetails.getLocation());
            if (jobDetails.getVacancy() != null) job.setVacancy(jobDetails.getVacancy());
            if (jobDetails.getSalary() != null) job.setSalary(jobDetails.getSalary());
            if (jobDetails.getDeadline() != null) job.setDeadline(jobDetails.getDeadline());
            if (jobDetails.getDescription() != null) job.setDescription(jobDetails.getDescription());
            if (jobDetails.getSkills() != null) job.setSkills(jobDetails.getSkills());
            if (jobDetails.getFacilities() != null) job.setFacilities(jobDetails.getFacilities());
            if (jobDetails.getContact() != null) job.setContact(jobDetails.getContact());
            if (jobDetails.getRequirements() != null) job.setRequirements(jobDetails.getRequirements());

            return ResponseEntity.ok(jobRepository.save(job));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSingleJob(@PathVariable Long id) {
        User currentUser = getCurrentUser();
        if (!(currentUser instanceof Recruiter)) {
            return ResponseEntity.status(403).build();
        }

        Optional<Job> optionalJob = jobRepository.findById(id);
        if (optionalJob.isPresent()) {
            Job job = optionalJob.get();
            if (!job.getCreatedBy().getId().equals(currentUser.getId())) {
                return ResponseEntity.status(403).build();
            }
            jobRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
