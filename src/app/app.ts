import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('schweizer-frank');

  // Status
  selectedStatus = 'ledig';
  relationshipStatuses = [
    'ledig',
    'verheiratet (ein Verdiener)',
    'verheiratet (zwei Verdiener)',
  ];

  // Children
  selectedChildren = 'keine';
  childrenOptions = ['keine', '1', '2', '3', '4', '5'];

  // Canton of residence
  selectedCanton = 'Aargau (AG)';
  cantons = [
    'Aargau (AG)', 'Appenzell Innerrhoden (AI)', 'Appenzell Ausserrhoden (AR)', 'Bern (BE)', 'Basel-Land (BL)', 
    'Basel-Stadt (BS)', 'Freiburg (FR)', 'Genf (GE)', 'Glarus (GL)', 'Graubünden (GR)', 'Jura (JU)', 'Luzern (LU)',
    'Neuenburg (NE)', 'Nidwalden (NW)', 'Obwalden (OW)', 'St. Gallen (SG)', 'Schaffhausen (SH)', 'Solothurn (SO)',
    'Schwyz (SZ)', 'Thurgau (TG)', 'Tessin (TI)', 'Uri (UR)', 'Waadt (VD)', 'Wallis (VS)', 'Zug (ZG)', 'Zürich (ZH)'
  ];
}
