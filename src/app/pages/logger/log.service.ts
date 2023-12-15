import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { lastValueFrom, Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private API_BE_ADMIN = environment.api_be_admintools_url;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': 'bearer onlinestore'
    })
  };

  constructor(private httpClient: HttpClient) {}

  async writelog(uName: any, msg: any) {
    const dateNow: Date = new Date();
    const pipe = new DatePipe('en-US');
    const transactID = pipe.transform(dateNow, 'yyyyMMddHHmmssSSS');
    const myFormattedDate = pipe.transform(dateNow, 'yyyy-MM-dd HH:mm:ss.SSS');

    const request: any = {};
    request.transactID = 'LGOADM'+transactID;
    request.datelog = myFormattedDate;
    request.user = uName;
    request.message = msg;

    await lastValueFrom(this.savelog(request));
  }

  savelog(request: any): Observable<any> {
    return this.httpClient.post<any>(
      this.API_BE_ADMIN + '/be/admintoolsservice/action/savelog',
      request, this.httpOptions
    );
  }

  getlog(request: any): Observable<any> {
    return this.httpClient.post<any>(
      this.API_BE_ADMIN + '/be/admintoolsservice/action/getlog',
      request, this.httpOptions
    );
  }

  clearlog(request: any): Observable<any> {
    return this.httpClient.post<any>(
      this.API_BE_ADMIN + '/be/admintoolsservice/action/clearlog',
      request, this.httpOptions
    );
  }
}
