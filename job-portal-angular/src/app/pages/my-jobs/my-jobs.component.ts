import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { JobService } from '../../services/job.service';
import { ApplicationService } from '../../services/application.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-my-jobs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 pt-20 pb-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <!-- RECRUITER VIEW: My Posted Jobs + Applications -->
        <div *ngIf="userRole === 'recruiter'">
          <div class="text-center mb-10">
            <h1 class="text-4xl font-extrabold text-gray-900">
              Mes <span class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Offres Publiées</span>
            </h1>
            <p class="mt-3 text-lg text-gray-500">Gérez vos offres d'emploi et examinez les candidatures</p>
          </div>

          <!-- Loading -->
          <div *ngIf="loading" class="text-center py-20">
            <svg class="animate-spin h-10 w-10 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
          </div>

          <!-- My Jobs List -->
          <div *ngIf="!loading && myJobs.length === 0" class="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <p class="text-xl text-gray-400 mb-4">Vous n'avez pas encore publié d'emploi</p>
            <button (click)="router.navigate(['/add-job'])" class="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md">Publier Votre Premier Emploi</button>
          </div>

          <div class="space-y-6">
            <div *ngFor="let job of myJobs" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div class="p-6">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 class="text-xl font-bold text-gray-900">{{ job.position }}</h3>
                    <p class="text-sm text-gray-500 mt-1">{{ job.company }} · {{ job.location }} · {{ job.jobType?.replace('_', ' ') }}</p>
                  </div>
                  <div class="flex items-center gap-3 mt-3 md:mt-0">
                    <span class="px-3 py-1 text-xs font-medium rounded-full"
                      [ngClass]="{ 'bg-green-100 text-green-700': job.jobStatus === 'OPEN', 'bg-red-100 text-red-700': job.jobStatus === 'CLOSED' }">
                      {{ job.jobStatus }}
                    </span>
                    <button (click)="deleteJob(job.id)" class="text-red-400 hover:text-red-600 text-sm transition-colors">Supprimer</button>
                  </div>
                </div>
                <p class="text-sm text-gray-600 mb-2" *ngIf="job.salary">💰 {{ job.salary }}</p>
                <p class="text-sm text-gray-500 line-clamp-2">{{ job.description }}</p>
              </div>
            </div>
          </div>

          <!-- Applications on my jobs -->
          <div class="mt-12" *ngIf="recruiterApplications.length > 0">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">
              Candidatures Reçues <span class="text-base font-normal text-gray-400">({{ recruiterApplications.length }})</span>
            </h2>
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Candidat</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Poste</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CV</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date de candidature</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-100">
                    <tr *ngFor="let app of recruiterApplications" class="hover:bg-gray-50 transition-colors">
                      <td class="px-6 py-4">
                        <div class="text-sm font-medium text-gray-900">{{ app.applicant?.username }}</div>
                        <div class="text-xs text-gray-500">{{ app.applicant?.email }}</div>
                      </td>
                      <td class="px-6 py-4 text-sm text-gray-700">{{ app.job?.position }}</td>
                      <td class="px-6 py-4">
                        <a *ngIf="app.resumeUrl" [href]="'http://localhost:8080' + app.resumeUrl" target="_blank"
                          class="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-lg hover:bg-indigo-100 transition-colors">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                          Voir CV
                        </a>
                        <span *ngIf="!app.resumeUrl" class="text-xs text-gray-400 italic">Non fourni</span>
                      </td>
                      <td class="px-6 py-4">
                        <span class="px-2.5 py-1 text-xs font-medium rounded-full"
                          [ngClass]="{
                            'bg-yellow-100 text-yellow-700': app.status === 'PENDING',
                            'bg-blue-100 text-blue-700': app.status === 'REVIEWED',
                            'bg-green-100 text-green-700': app.status === 'ACCEPTED',
                            'bg-red-100 text-red-700': app.status === 'REJECTED'
                          }">{{ app.status }}</span>
                      </td>
                      <td class="px-6 py-4 text-sm text-gray-500">{{ app.appliedAt | date:'mediumDate' }}</td>
                      <td class="px-6 py-4">
                        <select (change)="updateStatus(app.id, $event)" [value]="app.status"
                          class="text-sm border border-gray-200 rounded-lg px-2 py-1 focus:ring-2 focus:ring-indigo-500 bg-white">
                          <option value="PENDING">En attente</option>
                          <option value="REVIEWED">Examinée</option>
                          <option value="ACCEPTED">Acceptée</option>
                          <option value="REJECTED">Rejetée</option>
                        </select>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- CANDIDATE VIEW: My Applications -->
        <div *ngIf="userRole === 'candidate'">
          <div class="text-center mb-10">
            <h1 class="text-4xl font-extrabold text-gray-900">
              Mes <span class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Candidatures</span>
            </h1>
            <p class="mt-3 text-lg text-gray-500">Suivez le statut de vos candidatures</p>
          </div>

          <div *ngIf="loading" class="text-center py-20">
            <svg class="animate-spin h-10 w-10 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
          </div>

          <div *ngIf="!loading && candidateApplications.length === 0" class="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <p class="text-xl text-gray-400 mb-4">Vous n'avez encore postulé à aucun emploi</p>
            <button (click)="router.navigate(['/all-jobs'])" class="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl transition-all shadow-md">Parcourir les Emplois</button>
          </div>

          <div class="space-y-4">
            <div *ngFor="let app of candidateApplications" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
              <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 class="text-lg font-bold text-gray-900">{{ app.job?.position }}</h3>
                  <p class="text-sm text-gray-500 mt-1">{{ app.job?.company }} · {{ app.job?.location }}</p>
                  <p class="text-xs text-gray-400 mt-1">Postulé le {{ app.appliedAt | date:'mediumDate' }}</p>
                </div>
                <div class="mt-3 md:mt-0">
                  <span class="px-4 py-2 text-sm font-medium rounded-full"
                    [ngClass]="{
                      'bg-yellow-100 text-yellow-700': app.status === 'PENDING',
                      'bg-blue-100 text-blue-700': app.status === 'REVIEWED',
                      'bg-green-100 text-green-700': app.status === 'ACCEPTED',
                      'bg-red-100 text-red-700': app.status === 'REJECTED'
                    }">{{ app.status }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Not logged in -->
        <div *ngIf="!userRole" class="text-center py-20">
          <p class="text-xl text-gray-400 mb-4">Veuillez vous connecter pour voir vos emplois/candidatures</p>
          <button (click)="router.navigate(['/login'])" class="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl transition-all shadow-md">Se Connecter</button>
        </div>

      </div>
    </div>
  `
})
export class MyJobsComponent implements OnInit {
  myJobs: any[] = [];
  recruiterApplications: any[] = [];
  candidateApplications: any[] = [];
  loading = true;

  get userRole(): string | null { return this.authService.getUserRole(); }

  constructor(
    private jobService: JobService,
    private applicationService: ApplicationService,
    private authService: AuthService,
    public router: Router
  ) { }

  ngOnInit() {
    const role = this.userRole;
    if (role === 'recruiter') {
      this.jobService.getMyJobs().subscribe({
        next: (jobs) => { this.myJobs = jobs; this.loading = false; },
        error: () => { this.loading = false; }
      });
      this.applicationService.getRecruiterJobs().subscribe({
        next: (apps) => { this.recruiterApplications = apps; }
      });
    } else if (role === 'candidate') {
      this.applicationService.getApplicantJobs().subscribe({
        next: (apps) => { this.candidateApplications = apps; this.loading = false; },
        error: () => { this.loading = false; }
      });
    } else {
      this.loading = false;
    }
  }

  deleteJob(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet emploi ?')) {
      this.jobService.deleteJob(id).subscribe({
        next: () => { this.myJobs = this.myJobs.filter(j => j.id !== id); }
      });
    }
  }

  updateStatus(appId: number, event: any) {
    const status = event.target.value;
    this.applicationService.updateApplicationStatus(appId, status).subscribe({
      next: (updated) => {
        const app = this.recruiterApplications.find(a => a.id === appId);
        if (app) app.status = updated.status;
      }
    });
  }
}
