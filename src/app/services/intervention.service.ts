import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterventionService {
  private baseUrl = 'http://163.172.223.91/baptiste/my_project_directory/public/index.php';
  
  constructor(private http: HttpClient) {}
  
  getInterventions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/intervention/api/findAll`);
  }
  
  addIntervention(intervention: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/intervention/api/add`, intervention);
  }
  
  updateIntervention(id: number, intervention: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/intervention/api/update/${id}`, intervention);
  }
  
  deleteIntervention(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/intervention/api/delete/${id}`);
  }
}