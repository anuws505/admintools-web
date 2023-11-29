import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private API_BE = environment.api_be_url;
  private API_BE_INTRA = environment.api_be_intra_url;
  private API_BE_ADMIN = environment.api_be_admintools_url;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': 'bearer onlinestore'
    })
  };

  constructor(private httpClient: HttpClient) {}

  // example result from local files
  getOrdersExample(request: any): Observable<any> {
    return this.httpClient.get<any>('assets/testorders.json');
  }
  // const resultA = await lastValueFrom(this.orderService.getOrdersExample(request));

  getOrderDetailExample(request: any): Observable<any> {
    return this.httpClient.get<any>('assets/testorderdetail.json');
  }
  // const resultA = await lastValueFrom(this.orderService.getOrderDetailExample(request));

  getExportOrderExample(request: any): Observable<any> {
    return this.httpClient.get<any>('assets/testorders.json');
  }
  // const resultA = await lastValueFrom(this.orderService.getExportOrderExample(request));

  getTransactionID(): any {
    const dateNow: Date = new Date();
    const pipe = new DatePipe('en-US');
    const myFormattedDate = pipe.transform(dateNow, 'yyyyMMddHHmmssSSS');
    return 'LGO'+myFormattedDate;
  }

  // call api from lego-be
  getOrders(request: any): Observable<any> {
    return this.httpClient.post<any>(
      this.API_BE_ADMIN + '/be/admintoolsservice/action/queryOrderByKey',
      request, this.httpOptions
    );
  }
  getOrderDetail(request: any): Observable<any> {
    return this.httpClient.post<any>(
      this.API_BE_ADMIN + '/be/admintoolsservice/action/queryOrderDetail',
      request, this.httpOptions
    );
  }
  callUpdateProgress(request: any): Observable<any> {
    return this.httpClient.post<any>(
      this.API_BE_INTRA + '/be/admintoolsservice/action/callUpdateProgress',
      request, this.httpOptions
    );
  }
  callRepairDataDB(): Observable<any> {
    return this.httpClient.post<any>(
      this.API_BE + '/be/repairDataDb/action/repairDataDB',
      {}, this.httpOptions
    );
  }

  // order progress all action
  actionDoResendData(progressName: any, request: any): Observable<any> {
    const progName = progressName.trim().toLowerCase();

    switch (progName) {
      // case 'order_list':
      //   return this.httpClient.post<any>(
      //     this.API_BE + '/dt/createOrderList/action/createOrderList',
      //     request, this.httpOptions
      //   );
      //   break;

      default:
        return this.httpClient.get<any>('assets/errornodata.json');
        break;
    }
  }
}
