import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private baseUrl = 'http://163.172.223.91/baptiste/my_project_directory/public/index.php';
  
  constructor(private http: HttpClient) {}
  
  getReservations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/reservation/api/findAll`);
  }
  
  addReservation(reservation: any) {
    return this.http.post(`${this.baseUrl}/reservation/api/add`, reservation);
  }
  
  updateReservation(id: number, reservation: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/reservation/api/update/${id}`, reservation);
  }
  
  deleteReservation(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/reservation/api/delete/${id}`);
  }
}