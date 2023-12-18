import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { lastValueFrom } from 'rxjs';
import { OrderService } from '../order.service';
import { PageEvent } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-reserve',
  templateUrl: './reserve.component.html',
  styleUrls: ['./reserve.component.scss']
})
export class ReserveComponent {
  reqReserveOrder: any = {
    transactionID: this.orderService.getTransactionID(),
    find: {},
    pages: 1,
    limit: 20,
    skip: 0,
    sort: {$natural: -1}
  };

  search: any = {
    reserveId: '',
    transactionId: '',
    orderNo: '',
    dateCreated: '',
  };

  searchKey: any = {
    reserveId: 'reserve_id',
    transactionId: 'transaction_id',
    orderNo: 'order_no',
    dateCreated: 'created_at',
  };

  displayedColumns: any = [
    'no',
    'reserveId',
    'transactionId',
    'orderNo',
    'channel',
    'createdDate',
    'updatedDate',
    'statusOrder',
    'statusProgress'
  ];
  dataSource: any = [];

  pageEvent: PageEvent = new PageEvent;
  length = 0;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  zeroDataMessage = 'List of data';

  spinner: boolean = false;

  constructor(
    private title: Title,
    private orderService: OrderService
  ) {
    this.title.setTitle('Order Reserve - LEGO Admintools');
  }

  ngOnInit() {
    // this.reqReserveOrder.limit = this.pageSize;
    // this.getReserveOrder(this.reqReserveOrder);
  }

  searchReserveId($event: any) {
    this.search.reserveId = $event.target.value;
  }

  searchTransactionId($event: any) {
    this.search.transactionId = $event.target.value;
  }

  searchOrderNo($event: any) {
    this.search.orderNo = $event.target.value;
  }

  searchDateCreated(event: MatDatepickerInputEvent<Date>) {
    if (event.value !== null) {
      this.search.dateCreated = event.value;
    } else {
      this.search.dateCreated = '';
    }
  }

  clearSearch() {
    Object.keys(this.search).forEach((prop: any) => {
      this.search[prop] = '';
    });
  }

  submitSearch() {
    let findObj: any = {};
    let configDays = 7; // from configuration
    let searchDateNow = new Date();
    searchDateNow.setDate(searchDateNow.getDate() - configDays);
    let searchDatePipe = new DatePipe('en-US');
    findObj['created_at'] = {$gte: searchDatePipe.transform(searchDateNow, 'yyyy-MM-dd'+' 00:00:00'), $lte: searchDatePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss')};

    Object.keys(this.search).forEach((prop: any) => {
      if (this.search[prop] && this.search[prop] !== '') {
        if (this.searchKey[prop] == 'created_at') {
          if (this.search.dateCreated && this.search.dateCreated !== null) {
            let thisDate = new Date();
            thisDate.setDate(this.search.dateCreated.getDate() - configDays);
            let thisPipe = new DatePipe('en-US');
            findObj['created_at'] = {$gte: thisPipe.transform(thisDate, 'yyyy-MM-dd'+' 00:00:00'), $lte: thisPipe.transform(this.search.dateCreated, 'yyyy-MM-dd'+' 23:59:59')};
          }
        }
        else {
          findObj[this.searchKey[prop]] = {$regex: this.search[prop].trim(), $options: "i"};
        }
      }
    });

    this.reqReserveOrder.find = findObj;
    this.reqReserveOrder.transactionID = this.orderService.getTransactionID();
    this.reqReserveOrder.pages = this.pageIndex;
    this.reqReserveOrder.limit = this.pageSize;
    this.reqReserveOrder.skip = this.pageSize * this.pageIndex;
    // console.log(this.reqReserveOrder);

    this.spinner = true;
    this.getReserveOrder(this.reqReserveOrder);
  }

  async getReserveOrder(request: any) {
    try {
      const result = await lastValueFrom(this.orderService.getReserveOrder(request));
      if (result.resultCode && Number(result.resultCode) == 20000) {
        if (result.resultData?.data && result.resultData.data.length > 0) {
          let someList: any = [];
          let no = 1;
          result.resultData.data.forEach((prop: any) => {
            let someObj: any = {};
            {
              someObj.no = this.pageSize * this.pageIndex + no;
              someObj.reserveId = prop.reserve_id;
              someObj.transactionId = prop.transaction_id;
              someObj.orderNo = (prop.order_no && prop.order_no != '') ? prop.order_no : '-';
              someObj.channel = prop.channel;
              someObj.createdDate = prop.created_at;
              someObj.updatedDate = prop.updated_at;
              someObj.statusOrder = prop.status.status_description;
              someObj.statusOrderTextColor = this.setStatusColor(prop.status.status_description);
              someObj.statusProgress = prop.status_progress.status_description;
              let statLbl = prop.status_progress?.status_description;
              someObj.statusProgressTextColor = (statLbl && statLbl.trim().toUpperCase() == 'FAIL') ? 'txt-stat-fail' : '';
            }
            someList.push(someObj);
            no++;
          });
          this.dataSource = someList;
          this.length = result.resultData.recordsFiltered;

          if (this.length == 0) {
            this.zeroDataMessage = 'No data found';
          }
        }
      }
    } catch (error) {
      console.log(error);
    }

    this.spinner = false;
  }

  setStatusColor(keyStat: any) {
    let resp: any = '';
    const keyStr: any = keyStat.trim().toUpperCase();

    if (keyStr == 'SUCCESS' || keyStr == 'REPAIRSUCCESS' || keyStr == 'REPAIR SUCCESS') {
      resp = 'txt-stat-success';
    }
    else if (keyStr == 'FAIL') {
      resp = 'txt-stat-fail';
    }
    else if (keyStr == 'WAITING') {
      resp = 'txt-stat-waiting';
    }
    else if (keyStr == 'IN PROGRESS') {
      resp = 'txt-stat-in-progress';
    }

    return resp;
  }

  handlePageEvent(e: any) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;

    this.reqReserveOrder.transactionID = this.orderService.getTransactionID();
    this.reqReserveOrder.pages = this.pageIndex;
    this.reqReserveOrder.limit = this.pageSize;
    this.reqReserveOrder.skip = this.pageSize * this.pageIndex;
    // console.log(this.reqReserveOrder);

    this.spinner = true;
    this.getReserveOrder(this.reqReserveOrder);
  }
}
