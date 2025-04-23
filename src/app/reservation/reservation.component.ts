import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservationService } from '../services/reservation.service';
import { LogementService } from '../services/logement.service';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {
  reservations: any[] = [];
  logements: any[] = [];
  showModal = false;
  editMode = false;

  selectedReservation: any = null;

  constructor(
    private reservationService: ReservationService,
    private logementService: LogementService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.reservationService.getReservations().subscribe(
      data => {
        this.reservations = data;
        console.log('📦 Réservations chargées :', this.reservations); // ✅ ici !
      },
      error => console.error('Erreur chargement réservations:', error)
    );
    


    this.logementService.getLogements().subscribe(
      data => this.logements = data,
      error => console.error('Erreur logements:', error)
    );
  }
  

  openModal() {
    this.editMode = false;
    this.selectedReservation = {
      Nom_voyageur: '',
      date_debut: '',
      date_fin: '',
      prix: null,
      logement: null,
      plateforme: '' // ✅ nouveau champ
    };
    
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editMode = false;
    this.selectedReservation = null;
  }

  addReservation() {
    this.reservationService.addReservation(this.selectedReservation).subscribe(
      () => {
        this.closeModal();
        this.loadData();
      },
      error => console.error('Erreur ajout réservation:', error)
    );
  }

  editReservation(reservation: any) {
    this.editMode = true;
  
    this.selectedReservation = {
      id: reservation.id,
      Nom_voyageur: reservation.Nom_voyageur,
      date: this.formatDateForInput(reservation.date),
      date_fin: this.formatDateForInput(reservation.date_fin),
      prix: reservation.prix,
      logement: this.logements.find(l => l.Nom === reservation.logement)?.id ?? reservation.logement,
      plateforme: reservation.plateforme,

    };
  
    this.showModal = true;
  }
  
  
  

  updateReservation() {
    console.log('Données envoyées à l\'API :', this.selectedReservation);

    this.reservationService.updateReservation(this.selectedReservation.id, this.selectedReservation).subscribe(
      () => {
        console.log("Réservation mise à jour !");
        this.closeModal();
        this.loadData();
      },
      error => console.error("Erreur update:", error)
    );
  }

  deleteReservation() {
    if (!this.selectedReservation?.id) return;

    this.reservationService.deleteReservation(this.selectedReservation.id).subscribe(
      () => {
        console.log('Réservation supprimée');
        this.loadData();
        this.closeModal();
      },
      error => console.error('Erreur suppression:', error)
    );
  }

  getNomLogement(logementId: number): string {
    const logement = this.logements.find(l => l.id === logementId);
    return logement ? logement.Nom : 'Inconnu';
  }


  formatDateForInput(date: string): string {
    if (!date) return '';
  
    // ✅ si format jj/mm/aaaa ou jj-mm-aaaa
    const parts = date.includes('/') ? date.split('/') : date.split('-');
    if (parts.length === 3) {
      const [jj, mm, aaaa] = parts;
      const formatted = `${aaaa}-${mm.padStart(2, '0')}-${jj.padStart(2, '0')}`;
      const d = new Date(formatted);
      if (!isNaN(d.getTime())) {
        return d.toISOString().split('T')[0];
      }
    }
  
    // fallback
    const d = new Date(date);
    if (!isNaN(d.getTime())) {
      return d.toISOString().split('T')[0];
    }
  
    console.warn('Date invalide :', date);
    return '';
  }
  
  
  
  
}
