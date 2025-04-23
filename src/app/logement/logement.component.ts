import { Component, OnInit } from '@angular/core';
import { LogementService } from '../services/logement.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-logement',
  standalone: true,
  templateUrl: './logement.component.html',
  styleUrls: ['./logement.component.css'],
  imports: [CommonModule, FormsModule]
})
export class LogementComponent implements OnInit {
  logements: any[] = [];
  showModal = false;
  editMode = false;
  selectedLogement: any = null;

  constructor(private logementService: LogementService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.logementService.getLogements().subscribe(
      data => this.logements = data,
      error => console.error('Erreur API:', error)
    );
  }

  openModal() {
    this.editMode = false;
    this.selectedLogement = { nom: '', commission: null, menage: null };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editMode = false;
    this.selectedLogement = null;
  }

  addLogement() {
    // Transformer les données pour correspondre à ce que l'API attend
    const logementData = {
      Nom: this.selectedLogement.nom,
      Commission: this.selectedLogement.commission,
      Menage: this.selectedLogement.menage
    };
    
    this.logementService.addLogement(logementData).subscribe(
      () => {
        this.closeModal();
        this.loadData();
      },
      error => console.error("Erreur d'ajout:", error)
    );
  }

  editLogement(logement: any) {
    this.editMode = true;
    
    this.selectedLogement = {
      id: logement.id,
      nom: logement.Nom,         
      commission: logement.Commission,  
      menage: logement.Menage   
    };
    
    this.showModal = true;
  }

  updateLogement() {
 
    const logementData = {
      Nom: this.selectedLogement.nom,
      Commission: this.selectedLogement.commission,
      Menage: this.selectedLogement.menage
    };
    
    this.logementService.updateLogement(this.selectedLogement.id, logementData).subscribe(
      () => {
        console.log("Logement mis à jour !");
        this.closeModal();
        this.loadData();
      },
      error => console.error('Erreur lors de la mise à jour :', error)
    );
  }

  deleteLogement() {
    if (!this.selectedLogement?.id) return;

    this.logementService.deleteLogement(this.selectedLogement.id).subscribe(
      () => {
        console.log("Logement supprimé");
        this.closeModal();
        this.loadData();
      },
      error => console.error('Erreur suppression :', error)
    );
  }
}
