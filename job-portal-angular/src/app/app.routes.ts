import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AddJobComponent } from './pages/add-job/add-job.component';
import { MyJobsComponent } from './pages/my-jobs/my-jobs.component';
import { AllJobsComponent } from './pages/all-jobs/all-jobs.component';
import { AdminComponent } from './pages/admin/admin.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'add-job', component: AddJobComponent },
    { path: 'my-jobs', component: MyJobsComponent },
    { path: 'all-jobs', component: AllJobsComponent },
    { path: 'admin', component: AdminComponent },
    { path: '**', redirectTo: '' }
];
