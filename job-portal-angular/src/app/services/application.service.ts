import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class ApplicationService {

    private apiUrl = 'http://localhost:8080/api/v1/applications';
    private filesUrl = 'http://localhost:8080/api/v1/files';

    constructor(private http: HttpClient, private authService: AuthService) { }

    private getAuthHeaders(): HttpHeaders {
        return new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    }

    uploadCv(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<any>(`${this.filesUrl}/upload-cv`, formData, {
            headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`)
        });
    }

    applyForJob(payload: { jobId: number, coverLetter?: string, resumeUrl?: string }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/apply`, payload, { headers: this.getAuthHeaders() });
    }

    getApplicantJobs(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/applicant-jobs`, { headers: this.getAuthHeaders() });
    }

    getRecruiterJobs(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/recruiter-jobs`, { headers: this.getAuthHeaders() });
    }

    updateApplicationStatus(id: number, status: string): Observable<any> {
        return this.http.patch<any>(`${this.apiUrl}/${id}`, { status }, { headers: this.getAuthHeaders() });
    }
}
