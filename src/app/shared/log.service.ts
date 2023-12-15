import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Observable, lastValueFrom } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';

export enum LogLevel {
  All = 0,
  Debug = 1,
  Info = 2,
  Warn = 3,
  Error = 4,
  Fatal = 5,
  Off = 6
}

@Injectable({
  providedIn: 'root'
})
export class LogService {
  level: LogLevel = LogLevel.All;
  logWithDate: boolean = true;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8'
    })
  };

  constructor(private httpClient: HttpClient) {}

  debug(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Debug, optionalParams);
  }

  info(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Info, optionalParams);
  }

  warn(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Warn, optionalParams);
  }

  error(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Error, optionalParams);
  }

  fatal(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Fatal, optionalParams);
  }

  log(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.All, optionalParams);
  }

  private async writeToLog(msg: string, level: LogLevel, params: any[]) {
    if (this.shouldLog(level)) {
      let entry: LogEntry = new LogEntry();
      entry.message = msg;
      entry.level = level;
      entry.extraInfo = params;
      entry.logWithDate = this.logWithDate;
      entry.logDate = new Date();
      // console.log(entry.buildLogString());

      let logger: any = {};
      let pipe = new DatePipe('en-US');
      let logDate = pipe.transform(entry.logDate, 'yyyy-MM-dd HH:mm:ss');
      logger.logdate = logDate;
      logger.logdata = entry.buildLogString();
      console.log(logger);
      // await lastValueFrom(this.sendLogData(logger));
    }
  }

  private shouldLog(level: LogLevel): boolean {
    let ret: boolean = false;
    if ((level >= this.level && level !== LogLevel.Off) || this.level === LogLevel.All) {
      ret = true;
    }
    return ret;
  }

  sendLogData(request: any): Observable<any> {
    return this.httpClient.get<any>('assets/testorders.json');
    // return this.httpClient.post<any>(
    //   this.API_BE_ADMIN + '/be/admintoolsservice/action/queryOrderByKey',
    //   request, this.httpOptions
    // );
  }
}

export class LogEntry {
  // Public Properties
  message: string = '';
  level: LogLevel = LogLevel.Debug;
  extraInfo: any[] = [];
  logWithDate: boolean = true;
  logDate: any = '';

  buildLogString(): string {
    let ret: string = '';

    if (this.logWithDate) {
      ret = this.logDate + ' - ';
    }

    ret += 'Type: ' + LogLevel[this.level];
    ret += ' - Message: ' + this.message;
    if (this.extraInfo.length) {
      ret += ' - Extra Info: ' + this.formatParams(this.extraInfo);
    }

    return ret;
  }

  private formatParams(params: any[]): string {
    let ret: string = params.join(",");

    // Is there at least one object in the array?
    if (params.some(p => typeof p == "object")) {
      ret = "";

      // Build comma-delimited string
      for (let item of params) {
        ret += JSON.stringify(item) + ",";
      }
    }

    return ret;
  }
}
