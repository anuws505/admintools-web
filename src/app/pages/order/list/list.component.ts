import { Component, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { lastValueFrom } from 'rxjs';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  reqOrderList: any = {
    transactionID: this.orderService.getTransactionID(),
    find: {'status_provisioning.status_code': {$in: ['001','002','003','004','007','018']}},
    pages: 1,
    limit: 25,
    sort: {$natural: -1}
  };

  search: any = {
    orderNo: '',
    transactionId: '',
    orderCode: '',
    dateCreated: ''
  }
  displayedColumns: any = [
    'orderNo',
    'reserveId',
    'orderCode',
    'transactionId',
    'createTime',
    'updateTime',
    'kyc_result',
    'customerName',
    'customerContact',
    'simMobileNo',
    'statusProgress',
    'statusProvisioning',
    'progressApi',
    'trackingData'
  ];
  dataSource: any = [];

  constructor(
    private title: Title,
    private orderService: OrderService,
  ) {
    this.title.setTitle('Order list - LEGO Admintools');
  }

  ngOnInit(): void {
    // console.log(this.search);
    this.getOrders(this.reqOrderList);
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
    findObj['status_provisioning.status_code'] = {$in: ['001','002','003','004','007','018']};

    /* Object.keys(this.search).forEach((prop: any) => {
      console.log(prop);
      // if (this.search[prop].trim() !== '') {}
    }); */
    console.log(this.search);
  }

  async getOrders(request: any) {
    console.log(request);
    try {
      const data = await lastValueFrom(this.orderService.getExOrders(request));
      if (data.resultCode && data.resultCode === '20000') {
        if (data.result && data.result.data.length > 0) {
          console.log(data);
          let someList: any = [];
          data.result.data.forEach((prop: any) => {
            let someObj: any = {};
            {
              someObj.orderNo = prop.orderNo;
              someObj.reserveId = prop.reserveId;
              someObj.orderCode = prop.orderCode;
              someObj.transactionId = prop.transactionId;
              someObj.createTime = prop.createTime;
              someObj.updateTime = prop.updateTime;
              someObj.kyc_result = prop.kyc_result;
              someObj.customerName = prop.customerName;
              someObj.customerContact = prop.customerContact;
              someObj.simMobileNo = prop.simMobileNo;
              someObj.statusProgress = prop.statusProgress;
              someObj.statusProvisioning = prop.statusProvisioning;
              someObj.progressApi = (prop.progressApi?.progress?.api) ? prop.progressApi.progress.api : '';
              someObj.trackingData = (prop.trackingData) ? prop.trackingData : { trackingNo: '', trackingURL: '' };
              /* if (prop.trackingData?.trackingNo && prop.trackingData.trackingNo !== '') {
                someObj.trackingData = prop.trackingData.trackingNo;
              }
              if (prop.trackingData?.trackingURL && prop.trackingData.trackingURL !== '') {
                someObj.trackingData = '<a href="'+prop.trackingData.trackingURL+'">'+prop.trackingData.trackingNo+'</a>';
              } */
            }
            someList.push(someObj);
          });

          this.dataSource = someList;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}
