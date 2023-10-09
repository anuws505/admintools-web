import { Component, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';

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
