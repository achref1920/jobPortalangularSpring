package com.app.jobportal.repository;

import com.app.jobportal.entity.Application;
import com.app.jobportal.entity.Job;
import com.app.jobportal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByApplicant(User applicant);

    List<Application> findByJob(Job job);

    @Query("SELECT a FROM Application a WHERE a.job.createdBy.id = :recruiterId")
    List<Application> findByRecruiterId(@Param("recruiterId") Long recruiterId);

    boolean existsByApplicantAndJob(User applicant, Job job);
}
