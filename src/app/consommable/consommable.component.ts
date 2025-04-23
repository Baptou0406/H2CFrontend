import { Component, OnInit } from '@angular/core';
import { ConsommableService } from '../services/consommable.service';
import { LogementService } from '../services/logement.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-consommables',
  standalone: true,
  templateUrl: './consommable.component.html',
  styleUrls: ['./consommable.component.css'],
  imports: [CommonModule, FormsModule]
})
export class ConsommablesComponent implements OnInit {
  consommables: any[] = [];
  logements: any[] = [];
  showModal = false;
  editMode = false;
  l = "";
  selectedConsommable: any = null;

  constructor(
    private consommableService: ConsommableService,
    private logementService: LogementService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.consommableService.getConsommables().subscribe(
      (data) => this.consommables = data,
      (error) => console.error('Erreur API:', error)
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
    this.selectedConsommable = { 
      "Nom magasin": '', 
      prix: 0, 
      logement: null,
      date: new Date().toISOString().split('T')[0] // Date du jour au format YYYY-MM-DD
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editMode = false;
    this.selectedConsommable = null;
  }

  addConsommable() {
    console.log('Ajout consommable:', this.selectedConsommable);
    this.consommableService.addConsommable(this.selectedConsommable).subscribe(
      () => {
        this.closeModal();
        this.loadData();
      },
      (error) => console.error("Erreur d'ajout:", error)
    );
  }

  editConsommable(consommable: any) {
    // Traitement spécial pour la date
    let formattedDate = consommable.date;
    if (consommable.date) {
      try {
        // Convertir en format YYYY-MM-DD pour l'input date
        const parts = consommable.date.split('-');
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

    this.editMode = true;
    this.selectedConsommable = {
      id: consommable.id,
      ['Nom magasin']: consommable['Nom magasin'],
      prix: consommable.prix,
      logement: this.logements.find(l => l.Nom === consommable.logement)?.id ?? consommable.logement,
      date: formattedDate
    };
    
    console.log('Consommable à éditer:', this.selectedConsommable);
    this.showModal = true;
  }

  updateConsommable() {
    console.log('Mise à jour consommable:', this.selectedConsommable);
    this.consommableService.updateConsommable(this.selectedConsommable.id, this.selectedConsommable).subscribe(
      (response) => {
        console.log('Consommable mis à jour:', response);
        this.closeModal();
        this.loadData(); // Utiliser loadData() au lieu de ngOnInit() pour recharger les données
      },
      (error) => console.error('Erreur lors de la mise à jour:', error)
    );
  }

  deleteConsommable() {
    if (!this.selectedConsommable?.id) return;
    this.consommableService.deleteConsommable(this.selectedConsommable.id).subscribe(
      () => {
        console.log('Consommable supprimé');
        this.loadData(); // Utiliser loadData() au lieu de ngOnInit()
        this.closeModal();
      },
      (error) => console.error('Erreur lors de la suppression :', error)
    );
  }
}