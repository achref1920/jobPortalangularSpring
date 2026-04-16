import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { JobService } from '../../services/job.service';
import { ApplicationService } from '../../services/application.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-all-jobs',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './all-jobs.component.html'
})
export class AllJobsComponent implements OnInit {
  allJobs: any[] = [];
  filteredJobs: any[] = [];
  loading = true;
  searchTerm = '';
  filterType = '';
  filterLocation = '';
  locations: string[] = [];
  appliedJobIds = new Set<number>();

  // Apply modal state
  showApplyModal = false;
  selectedJob: any = null;
  selectedFile: File | null = null;
  coverLetter = '';
  applyError = '';
  applying = false;

  get isLoggedIn(): boolean { return this.authService.isLoggedIn(); }
  get userRole(): string | null { return this.authService.getUserRole(); }

  constructor(
    private jobService: JobService,
    private applicationService: ApplicationService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.jobService.getAllJobs().subscribe({
      next: (jobs) => {
        this.allJobs = jobs;
        this.filteredJobs = jobs;
        this.locations = [...new Set(jobs.map((j: any) => j.location).filter(Boolean))];
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });

    // Load applied jobs for candidates
    if (this.userRole === 'candidate') {
      this.applicationService.getApplicantJobs().subscribe({
        next: (apps) => {
          apps.forEach((app: any) => this.appliedJobIds.add(app.job?.id));
        }
      });
    }
  }

  filterJobs() {
    this.filteredJobs = this.allJobs.filter(job => {
      const matchSearch = !this.searchTerm ||
        job.position?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        job.company?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        job.description?.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchType = !this.filterType || job.jobType === this.filterType;
      const matchLocation = !this.filterLocation || job.location === this.filterLocation;
      return matchSearch && matchType && matchLocation;
    });
  }

  openApplyModal(job: any) {
    this.selectedJob = job;
    this.selectedFile = null;
    this.coverLetter = '';
    this.applyError = '';
    this.applying = false;
    this.showApplyModal = true;
  }

  closeApplyModal() {
    this.showApplyModal = false;
    this.selectedJob = null;
    this.selectedFile = null;
  }

  removeFile() {
    this.selectedFile = null;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      this.applyError = 'Seuls les fichiers PDF sont acceptés';
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      this.applyError = 'Le fichier ne doit pas dépasser 10 Mo';
      return;
    }

    this.applyError = '';
    this.selectedFile = file;
  }

  submitApplication() {
    if (!this.selectedFile || !this.selectedJob) return;

    this.applying = true;
    this.applyError = '';

    // Step 1: Upload the CV
    this.applicationService.uploadCv(this.selectedFile).subscribe({
      next: (uploadRes) => {
        // Step 2: Submit the application with the CV URL
        const payload: any = {
          jobId: this.selectedJob.id,
          resumeUrl: uploadRes.fileUrl
        };
        if (this.coverLetter.trim()) {
          payload.coverLetter = this.coverLetter;
        }

        this.applicationService.applyForJob(payload).subscribe({
          next: () => {
            this.appliedJobIds.add(this.selectedJob.id);
            this.closeApplyModal();
          },
          error: (err) => {
            this.applyError = err.error?.message || 'Échec de la candidature';
            this.applying = false;
          }
        });
      },
      error: (err) => {
        this.applyError = err.error?.message || 'Échec du téléchargement du CV';
        this.applying = false;
      }
    });
  }
}
