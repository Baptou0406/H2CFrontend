// src/app/interceptors/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoginService } from '../services/login.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const loginService = inject(LoginService);
  const router = inject(Router);
  const token = loginService.getToken();
  
  console.log('Intercepteur: URL', req.url);
  console.log('Intercepteur: Token disponible?', !!token);
  
  // Ne pas ajouter le token pour les requêtes de login
  if (token) {
    req = req.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
  
  return next(req).pipe(
    catchError(error => {
      console.error('Erreur HTTP:', error);
      // Si erreur 401 (non autorisé), rediriger vers la page de login
      if (error.status === 401) {
        console.log('Erreur 401 détectée, redirection vers login');
        loginService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};