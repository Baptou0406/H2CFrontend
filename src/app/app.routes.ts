// Le fichier de routage existant dans votre projet
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LogementComponent } from './logement/logement.component';
import { ReservationComponent } from './reservation/reservation.component';
import { ConsommablesComponent } from './consommable/consommable.component';
import { FactureComponent } from './facture/facture.component';
import { LoginComponent } from './login/login.component';
import { InterventionComponent } from './intervention/intervention.component';
import { authService } from './services/auth.service';

export const routes: Routes = [
  // Routes protégées
  { path: 'logement', component: LogementComponent, canActivate: [authService] },
  { path: 'reservation', component: ReservationComponent, canActivate: [authService] },
  { path: 'consommable', component: ConsommablesComponent, canActivate: [authService] },
  { path: 'facture', component: FactureComponent, canActivate: [authService] },
  { path: 'intervention', component: InterventionComponent, canActivate: [authService] },
  
  // Route login (accessible sans authentification)
  { path: 'login', component: LoginComponent },
  
  // Routes par défaut
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}