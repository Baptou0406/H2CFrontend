import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogementService {
  private baseUrl = 'http://163.172.223.91/baptiste/my_project_directory/public/index.php';
  
  constructor(private http: HttpClient) {}
  
  getLogements(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/logement/api/findAll`);
  }
  
  addLogement(logement: any) {
    return this.http.post(`${this.baseUrl}/logement/api/add`, logement);
  }
  
  updateLogement(id: number, logement: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/logement/api/update/${id}`, logement);
  }
  
  deleteLogement(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/logement/api/delete/${id}`);
  }
}