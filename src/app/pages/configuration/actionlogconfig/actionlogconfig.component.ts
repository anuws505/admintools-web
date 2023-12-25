import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { lastValueFrom } from 'rxjs';
import { LogService } from '../../logger/log.service';

@Component({
  selector: 'app-actionlogconfig',
  templateUrl: './actionlogconfig.component.html',
  styleUrls: ['./actionlogconfig.component.scss']
})
export class ActionlogconfigComponent {
  dateNowLbl: any = '';
  dateClearLbl: any = '';
  numOfDay: number = 60;

  logMessage: any = {
    display: false,
    status: '',
    message: ''
  };

  spinner: boolean = false;

  constructor(
    private title: Title,
    private logger: LogService,
    private dialog: MatDialog
  ) {
    this.title.setTitle('Action Logs Configuration - LEGO Admintools');
  }

  ngOnInit(): void {
    this.dateNowLbl = this.dateNow();
    this.dateClearLbl = this.dateClear(this.numOfDay);
  }

  searchOrderNo($event: any) {
    this.dateClearLbl = $event.target.value;
  }

  dateNow() {
    let dateNow: Date = new Date();
    let pipe = new DatePipe('en-US');
    return pipe.transform(dateNow, 'yyyy-MM-dd');
  }

  dateClear(numDay: number) {
    let date: Date = new Date();
    date.setDate(date.getDate() - numDay);
    let pipe = new DatePipe('en-US');
    return pipe.transform(date, 'yyyy-MM-dd');
  }

  numOfDayChange($event: any) {
    if (Number($event.target.value) >= 0) {
      this.numOfDay = $event.target.value;
    }

    this.dateClearLbl = this.dateClear(this.numOfDay);
  }

  async clickClearActionLogs() {
    try {
      if (parseInt(this.dateClearLbl) >= 0) {
        await lastValueFrom(this.logger.clearlog({'dateclear':this.dateClearLbl}));
        this.logMessage.display = true;
        this.logMessage.status = 'success';
        this.logMessage.message = 'Action logs clear success.';
      }
    } catch (error: any) {
      console.log(error.error);
      this.logMessage.display = true;
      this.logMessage.status = 'fail';
      this.logMessage.message = 'Unknown error! please try again.';
    }

    this.spinner = false;
  }

  openActionlogconfigDialog() {
    const dialogRef = this.dialog.open(DialogContentLogoutDialog);

    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
      if (result) {
        this.spinner = true;
        this.clickClearActionLogs();
      }
    });
  }
}

@Component({
  selector: 'actionlogconfig-dialog',
  templateUrl: './actionlogconfig-dialog.html',
  styleUrls: ['./actionlogconfig.component.scss'],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class DialogContentLogoutDialog {}
