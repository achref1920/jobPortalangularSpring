import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class AdminService {

    private apiUrl = 'http://localhost:8080/api/v1/admin';

    constructor(private http: HttpClient, private authService: AuthService) { }

    private getAuthHeaders(): HttpHeaders {
        return new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    }

    getStats(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/stats`, { headers: this.getAuthHeaders() });
    }

    getCandidates(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/candidates`, { headers: this.getAuthHeaders() });
    }

    getRecruiters(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/recruiters`, { headers: this.getAuthHeaders() });
    }

    getJobs(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/jobs`, { headers: this.getAuthHeaders() });
    }

    getApplications(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/applications`, { headers: this.getAuthHeaders() });
    }

    deleteUser(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/users/${id}`, { headers: this.getAuthHeaders() });
    }

    deleteJob(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/jobs/${id}`, { headers: this.getAuthHeaders() });
    }
}
