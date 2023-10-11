import { Component, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';

const ELEMENT_DATA: any = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H',position2: 1, name2: 'Hydrogen2', weight2: 1.0079, symbol2: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He',position2: 2, name2: 'Helium2', weight2: 4.0026, symbol2: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li',position2: 3, name2: 'Lithium2', weight2: 6.941, symbol2: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be',position2: 4, name2: 'Beryllium2', weight2: 9.0122, symbol2: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B',position2: 5, name2: 'Boron2', weight2: 10.811, symbol2: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C',position2: 6, name2: 'Carbon2', weight2: 12.0107, symbol2: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N',position2: 7, name2: 'Nitrogen2', weight2: 14.0067, symbol2: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O',position2: 8, name2: 'Oxygen2', weight2: 15.9994, symbol2: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F',position2: 9, name2: 'Fluorine2', weight2: 18.9984, symbol2: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne',position2: 10, name2: 'Neon2', weight2: 20.1797, symbol2: 'Ne'},
];

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  search: any = {
    orderNo: '',
    transactionId: '',
    orderCode: '',
    dateCreated: ''
  }
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol' ,'position2', 'name2', 'weight2', 'symbol2' ,'position3', 'name3', 'weight3', 'symbol3'];
  dataSource = ELEMENT_DATA;

  constructor() {}

  ngOnInit(): void {
    console.log(this.search);
  }

  searchOrderNo($event: any) {
    this.search.orderNo = $event.target.value;
    console.log(this.search);
  }

  searchTransactionId($event: any) {
    this.search.transactionId = $event.target.value;
    console.log(this.search);
  }

  searchOrderCode($event: any) {
    if ($event === undefined) { this.search.orderCode = ''; } else { this.search.orderCode = $event; }
    console.log(this.search);
  }

  searchDateCreated(event: MatDatepickerInputEvent<Date>) {
    if (`${event.value}` !== null) {
      let pipe = new DatePipe('en-US');
      this.search.dateCreated = pipe.transform(`${event.value}`, 'yyyy-MM-dd');
    }
    console.log(this.search);
  }

  clearSearch() {
    // let flag = false;
    Object.keys(this.search).forEach((prop: any) => {
      // if (this.search[prop] !== '') {
      //   flag = true;
      // }
      this.search[prop] = '';
    });
    console.log(this.search);
  }

  submitSearch() {
    // let flag = false;
    let findObj: any = {};
    findObj['status_provisioning.status_code'] = {$in: ['001','003','004','007']};

    /* Object.keys(this.search).forEach((prop: any) => {
      console.log(prop);
      // if (this.search[prop].trim() !== '') {}
    }); */
    console.log(this.search);
  }
}
