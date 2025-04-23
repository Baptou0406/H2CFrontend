import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InterventionService } from '../services/intervention.service';
import { LogementService } from '../services/logement.service';

@Component({
  selector: 'app-intervention',
  standalone: true,
  templateUrl: './intervention.component.html',
  styleUrls: ['./intervention.component.css'],
  imports: [CommonModule, FormsModule]
})
export class InterventionComponent implements OnInit {
  interventions: any[] = [];
  logements: any[] = [];
  showModal = false;
  editMode = false;
  selectedIntervention: any = {
    Description: '',
    prix: null,
    logement: null,
    date: new Date().toISOString().split('T')[0]
  };

  constructor(
    private interventionService: InterventionService,
    private logementService: LogementService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.interventionService.getInterventions().subscribe(
      (data) => this.interventions = data,
      (error) => console.error('Erreur interventions:', error)
    );
    this.logementService.getLogements().subscribe(
      (data) => this.logements = data,
      (error) => console.error('Erreur logements:', error)
    );
  }

  // Méthode pour formater la date
  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    
    try {
      // Essayer de parser la date
      const parts = dateString.split('-');
      // Si format dd-mm-yyyy
      if (parts.length === 3 && parts[0].length === 2) {
        return `${parts[0]}/${parts[1]}/${parts[2]}`;
      }
      // Si format yyyy-mm-dd
      if (parts.length === 3 && parts[0].length === 4) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      return dateString; // Retourner la date telle quelle si format inconnu
    } catch (e) {
      console.error('Erreur de formatage de date:', e);
      return dateString;
    }
  }

  openModal() {
    this.editMode = false;
    this.selectedIntervention = {
      Description: '',
      prix: null,
      logement: null,
      date: new Date().toISOString().split('T')[0]
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editMode = false;
    this.selectedIntervention = null;
  }

  addIntervention() {
    console.log('Ajout intervention:', this.selectedIntervention);
    this.interventionService.addIntervention(this.selectedIntervention).subscribe(
      () => {
        this.closeModal();
        this.loadData();
      },
      (error) => console.error('Erreur ajout:', error)
    );
  }

  editIntervention(intervention: any) {
    this.editMode = true;
    
    // Traitement spécial pour la date
    let formattedDate = intervention.date;
    if (intervention.date) {
      try {
        // Convertir en format YYYY-MM-DD pour l'input date
        const parts = intervention.date.split('-');
        if (parts.length === 3) {
          // Si format jj-mm-aaaa, convertir en aaaa-mm-jj
          if (parts[0].length === 2 && parts[2].length === 4) {
            formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
          }
        }
      } catch (e) {
        console.error('Erreur de formatage:', e);
        formattedDate = new Date().toISOString().split('T')[0];
      }
    } else {
      formattedDate = new Date().toISOString().split('T')[0];
    }
    
    this.selectedIntervention = {
      id: intervention.id,
      Description: intervention.Description,
      prix: intervention.prix,
      logement: this.logements.find(l => l.Nom === intervention.logement)?.id ?? intervention.logement,
      date: formattedDate
    };
    
    console.log('Intervention à éditer:', this.selectedIntervention);
    this.showModal = true;
  }

  updateIntervention() {
    console.log('Mise à jour intervention:', this.selectedIntervention);
    this.interventionService.updateIntervention(this.selectedIntervention.id, this.selectedIntervention).subscribe(
      () => {
        console.log('Intervention mise à jour');
        this.closeModal();
        this.loadData();
      },
      (error) => console.error('Erreur mise à jour:', error)
    );
  }

  deleteIntervention() {
    if (!this.selectedIntervention?.id) return;
    this.interventionService.deleteIntervention(this.selectedIntervention.id).subscribe(
      () => {
        console.log('Intervention supprimée');
        this.closeModal();
        this.loadData();
      },
      (error) => console.error('Erreur suppression:', error)
    );
  }

  getNomLogement(logementId: number): string {
    const logement = this.logements.find(l => l.id === logementId);
    return logement ? logement.Nom : 'Inconnu';
  }
}