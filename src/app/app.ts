import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  AhTaxBracket,
  AhkTaxBracket,
  BTaxBracket,
  BkTaxBracket,
  CTaxBracket,
  CkTaxBracket,
  taxBrackets,
} from './taxBrackets';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('schweizer-frank');

  enteredMonthlySalaryInput = 0;
  churchMember = 'yes';

  // Status
  selectedStatus = RelationshipStatus.LEDIG;
  relationshipStatuses = Object.values(RelationshipStatus);

  // Children
  childrenOptions: number[] = Array.from({ length: 7 }, (_, i) => i); // [0, 1, 2, 3, 4, 5, 6]
  selectedChildren = 0;

  // Canton of residence
  selectedCanton = 'Aargau (AG)';
  cantons = [
    'Aargau (AG)',
    'Appenzell Innerrhoden (AI)',
    'Appenzell Ausserrhoden (AR)',
    'Bern (BE)',
    'Basel-Land (BL)',
    'Basel-Stadt (BS)',
    'Freiburg (FR)',
    'Genf (GE)',
    'Glarus (GL)',
    'Graubünden (GR)',
    'Jura (JU)',
    'Luzern (LU)',
    'Neuenburg (NE)',
    'Nidwalden (NW)',
    'Obwalden (OW)',
    'St. Gallen (SG)',
    'Schaffhausen (SH)',
    'Solothurn (SO)',
    'Schwyz (SZ)',
    'Thurgau (TG)',
    'Tessin (TI)',
    'Uri (UR)',
    'Waadt (VD)',
    'Wallis (VS)',
    'Zug (ZG)',
    'Zürich (ZH)',
  ];

  calculatedTax = 0;

  calculateTax() {
    let tariff: string = '';
    switch (this.selectedStatus) {
      case 'ledig':
        tariff = this.selectedChildren === 0 ? 'A' : 'H';
        break;
      case 'verheiratet (ein Verdiener)':
        tariff = 'B';
        break;
      case 'verheiratet (zwei Verdiener)':
        tariff = 'C';
        break;
    }
    tariff = tariff + this.selectedChildren;
    if (this.churchMember === 'yes') {
      tariff = tariff + 'Y';
    } else {
      tariff = tariff + 'N';
    }
    const targetTaxBrackets = tariff.charAt(0) + tariff.charAt(2);
    console.log('Selected target tax bracket: ' + targetTaxBrackets);
    switch (targetTaxBrackets) {
      case 'AY':
      case 'HY':
        console.log(taxBrackets.ahkTaxBrackets);
        this.calculatedTax =
          taxBrackets.ahkTaxBrackets.findLast(
            (tb) => tb.incomeMin <= this.enteredMonthlySalaryInput
          )?.[tariff as keyof AhkTaxBracket] ?? 0;
        break;
      case 'BY':
        this.calculatedTax =
          taxBrackets.bkTaxBrackets.findLast(
            (tb) => tb.incomeMin <= this.enteredMonthlySalaryInput
          )?.[tariff as keyof BkTaxBracket] ?? 0;
        break;
      case 'CY':
        this.calculatedTax =
          taxBrackets.ckTaxBrackets.findLast(
            (tb) => tb.incomeMin <= this.enteredMonthlySalaryInput
          )?.[tariff as keyof CkTaxBracket] ?? 0;
        break;
      case 'AN':
      case 'HN':
        this.calculatedTax =
          taxBrackets.ahTaxBrackets.findLast(
            (tb) => tb.incomeMin <= this.enteredMonthlySalaryInput
          )?.[tariff as keyof AhTaxBracket] ?? 0;
        break;
      case 'BN':
        this.calculatedTax =
          taxBrackets.bTaxBrackets.findLast(
            (tb) => tb.incomeMin <= this.enteredMonthlySalaryInput
          )?.[tariff as keyof BTaxBracket] ?? 0;
        break;
      case 'CN':
        this.calculatedTax =
          taxBrackets.cTaxBrackets.findLast(
            (tb) => tb.incomeMin <= this.enteredMonthlySalaryInput
          )?.[tariff as keyof CTaxBracket] ?? 0;
        break;
    }
  }

  // TODO: Nochmal intensiven Test machen, ob diese Berechnung
  // auch wirklich exakt ist oder doch decimal.js verwendet
  // werden soll
  calculateQuellensteuerAbgabe() {
    return (
      (this.enteredMonthlySalaryInput * this.calculatedTax) /
      100
    ).toFixed(2);
  }

  calculateAhvIvEoBeitrag() {
    return (this.enteredMonthlySalaryInput * 0.053).toFixed(2);
  }

  calculateAlvEoBeitrag() {
    return (this.enteredMonthlySalaryInput * 0.011).toFixed(2);
  }
}

enum RelationshipStatus {
  LEDIG = 'ledig',
  VERHEIRATET_1 = 'verheiratet (ein Verdiener)',
  VERHEIRATET_2 = 'verheiratet (zwei Verdiener)',
}
