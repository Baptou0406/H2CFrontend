import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // Permet d'utiliser ce service partout sans `provideHttpClient()`
})
export class ApiService {
  private apiUrl = 'http://185.213.22.234/baptiste/my_project_directory/public/index.php/consommable/api/findAll'; // URL de base de ton API Symfony

  constructor(private http: HttpClient) {}

  // Récupérer la liste des utilisateurs depuis Symfony
  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`);
  }

  // Ajouter un utilisateur
  addUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, userData);
  }
}
