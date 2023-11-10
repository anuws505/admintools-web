import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
// import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private API_BE_ADMIN = '';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': 'bearer onlinestore'
    })
  };

  constructor(private httpClient: HttpClient) {}

  // example result from local files
  getExOrders(request: any): Observable<any> {
    return this.httpClient.get<any>('assets/testorders.json');
  }
  // const resultA = await lastValueFrom(this.orderService.getExOrders(request));

  getExOrderDetail(request: any): Observable<any> {
    return this.httpClient.get<any>('assets/testorderdetail.json');
  }
  // const resultB = await lastValueFrom(this.orderService.getExOrderDetail(request));

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
}
