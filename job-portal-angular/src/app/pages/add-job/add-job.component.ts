import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { JobService } from '../../services/job.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-add-job',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-job.component.html'
})
export class AddJobComponent {
  job: any = {
    position: '', company: '', jobType: 'FULL_TIME', location: '',
    salary: '', deadline: '', description: '', requirements: '',
    skills: '', contact: ''
  };
  loading = false;
  successMessage = '';
  errorMessage = '';

  get userRole(): string | null { return this.authService.getUserRole(); }

  constructor(
    private jobService: JobService,
    private authService: AuthService,
    public router: Router
  ) { }

  onSubmit() {
    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.jobService.addJob(this.job).subscribe({
      next: () => {
        this.successMessage = 'Emploi publié avec succès !';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/my-jobs']), 1500);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Échec de la publication de l\'emploi';
        this.loading = false;
      }
    });
  }
}
