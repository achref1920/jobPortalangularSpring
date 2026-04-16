package com.app.jobportal.controller;

import com.app.jobportal.entity.*;
import com.app.jobportal.repository.ApplicationRepository;
import com.app.jobportal.repository.CandidateRepository;
import com.app.jobportal.repository.JobRepository;
import com.app.jobportal.repository.RecruiterRepository;
import com.app.jobportal.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final CandidateRepository candidateRepository;
    private final RecruiterRepository recruiterRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;

    public AdminController(UserRepository userRepository,
                           CandidateRepository candidateRepository,
                           RecruiterRepository recruiterRepository,
                           JobRepository jobRepository,
                           ApplicationRepository applicationRepository) {
        this.userRepository = userRepository;
        this.candidateRepository = candidateRepository;
        this.recruiterRepository = recruiterRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
    }

    private boolean isAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) return false;
        String email = ((org.springframework.security.core.userdetails.UserDetails) auth.getPrincipal()).getUsername();
        User user = userRepository.findByEmail(email).orElse(null);
        return user instanceof Admin;
    }

    // GET /api/v1/admin/stats — dashboard statistics
    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        if (!isAdmin()) return ResponseEntity.status(403).build();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCandidates", candidateRepository.count());
        stats.put("totalRecruiters", recruiterRepository.count());
        stats.put("totalJobs", jobRepository.count());
        stats.put("totalApplications", applicationRepository.count());
        return ResponseEntity.ok(stats);
    }

    // GET /api/v1/admin/candidates — list all candidates
    @GetMapping("/candidates")
    public ResponseEntity<?> getAllCandidates() {
        if (!isAdmin()) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(candidateRepository.findAll());
    }

    // GET /api/v1/admin/recruiters — list all recruiters
    @GetMapping("/recruiters")
    public ResponseEntity<?> getAllRecruiters() {
        if (!isAdmin()) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(recruiterRepository.findAll());
    }

    // GET /api/v1/admin/jobs — list all jobs
    @GetMapping("/jobs")
    public ResponseEntity<?> getAllJobs() {
        if (!isAdmin()) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(jobRepository.findAll());
    }

    // GET /api/v1/admin/applications — list all applications
    @GetMapping("/applications")
    public ResponseEntity<?> getAllApplications() {
        if (!isAdmin()) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(applicationRepository.findAll());
    }

    // DELETE /api/v1/admin/users/{id} — delete any user
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (!isAdmin()) return ResponseEntity.status(403).build();

        Optional<User> optUser = userRepository.findById(id);
        if (optUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = optUser.get();
        if (user instanceof Admin) {
            return ResponseEntity.badRequest().body(Map.of("message", "Impossible de supprimer un admin"));
        }

        userRepository.delete(user);
        return ResponseEntity.ok(Map.of("message", "Utilisateur supprimé avec succès"));
    }

    // DELETE /api/v1/admin/jobs/{id} — delete any job
    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<?> deleteJob(@PathVariable Long id) {
        if (!isAdmin()) return ResponseEntity.status(403).build();

        if (!jobRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        jobRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Emploi supprimé avec succès"));
    }
}
