import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { OrderService } from '../order.service';
import { JsonEditorOptions } from 'ang-jsoneditor';
import { LogService } from '../../../shared/log.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AuthenService } from '../../../shared/authen/authen.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent {
  orderRouteData: any = {
    orderNo: '',
    orderProgress: '',
  };
  orderData: any = {};

  editorOptions: JsonEditorOptions = new JsonEditorOptions;
  msgDisplayOptions: JsonEditorOptions = new JsonEditorOptions;
  jsonDataToDisplay: any = {};
  jsonDataDoAction: any = {};

  actionMessage: any = {
    status: '',
    title: 'title',
    message: {}
  };
  orderProgress: any = [];
  resendButton = false;

  updateProgressMessage: any = {
    display: false,
    title: 'title',
    status: 'unknown',
    statusMessage: 'Status : Unknown.',
    resultData: {}
  };
  repairDataDB: any = {
    display: false,
    title: 'title',
    status: 'unknown',
    statusMessage: 'Status : Unknown.',
    resultData:  {}
  };

  spinner: boolean = false;

  constructor(
    private title: Title,
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    private logger: LogService,
    private dialog: MatDialog,
    private authenService: AuthenService
  ) {
    this.title.setTitle('Order Detail - LEGO Admintools');
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((event) => {
      if (event['orderno'] && typeof event['orderno'] != 'undefined') {
        this.orderRouteData.orderNo = event['orderno'].trim();
      }
      if (event['progress'] && typeof event['progress'] != 'undefined') {
        this.orderRouteData.orderProgress = event['progress'].trim().toLowerCase();
      } else {
        this.orderRouteData.orderProgress = 'order_list';
      }

      const request = {
        transactionID: this.orderService.getTransactionID(),
        orderNo: this.orderRouteData.orderNo
      };

      this.spinner = true;
      this.getOrderDetail(request);
    });

    // this.editorOptions.modes = ['code', 'text', 'tree', 'view'];
    this.editorOptions.mode = 'tree';
    this.editorOptions.mainMenuBar = true;
    this.editorOptions.navigationBar = true;
    this.editorOptions.statusBar = true;

    this.msgDisplayOptions.mode = 'view';
    this.msgDisplayOptions.mainMenuBar = false;
    this.msgDisplayOptions.navigationBar = false;
    this.msgDisplayOptions.statusBar = false;
    this.msgDisplayOptions.expandAll = true;
  }

  async getOrderDetail(request: any) {
    this.updateProgressMessage.display = false;
    this.updateProgressMessage.status = 'unknown';
    this.updateProgressMessage.title = 'UpdateProgress Title';
    this.updateProgressMessage.statusMessage = 'Status : Unknown.';
    this.updateProgressMessage.resultData =  {};

    this.repairDataDB.display = false;
    this.repairDataDB.status = 'unknown';
    this.repairDataDB.title = 'RepairDB Title';
    this.repairDataDB.statusMessage = 'Status : Unknown.';
    this.repairDataDB.resultData =  {};

    try {
      const data = await lastValueFrom(this.orderService.getOrderDetail(request));
      if (data.resultCode && Number(data.resultCode) == 20000) {
        if (data.result && typeof data.result != 'undefined') {
          // order data origin
          this.orderData = data.result;

          // display progress data default by order_list progress
          if (typeof this.orderData?.progress[this.orderRouteData.orderProgress]?.request == 'undefined') {
            this.jsonDataToDisplay = this.orderData?.progress[Object.keys(data.result?.progress)[0]]?.request;
            this.orderRouteData.orderProgress = Object.keys(data.result?.progress)[0];
          } else {
            this.jsonDataToDisplay = this.orderData?.progress[this.orderRouteData.orderProgress]?.request;
          }
          // initial action data to repair
          this.jsonDataDoAction = this.jsonDataToDisplay;

          // default progress message data
          let stat = '';
          if (typeof this.orderData?.progress[this.orderRouteData.orderProgress]?.status?.status_description != 'undefined') {
            stat = this.orderData.progress[this.orderRouteData.orderProgress].status.status_description.toLowerCase();
          }

          if (typeof this.orderData?.progress[this.orderRouteData.orderProgress]?.response?.resultCode != 'undefined') {
            if (Number(this.orderData?.progress[this.orderRouteData.orderProgress]?.response?.resultCode) == 20000) {
              stat = 'success';
            } else if (Number(this.orderData?.progress[this.orderRouteData.orderProgress]?.response?.resultCode) >= 50000) {
              stat = 'fail';
            }
          }
          this.actionMessage.status = stat;
          this.actionMessage.title = 'Result Message : ('+this.orderRouteData.orderProgress+' progress).';
          if (typeof this.orderData?.progress[this.orderRouteData.orderProgress]?.response?.result != 'undefined') {
            this.actionMessage.message = this.orderData?.progress[this.orderRouteData.orderProgress]?.response?.result;
          }
          else if (typeof this.orderData?.progress[this.orderRouteData.orderProgress]?.response?.resultData != 'undefined') {
            this.actionMessage.message = this.orderData?.progress[this.orderRouteData.orderProgress]?.response?.resultData;
          }

          // because "create_contract" progress respone is [] other is {}
          if ('create_contract' == this.orderRouteData.orderProgress) {
            if (typeof this.orderData?.progress['create_contract']?.response != 'undefined') {
              if (Number(this.orderData?.progress['create_contract']?.response[0]?.resultCode) == 20000) {
                stat = 'success';
              } else if (Number(this.orderData?.progress['create_contract']?.response[0]?.resultCode >= 50000)) {
                stat = 'fail';
              }
            }
            this.actionMessage.status = stat;
            this.actionMessage.title = 'Result Message : ('+this.orderRouteData.orderProgress+' progress).';
            this.actionMessage.message = this.orderData?.progress['create_contract']?.response;
          }

          // order progress data action html-aside
          this.orderProgress = this.orderingOrderProgress(this.orderData?.progress);

          // order progress disable zone-button
          if (typeof this.orderData?.progress[this.orderRouteData.orderProgress]?.status?.status_code != 'undefined' &&
                     this.orderData?.progress[this.orderRouteData.orderProgress]?.status?.status_code == '003') {
            this.resendButton = true;
          } else {
            this.resendButton = false;
          }
        }
      }
    } catch (error) {
      console.log(error);
    }

    this.spinner = false;
  }

  orderingOrderProgress(progress: any) {
    const myArr: any = [];
    Object.keys(progress).forEach((prop: any) => {
      let actionLabel = '';
      let textclassStatus = '';

      if (typeof progress[prop]?.status?.status_code != 'undefined') {
        if ('001' == progress[prop].status.status_code) {
          actionLabel = 'waiting';
          textclassStatus = 'txt-stat-waiting';
        }
        else if ('002' == progress[prop].status.status_code) {
          actionLabel = 'in-progress';
          textclassStatus = 'txt-stat-in-progress';
        }
        else if ('003' == progress[prop].status.status_code) {
          actionLabel = 'fail';
          textclassStatus = 'txt-stat-fail';
        }
        else if ('004' == progress[prop].status.status_code) {
          textclassStatus = 'txt-stat-success';
        }
        else if ('006' == progress[prop].status.status_code) {
          actionLabel = 'auto-cancel';
          textclassStatus = 'txt-stat-auto-cancel';
        }
        else if ('007' == progress[prop].status.status_code) {
          textclassStatus = 'txt-stat-repair-success';
        }
      }

      let tmp: any = {
        actionLabel: actionLabel,
        textLabel: prop.replace(/_/g, " "),
        textClassStatus: textclassStatus,
        activeClass: ('order_list' == prop) ? 'active' : '',
        progressName: prop,
        progressApi: progress[prop].api
      };
      myArr.push(tmp);
    });

    return myArr;
  }

  getJsonData($event: any): any {
    this.jsonDataDoAction = $event;
  }

  async actionJsonResend() {
    this.spinner = true;

    let repairObj: any = {
      resultCode: '50000',
      resultMessage: 'Unknown message',
      result: {}
    };

    try {
      // 1. resend progress request data for repair the order
      const data = await lastValueFrom(this.orderService.actionDoResendData(this.orderRouteData.orderProgress, this.jsonDataDoAction));
      repairObj = data;
      // save logs data
      const logData: any = {};
      logData.progressName = this.orderRouteData.orderProgress;
      logData.requestData = this.jsonDataDoAction;
      logData.responseData = data;
      logData.username = this.authenService.getUserLoginData();
      this.logger.log('RESEND ORDER DATA', logData);

      if (data.resultCode && Number(data.resultCode) == 20000) {
        if (data.result) {
          this.actionMessage.status = 'success';
          this.actionMessage.title = 'Result Message (' + this.orderRouteData.orderProgress + ' progress).';
          this.actionMessage.message = data.result;
        }

        // when success then disable resend button
        this.resendButton = false;

        // and then modify progress label in html-aside
        for (let prog of this.orderProgress) {
          if (this.orderRouteData.orderProgress == prog.progressName) {
            prog.actionLabel = '';
            prog.textClassStatus = 'txt-stat-success';
          }
        }
      } else {
        if (data.result) {
          this.actionMessage.status = 'fail';
          this.actionMessage.title = 'Result Message (' + this.orderRouteData.orderProgress + ' progress).';
          this.actionMessage.message = data.result;
        }
      }
    } catch (error: any) {
      this.actionMessage.status = 'fail';
      this.actionMessage.title = 'Result Message (' + this.orderRouteData.orderProgress + ' progress).';
      this.actionMessage.message = error.error.toString();
    }

    try {
      // general order progress
      let updateResp: any = {
        transactionID: this.jsonDataDoAction?.transactionID,
        resultCode: repairObj.resultCode,
        resultMessage: repairObj.resultMessage,
        result: repairObj.result
      };
      // when progress is create_contract set response data is array()
      if (this.orderRouteData.orderProgress == 'create_contract') {
        updateResp = [{
          transactionID: this.jsonDataDoAction?.transactionID,
          resultCode: repairObj.resultCode,
          resultMessage: repairObj.resultMessage,
          result: repairObj.result
        }];
      }
      // prepare request update progress data
      const updateProgress = {
        transactionID: this.jsonDataDoAction?.transactionID,
        reserveId: this.orderData?.reserve_id,
        progressName: this.orderRouteData.orderProgress,
        request: this.jsonDataDoAction,
        response: updateResp
      };

      // 2. call update order progress status
      const dataUpdate = await lastValueFrom(this.orderService.callUpdateProgress(updateProgress));
      if (dataUpdate.resultCode && Number(dataUpdate.resultCode) == 20000) {
        this.updateProgressMessage.display = true;
        this.updateProgressMessage.status = 'success';
        this.updateProgressMessage.title = '=> Update progress ' + this.orderRouteData.orderProgress +' : Success.';
        this.updateProgressMessage.statusMessage = dataUpdate.resultMessage;
        this.updateProgressMessage.resultData = dataUpdate.result;
      } else {
        this.updateProgressMessage.display = true;
        this.updateProgressMessage.status = 'fail';
        this.updateProgressMessage.title = '=> Update progress ' + this.orderRouteData.orderProgress +' : Fail.';
        this.updateProgressMessage.statusMessage = dataUpdate.resultMessage;
        this.updateProgressMessage.resultData = dataUpdate.result;
      }
    } catch (error: any) {
      this.updateProgressMessage.display = true;
      this.updateProgressMessage.status = 'fail';
      this.updateProgressMessage.title = '=> Update progress ' + this.orderRouteData.orderProgress +' : Fail.';
      this.updateProgressMessage.statusMessage = error.error.toString();
      this.updateProgressMessage.resultData = {};
    }

    // 3. call repair order when order progress repair was done focus result "success" (statusCode is "20000")
    if (repairObj.resultCode && Number(repairObj.resultCode) == 20000) {
      try {
        const respRepairData = await lastValueFrom(this.orderService.callRepairDataDB());
        this.repairDataDB.display = true;
        this.repairDataDB.title = '=> Repair order : Success, Next progress (todo automatic - repairDataDB By Job).';
        this.repairDataDB.status = 'success';
        this.repairDataDB.statusMessage = 'Repair order success.';
        this.repairDataDB.resultData =  respRepairData;
      } catch (error: any) {
        this.repairDataDB.display = true;
        this.repairDataDB.title = '=> Repair order : Fail.';
        this.repairDataDB.status = 'fail';
        this.repairDataDB.statusMessage = error.error.toString();
        this.repairDataDB.resultData = {};
      }
    } else {
        this.repairDataDB.display = false;
        this.repairDataDB.title = '=> Repair order : Default.';
        this.repairDataDB.status = '';
        this.repairDataDB.statusMessage = 'Repair order default.';
        this.repairDataDB.resultData =  {};
    }

    this.spinner = false;
  }

  openResendDialog() {
    const dialogRef = this.dialog.open(DialogContentLogoutDialog);

    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
      if (result) {
        this.actionJsonResend();
      }
    });
  }
}

@Component({
  selector: 'repair-data-dialog',
  templateUrl: './repair-data-dialog.html',
  styleUrls: ['./detail.component.scss'],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class DialogContentLogoutDialog {}
