import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class JobService {

    private apiUrl = 'http://localhost:8080/api/v1/jobs';

    constructor(private http: HttpClient, private authService: AuthService) { }

    private getAuthHeaders(): HttpHeaders {
        return new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    }

    getAllJobs(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }

    getMyJobs(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/my-jobs`, { headers: this.getAuthHeaders() });
    }

    getJob(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    addJob(job: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, job, { headers: this.getAuthHeaders() });
    }

    updateJob(id: number, job: any): Observable<any> {
        return this.http.patch<any>(`${this.apiUrl}/${id}`, job, { headers: this.getAuthHeaders() });
    }

    deleteJob(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
    }
}
