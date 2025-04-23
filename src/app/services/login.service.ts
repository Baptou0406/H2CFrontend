// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:8000'; // Adaptez à votre URL
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {}

  // Dans votre service login.service.ts
login(credentials: { username: string, password: string }): Observable<any> {
    return this.http.post<any>(`http://163.172.223.91/baptiste/my_project_directory/public/index.php/api/login`, credentials)
      .pipe(
        tap(response => {
          if (response && response.token) {
            console.log('Token reçu:', response.token);
            localStorage.setItem('token', response.token);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return token !== null && !this.jwtHelper.isTokenExpired(token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserInfo(): Observable<any> {
    return this.http.get<any>(`http://163.172.223.91/baptiste/my_project_directory/public/index.php/api/login`);
  }
}