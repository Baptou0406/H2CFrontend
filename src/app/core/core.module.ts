import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [HttpClientModule], // Ajoute HttpClient ici
  exports: [HttpClientModule] // Permet aux autres modules d'utiliser HttpClient
})
export class CoreModule {}
