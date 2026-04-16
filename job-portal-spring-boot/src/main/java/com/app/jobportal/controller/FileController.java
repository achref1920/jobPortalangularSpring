package com.app.jobportal.controller;

import com.app.jobportal.entity.User;
import com.app.jobportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/files")
public class FileController {

    @Value("${file.upload-dir}")
    private String uploadDir;

    private final UserRepository userRepository;

    public FileController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/upload-cv")
    public ResponseEntity<?> uploadCv(@RequestParam("file") MultipartFile file) {
        // Validate auth
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return ResponseEntity.status(401).body(Map.of("message", "Non authentifié"));
        }

        // Validate file
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Aucun fichier fourni"));
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !originalFilename.toLowerCase().endsWith(".pdf")) {
            return ResponseEntity.badRequest().body(Map.of("message", "Seuls les fichiers PDF sont acceptés"));
        }

        // Max 10MB
        if (file.getSize() > 10 * 1024 * 1024) {
            return ResponseEntity.badRequest().body(Map.of("message", "Le fichier ne doit pas dépasser 10 Mo"));
        }

        try {
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename
            String uniqueFilename = UUID.randomUUID() + "_" + originalFilename.replaceAll("[^a-zA-Z0-9._-]", "_");
            Path filePath = uploadPath.resolve(uniqueFilename);

            // Save the file
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Return the URL to access the file
            String fileUrl = "/api/v1/files/cv/" + uniqueFilename;

            return ResponseEntity.ok(Map.of(
                "message", "CV téléchargé avec succès",
                "fileUrl", fileUrl,
                "fileName", originalFilename
            ));

        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Échec du téléchargement du fichier"));
        }
    }

    @GetMapping("/cv/{filename}")
    public ResponseEntity<?> serveCv(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(filename);
            if (!Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }

            byte[] fileContent = Files.readAllBytes(filePath);
            return ResponseEntity.ok()
                .header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=\"" + filename + "\"")
                .body(fileContent);

        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
