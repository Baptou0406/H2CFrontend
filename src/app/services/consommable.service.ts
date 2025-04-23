import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConsommableService {
  private baseUrl = 'http://163.172.223.91/baptiste/my_project_directory/public/index.php';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // ou sessionStorage
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getConsommables(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/consommable/api/findAll`, {
      headers: this.getAuthHeaders()
    });
  }

  addConsommable(consommable: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/consommable/api/add`, consommable, {
      headers: this.getAuthHeaders()
    });
  }

  updateConsommable(id: number, consommable: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/consommable/api/update/${id}`, consommable, {
      headers: this.getAuthHeaders()
    });
  }

  deleteConsommable(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/consommable/api/delete/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
