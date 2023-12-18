import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { OrderService } from '../../order/order.service';
import { lastValueFrom } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { LogService } from '../../logger/log.service';

@Component({
  selector: 'app-actionlog',
  templateUrl: './actionlog.component.html',
  styleUrls: ['./actionlog.component.scss']
})
export class ActionlogComponent {
  reqLog: any = {
    transactionID: this.orderService.getTransactionID(),
    find: {},
    pages: 1,
    limit: 20,
    skip: 0,
    sort: { 'created_at': -1 }
  };

  search: any = {
    dateCreated: '',
    userName: ''
  };

  searchKey: any = {
    dateCreated: 'created_at',
    userName: 'user.userName'
  };

  displayedColumns: any = [
    'no',
    'createTime',
    'userName',
    'message'
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
    private orderService: OrderService,
    private logger: LogService
  ) {
    this.title.setTitle('Action Logs Data - LEGO Admintools');
  }

  ngOnInit() {
    // this.reqLog.limit = this.pageSize;
    // this.getActionLog(this.reqLog);
  }

  searchDateCreated(event: MatDatepickerInputEvent<Date>) {
    if (event.value !== null) {
      this.search.dateCreated = event.value;
    } else {
      this.search.dateCreated = '';
    }
  }

  searchUsername($event: any) {
    this.search.userName = $event.target.value;
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
        if (this.searchKey[prop] === 'created_at') {
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

    this.reqLog.find = findObj;
    this.reqLog.transactionID = this.orderService.getTransactionID();
    this.reqLog.pages = this.pageIndex;
    this.reqLog.limit = this.pageSize;
    this.reqLog.skip = this.pageSize * this.pageIndex;
    // console.log(this.reqLog);

    this.spinner = true;
    this.getActionLog(this.reqLog);
  }

  async getActionLog(request: any) {
    try {
      const data = await lastValueFrom(this.logger.getlog(request));
      if (data.resultCode && Number(data.resultCode) === 20000) {
        if (data.resultData?.data && data.resultData.data.length > 0) {
          let someList: any = [];
          let no = 1;
          data.resultData.data.forEach((prop: any) => {
            let someObj: any = {};
            {
              someObj.no = this.pageSize * this.pageIndex + no;
              someObj.createTime = prop.datelog;
              someObj.userName = prop.user;
              someObj.message = prop.message;
            }
            someList.push(someObj);
            no++;
          });

          this.dataSource = someList;
          this.length = data.resultData.recordsFiltered;

          if (this.length == 0) {
            this.zeroDataMessage = 'No data found';
          }
        }
      }
    } catch (error: any) {
      console.log(error.error);
    }

    this.spinner = false;
  }

  handlePageEvent(e: any) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;

    this.reqLog.transactionID = this.orderService.getTransactionID();
    this.reqLog.pages = this.pageIndex;
    this.reqLog.limit = this.pageSize;
    this.reqLog.skip = this.pageSize * this.pageIndex;
    // console.log(this.reqLog);

    this.spinner = true;
    this.getActionLog(this.reqLog);
  }
}
