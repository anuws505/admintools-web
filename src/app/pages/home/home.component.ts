import { Component } from '@angular/core';
const ELEMENT_DATA: any = [
  {position: 1, name: 'ภาษาไทย Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'ภาษาไทย Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'ภาษาไทย Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'ภาษาไทย Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'ภาษาไทย Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'ภาษาไทย Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'ภาษาไทย Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'ภาษาไทย Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'ภาษาไทย Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'ภาษาไทย Neon', weight: 20.1797, symbol: 'Ne'},
  {position: 11, name: 'ภาษาไทย Sodium', weight: 22.9897, symbol: 'Na'},
  {position: 12, name: 'ภาษาไทย Magnesium', weight: 24.305, symbol: 'Mg'},
  {position: 13, name: 'ภาษาไทย Aluminum', weight: 26.9815, symbol: 'Al'},
  {position: 14, name: 'ภาษาไทย Silicon', weight: 28.0855, symbol: 'Si'},
  {position: 15, name: 'ภาษาไทย Phosphorus', weight: 30.9738, symbol: 'P'},
  {position: 16, name: 'ภาษาไทย Sulfur', weight: 32.065, symbol: 'S'},
  {position: 17, name: 'ภาษาไทย Chlorine', weight: 35.453, symbol: 'Cl'},
  {position: 18, name: 'ภาษาไทย Argon', weight: 39.948, symbol: 'Ar'},
  {position: 19, name: 'ภาษาไทย Potassium', weight: 39.0983, symbol: 'K'},
  {position: 20, name: 'ภาษาไทย Calcium', weight: 40.078, symbol: 'Ca'},
];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
}
