import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConsommableService } from '../services/consommable.service';
import { ReservationService } from '../services/reservation.service';
import { InterventionService } from '../services/intervention.service';
import { LogementService } from '../services/logement.service';

@Component({
  selector: 'app-facture',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './facture.component.html',
  styleUrls: ['./facture.component.css']
})
export class FactureComponent implements OnInit {
  logements: any[] = [];
  consommables: any[] = [];
  reservations: any[] = [];
  interventions: any[] = [];

  selectedLogementId: number | null = null;
  selectedMonth: number = 0;
  selectedYear: number = new Date().getFullYear();
  availableYears: number[] = [];

  constructor(
    private consommableService: ConsommableService,
    private reservationService: ReservationService,
    private interventionService: InterventionService,
    private logementService: LogementService
  ) {}

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    this.availableYears = Array.from({ length: 6 }, (_, i) => currentYear - 3 + i);

    this.logementService.getLogements().subscribe((data: any[]) => this.logements = data);
    this.consommableService.getConsommables().subscribe((data: any[]) => this.consommables = data);
    this.reservationService.getReservations().subscribe((data: any[]) => this.reservations = data);
    this.interventionService.getInterventions().subscribe((data: any[]) => this.interventions = data);
  }

  getFiltered(list: any[]): any[] {
    const logement = this.logements.find(l => l.id === this.selectedLogementId);
    if (!logement) return [];

    return list.filter(item => {
      const matchesLogement = item.logement === logement.Nom;
      const dateStr = item.date_debut || item.date || item.date_intervention;

      if (!dateStr) return matchesLogement;

      const date = this.parseDate(dateStr);
      const matchesMonth = this.selectedMonth === 0 || date.getMonth() + 1 === this.selectedMonth;
      const matchesYear = date.getFullYear() === this.selectedYear;

      return matchesLogement && matchesMonth && matchesYear;
    });
  }

  parseDate(dateStr: string): Date {
    const parts = dateStr.split('-');
    if (parts[0].length === 4) {
      return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    } else {
      return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
    }
  }

  calculateNights(reservation: any): number {
    const debut = this.parseDate(reservation.date_debut);
    const fin = this.parseDate(reservation.date_fin);
    return Math.max(0, Math.floor((fin.getTime() - debut.getTime()) / (1000 * 60 * 60 * 24)));
  }

  calculateH2cPrice(reservation: any): number {
    const logement = this.logements.find(l => l.Nom === reservation.logement);
    return logement && logement.Commission
      ? Math.round((logement.Commission / 100 * reservation.prix) * 100) / 100
      : 0;
  }

  calculateHorsTaxe(reservation: any): number {
    const h2c = this.calculateH2cPrice(reservation);
    return Math.round((h2c / 1.2) * 100) / 100;
  }

  calculateMenage(reservation: any): number {
    const logement = this.logements.find(l => l.Nom === reservation.logement);
    return logement?.Menage || 0;
  }

  calculateMenageHorsTaxe(reservation: any): number {
    const menage = this.calculateMenage(reservation);
    return Math.round((menage / 1.2) * 100) / 100;
  }

  calculateConsommableHorsTaxe(consommable: any): number {
    return Math.round((consommable.prix / 1.2) * 100) / 100;
  }

  calculateInterventionHorsTaxe(intervention: any): number {
    return Math.round((intervention.prix / 1.2) * 100) / 100;
  }

  getPlatformTotals() {
    const filteredReservations = this.getFiltered(this.reservations);
    const totals: Record<string, { nuits: number, prix: number, h2c: number, h2cHT: number }> = {};

    for (const r of filteredReservations) {
      const plateforme = r.Plateforme;
      const logement = this.logements.find(l => l.Nom === r.logement);
      const h2c = logement?.Commission ? logement.Commission / 100 * r.prix : 0;
      const h2cHT = h2c / 1.2;
      const nuits = this.calculateNights(r);

      if (!totals[plateforme]) {
        totals[plateforme] = { nuits: 0, prix: 0, h2c: 0, h2cHT: 0 };
      }

      totals[plateforme].nuits += nuits;
      totals[plateforme].prix += r.prix;
      totals[plateforme].h2c += h2c;
      totals[plateforme].h2cHT += h2cHT;
    }

    return totals;
  }

  getPlatformNames(): string[] {
    return Object.keys(this.getPlatformTotals());
  }

  getTotalGlobal(totals: Record<string, { nuits: number, prix: number, h2c: number, h2cHT: number }>) {
    return Object.values(totals).reduce((acc, val) => {
      acc.nuits += val.nuits;
      acc.prix += val.prix;
      acc.h2c += val.h2c;
      acc.h2cHT += val.h2cHT;
      return acc;
    }, { nuits: 0, prix: 0, h2c: 0, h2cHT: 0 });
  }

  exportAllTablesToCSV(): void {
    const rows: string[] = [];

    // --- RÉSERVATIONS ---
    rows.push('╔══════════════════════════════╗');
    rows.push('║         RÉSERVATIONS         ║');
    rows.push('╚══════════════════════════════╝');
    rows.push('Nom du voyageur;Date de début;Date de fin;Prix;Prix H2C;Prix H2C HT;Frais ménage;Frais ménage HT;Logement;Plateforme');

    this.getFiltered(this.reservations).forEach(r => {
      rows.push([
        r.Nom_voyageur,
        r.date_debut,
        r.date_fin,
        r.prix,
        this.calculateH2cPrice(r).toFixed(2),
        this.calculateHorsTaxe(r).toFixed(2),
        this.calculateMenage(r).toFixed(2),
        this.calculateMenageHorsTaxe(r).toFixed(2),
        r.logement,
        r.Plateforme
      ].join(';'));
    });

    // --- CONSOMMABLES ---
    rows.push('');
    rows.push('╔══════════════════════════════╗');
    rows.push('║        CONSOMMABLES          ║');
    rows.push('╚══════════════════════════════╝');
    rows.push('Nom magasin;Prix;Prix HT;Logement');

    this.getFiltered(this.consommables).forEach(c => {
      rows.push([
        c['Nom magasin'],
        c.prix,
        this.calculateConsommableHorsTaxe(c).toFixed(2),
        c.logement
      ].join(';'));
    });

    // --- INTERVENTIONS ---
    rows.push('');
    rows.push('╔══════════════════════════════╗');
    rows.push('║         INTERVENTIONS        ║');
    rows.push('╚══════════════════════════════╝');
    rows.push('ID;Description;Prix;Prix HT;Logement');

    this.getFiltered(this.interventions).forEach(i => {
      rows.push([
        i.id,
        i.Description,
        i.prix,
        this.calculateInterventionHorsTaxe(i).toFixed(2),
        i.logement
      ].join(';'));
    });

    // --- TOTAUX PAR PLATEFORME ---
    rows.push('');
    rows.push('╔══════════════════════════════╗');
    rows.push('║     TOTAUX PAR PLATEFORME    ║');
    rows.push('╚══════════════════════════════╝');
    rows.push('Plateforme;Nombre de nuits;Prix total (€);Prix H2C (€);Prix H2C HT (€)');

    const totals = this.getPlatformTotals();
    this.getPlatformNames().forEach(p => {
      const t = totals[p];
      rows.push([
        p,
        t.nuits,
        t.prix.toFixed(2),
        t.h2c.toFixed(2),
        t.h2cHT.toFixed(2)
      ].join(';'));
    });

    const totalGlobal = this.getTotalGlobal(totals);
    rows.push([
      'Total général',
      totalGlobal.nuits,
      totalGlobal.prix.toFixed(2),
      totalGlobal.h2c.toFixed(2),
      totalGlobal.h2cHT.toFixed(2)
    ].join(';'));

    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'facturation.csv';
    a.click();
  }
}
