// src/app/services/auth.service.ts
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login.service';

export const authService = () => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  if (loginService.isAuthenticated()) {
    return true;
  }

  // Rediriger vers la page de connexion
  return router.parseUrl('/login');
};