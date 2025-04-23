import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { LoginService } from '../services/login.service'; // Ajustez le chemin selon votre structure

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule,
    FormsModule,
    HttpClientModule,
    CommonModule
  ]
})
export class LoginComponent {
  credentials = {
    username: '',
    password: ''
  };
  
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private loginService: LoginService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.loginService.login(this.credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/facture']); // Redirection vers la page facture
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Échec de connexion. Vérifiez vos identifiants.';
        console.error('Erreur de connexion:', error);
      }
    });
  }

  // src/app/services/login.service.ts

// Si cette méthode n'existe pas déjà, ajoutez-la
isLoggedIn(): boolean {
  return !!localStorage.getItem('token');
}
}