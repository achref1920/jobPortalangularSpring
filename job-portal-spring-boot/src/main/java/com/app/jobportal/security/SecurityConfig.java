package com.app.jobportal.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtRequestFilter jwtRequestFilter;

    public SecurityConfig(JwtRequestFilter jwtRequestFilter) {
        this.jwtRequestFilter = jwtRequestFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/api/v1/auth/**").permitAll()

                // Recruiter-only job management (MUST come before the GET wildcard)
                .requestMatchers("/api/v1/jobs/my-jobs").hasRole("RECRUITER")
                .requestMatchers(HttpMethod.POST, "/api/v1/jobs").hasRole("RECRUITER")
                .requestMatchers(HttpMethod.PATCH, "/api/v1/jobs/**").hasRole("RECRUITER")
                .requestMatchers(HttpMethod.DELETE, "/api/v1/jobs/**").hasRole("RECRUITER")

                // Public read access to all jobs (wildcard AFTER specific routes)
                .requestMatchers(HttpMethod.GET, "/api/v1/jobs/**").permitAll()

                // Application endpoints
                .requestMatchers("/api/v1/applications/apply").hasRole("CANDIDATE")
                .requestMatchers("/api/v1/applications/applicant-jobs").hasRole("CANDIDATE")
                .requestMatchers("/api/v1/applications/recruiter-jobs").hasRole("RECRUITER")
                .requestMatchers(HttpMethod.PATCH, "/api/v1/applications/**").hasRole("RECRUITER")

                // File upload/download
                .requestMatchers("/api/v1/files/upload-cv").hasRole("CANDIDATE")
                .requestMatchers(HttpMethod.GET, "/api/v1/files/cv/**").permitAll()

                // Admin endpoints
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")

                // Everything else requires authentication
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
