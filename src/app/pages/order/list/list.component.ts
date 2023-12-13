import { Component } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { lastValueFrom } from 'rxjs';
import { OrderService } from '../order.service';
import { PageEvent } from '@angular/material/paginator';
import { LogService } from '../../../shared/log.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AuthenService } from '../../../shared/authen/authen.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {
  reqOrderList: any = {
    transactionID: this.orderService.getTransactionID(),
    find: {'status_provisioning.status_code': {$in: ['001','002','003','004','007','018']}},
    pages: 1,
    limit: 20,
    skip: 0,
    sort: {$natural: -1}
  };

  search: any = {
    orderNo: '',
    reserveId: '',
    transactionId: '',
    orderCode: '',
    dateCreated: '',
    kycResult: '',
    customerContact: '',
    simMobileNo: '',
    orderStatus: '',
    progressApiStatus: ''
  };

  searchKey: any = {
    orderNo: 'order_no',
    reserveId: 'reserve_id',
    transactionId: 'transaction_id',
    orderCode: 'data_order.items.orderCode',
    dateCreated: 'created_at',
    kycResult: 'data_order.kycResult',
    customerContact: 'data_order.shipping.mobileNo',
    simMobileNo: 'data_order.items.sim.simMobileNo',
    orderStatus: 'status_provisioning.status_code',
    progressApiStatus: 'status_progress.status_code'
  };

  displayedColumns: any = [
    'no',
    'orderNo',
    'reserveId',
    'transactionId',
    'orderCode',
    'createTime',
    'updateTime',
    'kycResult',
    'customerName',
    'customerContact',
    'simMobileNo',
    'statusProvisioning',
    'progressApi',
    'statusProgress',
    'trackingData',
    'repairData'
  ];
  dataSource: any = [];

  exportCSV: any = {
    flag: false,
    queryObj: {},
    data: [],
    rows: 0
  };

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
    private logger: LogService,
    private dialog: MatDialog,
    private authenService: AuthenService
  ) {
    this.title.setTitle('Order List - LEGO Admintools');
  }

  ngOnInit() {
    // this.reqOrderList.limit = this.pageSize;
    // this.getOrders(this.reqOrderList);
  }

  searchOrderNo($event: any) {
    this.search.orderNo = $event.target.value;
  }

  searchReserveId($event: any) {
    this.search.reserveId = $event.target.value;
  }

  searchTransactionId($event: any) {
    this.search.transactionId = $event.target.value;
  }

  searchOrderCode($event: any) {
    if ($event === undefined) { this.search.orderCode = ''; } else { this.search.orderCode = $event; }
  }

  searchDateCreated(event: MatDatepickerInputEvent<Date>) {
    if (event.value !== null) {
      this.search.dateCreated = event.value;
    } else {
      this.search.dateCreated = '';
    }
  }

  searchKYCResult($event: any) {
    if ($event === undefined) { this.search.kycResult = ''; } else { this.search.kycResult = $event; }
  }

  searchCustomerContact($event: any) {
    this.search.customerContact = $event.target.value;
  }

  searchSimMobileNo($event: any) {
    this.search.simMobileNo = $event.target.value;
  }

  searchOrderStatus($event: any) {
    if ($event === undefined) { this.search.orderStatus = ''; } else { this.search.orderStatus = $event; }
  }

  searchProgressStatus($event: any) {
    if ($event === undefined) { this.search.progressApiStatus = ''; } else { this.search.progressApiStatus = $event; }
  }

  clearSearch() {
    Object.keys(this.search).forEach((prop: any) => {
      this.search[prop] = '';
    });

    this.exportCSV.flag = false;
    this.exportCSV.queryObj = {};
    this.exportCSV.data = [];
    this.exportCSV.rows = 0;
  }

  submitSearch() {
    let findObj: any = {};
    findObj['status_provisioning.status_code'] = {$in: ['001','002','003','004','007','018']};

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
        else if (this.searchKey[prop] === 'data_order.shipping.mobileNo') {
          findObj['data_order.shipping.mobileNo'] = {$regex: this.search.customerContact.trim(), $options: "i"};
          findObj['data_order.receipt.mobileNo'] = {$regex: this.search.customerContact.trim(), $options: "i"};
        }
        else if (this.searchKey[prop] === 'data_order.items.orderCode') {
          findObj[this.searchKey[prop]] = {$in: [parseInt(this.search[prop].trim())]};
        }
        else if (this.searchKey[prop] === 'status_provisioning.status_code') {
          findObj[this.searchKey[prop]] = {$in: [this.search.orderStatus.trim()]};
        }
        else if (this.searchKey[prop] === 'status_progress.status_code') {
          findObj[this.searchKey[prop]] = {$in: [this.search.progressApiStatus.trim()]};
        }
        else {
          findObj[this.searchKey[prop]] = {$regex: this.search[prop].trim(), $options: "i"};
        }
      }
    });

    this.reqOrderList.find = findObj;
    this.reqOrderList.transactionID = this.orderService.getTransactionID();
    this.reqOrderList.pages = this.pageIndex;
    this.reqOrderList.limit = this.pageSize;
    this.reqOrderList.skip = this.pageSize * this.pageIndex;
    // console.log(this.reqOrderList);

    this.spinner = true;
    this.getOrders(this.reqOrderList);

    this.exportCSV.queryObj = findObj;
  }

  async getOrders(request: any) {
    try {
      const data = await lastValueFrom(this.orderService.getOrders(request));
      if (data.resultCode && Number(data.resultCode) === 20000) {
        if (data.result && data.result.data.length > 0) {
          let someList: any = [];
          let no = 1;
          data.result.data.forEach((prop: any) => {
            let someObj: any = {};
            {
              someObj.no = this.pageSize * this.pageIndex + no;
              someObj.orderNo = prop.orderNo;
              someObj.reserveId = prop.reserveId;
              someObj.orderCode = prop.orderCode;
              someObj.transactionId = prop.transactionId;
              someObj.createTime = prop.createTime;
              someObj.updateTime = prop.updateTime;
              someObj.kycResult = prop.kycResult;
              someObj.kycResultTextColor = (prop.kycResult.trim().toUpperCase() === 'N') ? 'txt-stat-fail' : '';
              someObj.customerName = (prop.customerName) ? this.markCusName(prop.customerName, true, ' ') : prop.customerName;
              someObj.customerContact = (prop.customerContact) ? this.markMobileNo(prop.customerContact, true, ',') : prop.customerContact;
              someObj.simMobileNo = (prop.simMobileNo) ? this.markMobileNo(prop.simMobileNo, true, ',') : prop.simMobileNo;
              someObj.statusProvisioning = prop.statusProvisioning;
              someObj.statusProvisioningTextColor = this.setStatusColor(prop.statusProvisioning),
              someObj.statusProgress = prop.statusProgress;
              someObj.statusProgressTextColor = (prop.statusProgress.trim().toUpperCase() === 'FAIL') ? 'txt-stat-fail' : '';
              someObj.progressApi = (prop.progressApi?.progress?.api) ? prop.progressApi.progress.api : '';
              someObj.trackingData = (prop.trackingData) ? prop.trackingData : { trackingNo: '', trackingURL: '' };
            }
            someList.push(someObj);
            no++;
          });

          this.dataSource = someList;
          this.length = data.result.recordsFiltered;
          this.exportCSV.flag = true;

          if (this.length == 0) {
            this.zeroDataMessage = 'No data found';
            this.exportCSV.flag = false;
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

    if ('SUCCESS' === keyStr || 'REPAIRSUCCESS' === keyStr) {
      resp = 'txt-stat-success';
    }
    else if ('FAIL' === keyStr) {
      resp = 'txt-stat-fail';
    }
    else if ('WAITING' === keyStr) {
      resp = 'txt-stat-waiting';
    }
    else if ('IN PROGRESS' === keyStr) {
      resp = 'txt-stat-in-progress';
    }

    return resp;
  }

  markCusName(data: any, flag: boolean, trace: any) {
    if (!flag) {
      return data;
    }

    let splitX = data.split(trace);
    if (splitX.length > 0) {
      let retData: any = [];
      splitX.forEach((data: any) => {
        let len = data.length;
        if (len >= 3) {
          retData.push(data.substring(0, 3).concat(new Array(len-3).fill('x').join('')));
        }
      });
      return retData.join(trace);
    }

    return data;
  }

  markMobileNo(data: any, flag: boolean, trace: any) {
    if (!flag) {
      return data;
    }

    let splitX = data.split(trace);
    if (splitX.length > 0) {
      let retData: any = [];
      splitX.forEach((data: any) => {
        let len = data.length;
        if (len >= 3) {
          retData.push(data.substring(0, 3).concat('xxxx').concat(data.substring(7, len)));
        }
      });
      return retData.join(trace);
    }

    return data;
  }

  handlePageEvent(e: any) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;

    this.reqOrderList.transactionID = this.orderService.getTransactionID();
    this.reqOrderList.pages = this.pageIndex;
    this.reqOrderList.limit = this.pageSize;
    this.reqOrderList.skip = this.pageSize * this.pageIndex;
    // console.log(this.reqOrderList);

    this.spinner = true;
    this.getOrders(this.reqOrderList);
  }

  async exportOrder() {
    if (this.exportCSV.flag) {
      this.spinner = true;

      let expObj: any = {
        find: this.exportCSV.queryObj
      };
      const data = await lastValueFrom(this.orderService.getExportOrder(expObj));
      if (data.resultCode && Number(data.resultCode) === 20000) {
        // save logs data
        const logData: any = {};
        logData.progressName = 'exportOrders';
        logData.requestData = expObj;
        let xBar: any = {};
        xBar.resultCode = data.resultCode;
        xBar.resultMessage = data.resultMessage;
        xBar.resultData = [{'exportdata':'force mark xxx data'}];
        xBar.resultRows = data.resultRows;
        logData.responseData = xBar;
        logData.username = this.authenService.getUserLoginData();
        this.logger.log('EXPORT ORDER DATA', logData);

        if (data.resultData && data.resultData.length > 0) {
          this.exportCSV.data = data.resultData;
          this.exportCSV.rows = data.resultRows;

          let propNames = Object.keys(this.exportCSV.data[0]);
          let rowWithPropNames: any = propNames.join(',')+'\n';
          let csvContent = rowWithPropNames;
          let rows: any = [];

          this.exportCSV.data.forEach((item: any) => {
            let values: any = [];
            propNames.forEach((key: any) => {
              let val = item[key];
              if (val !== undefined && val !== null) {
                val = JSON.stringify(val);
              } else {
                val = '';
              }
              values.push(val);
            });
            rows.push(values.join(','));
          });

          csvContent += rows.join('\n');

          let dateNow: Date = new Date();
          let pipe = new DatePipe('en-US');
          let myFormattedDate = pipe.transform(dateNow, 'yyyyMMddHHmmss');

          let hiddenElement = document.createElement('a');
          hiddenElement.href = 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURI(csvContent);
          hiddenElement.target = '_blank';
          hiddenElement.download = 'NCP_Admintools_Orders_Report_'+myFormattedDate+'.csv';
          hiddenElement.click();
        }

        this.exportCSV.flag = false;
        this.exportCSV.queryObj = {};
        this.exportCSV.data = [];
        this.exportCSV.rows = 0;
      }
    }

    this.spinner = false;
  }

  openExportDataDialog() {
    const dialogRef = this.dialog.open(DialogContentLogoutDialog);

    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
      if (result) {
        this.exportOrder();
      }
    });
  }
}

@Component({
  selector: 'export-data-dialog',
  templateUrl: './export-data-dialog.html',
  styleUrls: ['./list.component.scss'],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class DialogContentLogoutDialog {}
