package com.app.jobportal.controller;

import com.app.jobportal.entity.Application;
import com.app.jobportal.entity.Candidate;
import com.app.jobportal.entity.Job;
import com.app.jobportal.entity.Recruiter;
import com.app.jobportal.entity.User;
import com.app.jobportal.repository.ApplicationRepository;
import com.app.jobportal.repository.JobRepository;
import com.app.jobportal.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/applications")
public class ApplicationController {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public ApplicationController(ApplicationRepository applicationRepository, JobRepository jobRepository, UserRepository userRepository) {
        this.applicationRepository = applicationRepository;
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

    // GET /api/v1/applications/applicant-jobs — candidate sees their own applications
    @GetMapping("/applicant-jobs")
    public ResponseEntity<List<Application>> getCandidateAppliedJobs() {
        User currentUser = getCurrentUser();
        if (!(currentUser instanceof Candidate)) {
            return ResponseEntity.status(403).build();
        }
        List<Application> applications = applicationRepository.findByApplicant(currentUser);
        return ResponseEntity.ok(applications);
    }

    // POST /api/v1/applications/apply — candidate applies to a job
    @PostMapping("/apply")
    public ResponseEntity<?> applyInJob(@RequestBody Map<String, Object> payload) {
        User currentUser = getCurrentUser();
        if (!(currentUser instanceof Candidate)) {
            return ResponseEntity.status(403).body(Map.of("message", "Only candidates can apply"));
        }

        Long jobId = Long.valueOf(payload.get("jobId").toString());
        Optional<Job> optionalJob = jobRepository.findById(jobId);
        if (optionalJob.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Job not found"));
        }

        Job job = optionalJob.get();
        User candidate = currentUser;

        // Prevent duplicate applications
        if (applicationRepository.existsByApplicantAndJob(candidate, job)) {
            return ResponseEntity.badRequest().body(Map.of("message", "You have already applied for this job"));
        }

        Application application = new Application();
        application.setApplicant(candidate);
        application.setJob(job);
        application.setStatus("PENDING");

        if (payload.containsKey("coverLetter")) {
            application.setCoverLetter(payload.get("coverLetter").toString());
        }
        if (payload.containsKey("resumeUrl")) {
            application.setResumeUrl(payload.get("resumeUrl").toString());
        }

        Application savedApp = applicationRepository.save(application);
        return ResponseEntity.status(201).body(savedApp);
    }

    // GET /api/v1/applications/recruiter-jobs — recruiter sees applications on their jobs
    @GetMapping("/recruiter-jobs")
    public ResponseEntity<List<Application>> getRecruiterPostJobs() {
        User currentUser = getCurrentUser();
        if (!(currentUser instanceof Recruiter)) {
            return ResponseEntity.status(403).build();
        }
        List<Application> applications = applicationRepository.findByRecruiterId(currentUser.getId());
        return ResponseEntity.ok(applications);
    }

    // PATCH /api/v1/applications/{id} — recruiter updates application status
    @PatchMapping("/{id}")
    public ResponseEntity<?> updateApplicationStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        User currentUser = getCurrentUser();
        if (!(currentUser instanceof Recruiter)) {
            return ResponseEntity.status(403).build();
        }

        String status = payload.get("status");
        if (status == null || status.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Status is required"));
        }

        Optional<Application> optionalApp = applicationRepository.findById(id);
        if (optionalApp.isPresent()) {
            Application app = optionalApp.get();
            // Validate this recruiter owns the job
            if (!app.getJob().getCreatedBy().getId().equals(currentUser.getId())) {
                return ResponseEntity.status(403).body(Map.of("message", "Not your job posting"));
            }

            app.setStatus(status);
            applicationRepository.save(app);
            return ResponseEntity.ok(app);
        }

        return ResponseEntity.notFound().build();
    }
}
