import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-admin',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="min-h-screen bg-gray-50 pt-20 pb-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <!-- Not admin -->
        <div *ngIf="userRole !== 'admin'" class="text-center py-20">
          <p class="text-xl text-gray-400 mb-4">Accès réservé aux administrateurs</p>
          <button (click)="router.navigate(['/'])" class="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl transition-all shadow-md">Retour à l'accueil</button>
        </div>

        <div *ngIf="userRole === 'admin'">
          <!-- Header -->
          <div class="text-center mb-10">
            <h1 class="text-4xl font-extrabold text-gray-900">
              Tableau de Bord <span class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Administrateur</span>
            </h1>
            <p class="mt-3 text-lg text-gray-500">Gérez les utilisateurs, les emplois et les candidatures</p>
          </div>

          <!-- Stats Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                </div>
                <div>
                  <p class="text-2xl font-bold text-gray-900">{{ stats.totalCandidates || 0 }}</p>
                  <p class="text-sm text-gray-500">Candidats</p>
                </div>
              </div>
            </div>
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                </div>
                <div>
                  <p class="text-2xl font-bold text-gray-900">{{ stats.totalRecruiters || 0 }}</p>
                  <p class="text-sm text-gray-500">Recruteurs</p>
                </div>
              </div>
            </div>
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </div>
                <div>
                  <p class="text-2xl font-bold text-gray-900">{{ stats.totalJobs || 0 }}</p>
                  <p class="text-sm text-gray-500">Emplois</p>
                </div>
              </div>
            </div>
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                </div>
                <div>
                  <p class="text-2xl font-bold text-gray-900">{{ stats.totalApplications || 0 }}</p>
                  <p class="text-sm text-gray-500">Candidatures</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Tab Navigation -->
          <div class="flex gap-2 mb-8 bg-white rounded-xl p-1.5 shadow-sm border border-gray-100 max-w-fit">
            <button (click)="activeTab = 'candidates'" class="px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
              [ngClass]="activeTab === 'candidates' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'">
              Candidats
            </button>
            <button (click)="activeTab = 'recruiters'" class="px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
              [ngClass]="activeTab === 'recruiters' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'">
              Recruteurs
            </button>
            <button (click)="activeTab = 'jobs'" class="px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
              [ngClass]="activeTab === 'jobs' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'">
              Emplois
            </button>
            <button (click)="activeTab = 'applications'" class="px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
              [ngClass]="activeTab === 'applications' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'">
              Candidatures
            </button>
          </div>

          <!-- Candidates Table -->
          <div *ngIf="activeTab === 'candidates'" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100">
              <h2 class="text-lg font-bold text-gray-900">Liste des Candidats ({{ candidates.length }})</h2>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom d'utilisateur</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Compétences</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expérience</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-100">
                  <tr *ngFor="let user of candidates" class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 text-sm text-gray-500">{{ user.id }}</td>
                    <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ user.username }}</td>
                    <td class="px-6 py-4 text-sm text-gray-600">{{ user.email }}</td>
                    <td class="px-6 py-4 text-sm text-gray-600">{{ user.skills || '—' }}</td>
                    <td class="px-6 py-4 text-sm text-gray-600">{{ user.experience || '—' }}</td>
                    <td class="px-6 py-4">
                      <button (click)="deleteUser(user.id, 'candidate')" class="text-red-500 hover:text-red-700 text-sm font-medium transition-colors">Supprimer</button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div *ngIf="candidates.length === 0" class="text-center py-10 text-gray-400">Aucun candidat inscrit</div>
            </div>
          </div>

          <!-- Recruiters Table -->
          <div *ngIf="activeTab === 'recruiters'" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100">
              <h2 class="text-lg font-bold text-gray-900">Liste des Recruteurs ({{ recruiters.length }})</h2>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom d'utilisateur</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entreprise</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Site Web</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-100">
                  <tr *ngFor="let user of recruiters" class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 text-sm text-gray-500">{{ user.id }}</td>
                    <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ user.username }}</td>
                    <td class="px-6 py-4 text-sm text-gray-600">{{ user.email }}</td>
                    <td class="px-6 py-4 text-sm text-gray-600">{{ user.companyName || '—' }}</td>
                    <td class="px-6 py-4 text-sm text-gray-600">
                      <a *ngIf="user.companyWebsite" [href]="user.companyWebsite" target="_blank" class="text-indigo-600 hover:underline">{{ user.companyWebsite }}</a>
                      <span *ngIf="!user.companyWebsite">—</span>
                    </td>
                    <td class="px-6 py-4">
                      <button (click)="deleteUser(user.id, 'recruiter')" class="text-red-500 hover:text-red-700 text-sm font-medium transition-colors">Supprimer</button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div *ngIf="recruiters.length === 0" class="text-center py-10 text-gray-400">Aucun recruteur inscrit</div>
            </div>
          </div>

          <!-- Jobs Table -->
          <div *ngIf="activeTab === 'jobs'" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100">
              <h2 class="text-lg font-bold text-gray-900">Tous les Emplois ({{ jobs.length }})</h2>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Poste</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entreprise</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Localisation</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-100">
                  <tr *ngFor="let job of jobs" class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 text-sm text-gray-500">{{ job.id }}</td>
                    <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ job.position }}</td>
                    <td class="px-6 py-4 text-sm text-gray-600">{{ job.company }}</td>
                    <td class="px-6 py-4">
                      <span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">{{ job.jobType?.replace('_', ' ') }}</span>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-600">{{ job.location || '—' }}</td>
                    <td class="px-6 py-4">
                      <span class="px-2 py-1 text-xs font-medium rounded-full"
                        [ngClass]="job.jobStatus === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">{{ job.jobStatus }}</span>
                    </td>
                    <td class="px-6 py-4">
                      <button (click)="deleteJob(job.id)" class="text-red-500 hover:text-red-700 text-sm font-medium transition-colors">Supprimer</button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div *ngIf="jobs.length === 0" class="text-center py-10 text-gray-400">Aucun emploi publié</div>
            </div>
          </div>

          <!-- Applications Table -->
          <div *ngIf="activeTab === 'applications'" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100">
              <h2 class="text-lg font-bold text-gray-900">Toutes les Candidatures ({{ applications.length }})</h2>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Candidat</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Poste</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entreprise</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CV</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-100">
                  <tr *ngFor="let app of applications" class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 text-sm text-gray-500">{{ app.id }}</td>
                    <td class="px-6 py-4">
                      <div class="text-sm font-medium text-gray-900">{{ app.applicant?.username }}</div>
                      <div class="text-xs text-gray-500">{{ app.applicant?.email }}</div>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-600">{{ app.job?.position }}</td>
                    <td class="px-6 py-4 text-sm text-gray-600">{{ app.job?.company }}</td>
                    <td class="px-6 py-4">
                      <a *ngIf="app.resumeUrl" [href]="'http://localhost:8080' + app.resumeUrl" target="_blank"
                        class="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-lg hover:bg-indigo-100 transition-colors">
                        Voir CV
                      </a>
                      <span *ngIf="!app.resumeUrl" class="text-xs text-gray-400 italic">—</span>
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
                  </tr>
                </tbody>
              </table>
              <div *ngIf="applications.length === 0" class="text-center py-10 text-gray-400">Aucune candidature</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `
})
export class AdminComponent implements OnInit {
    stats: any = {};
    candidates: any[] = [];
    recruiters: any[] = [];
    jobs: any[] = [];
    applications: any[] = [];
    activeTab = 'candidates';

    get userRole(): string | null { return this.authService.getUserRole(); }

    constructor(
        private adminService: AdminService,
        private authService: AuthService,
        public router: Router
    ) { }

    ngOnInit() {
        if (this.userRole !== 'admin') return;
        this.loadAll();
    }

    loadAll() {
        this.adminService.getStats().subscribe({ next: (s) => this.stats = s });
        this.adminService.getCandidates().subscribe({ next: (c) => this.candidates = c });
        this.adminService.getRecruiters().subscribe({ next: (r) => this.recruiters = r });
        this.adminService.getJobs().subscribe({ next: (j) => this.jobs = j });
        this.adminService.getApplications().subscribe({ next: (a) => this.applications = a });
    }

    deleteUser(id: number, type: string) {
        const label = type === 'candidate' ? 'ce candidat' : 'ce recruteur';
        if (confirm('Êtes-vous sûr de vouloir supprimer ' + label + ' ?')) {
            this.adminService.deleteUser(id).subscribe({
                next: () => {
                    if (type === 'candidate') {
                        this.candidates = this.candidates.filter(u => u.id !== id);
                    } else {
                        this.recruiters = this.recruiters.filter(u => u.id !== id);
                    }
                    this.adminService.getStats().subscribe({ next: (s) => this.stats = s });
                }
            });
        }
    }

    deleteJob(id: number) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet emploi ?')) {
            this.adminService.deleteJob(id).subscribe({
                next: () => {
                    this.jobs = this.jobs.filter(j => j.id !== id);
                    this.adminService.getStats().subscribe({ next: (s) => this.stats = s });
                }
            });
        }
    }
}
