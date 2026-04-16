package com.app.jobportal.repository;

import com.app.jobportal.entity.Job;
import com.app.jobportal.entity.Recruiter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByCreatedBy(Recruiter recruiter);
}
