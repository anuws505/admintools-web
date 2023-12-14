import { Component } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../order.service';
import { lastValueFrom } from 'rxjs';
import { JsonEditorOptions } from 'ang-jsoneditor';
import { environment } from '../../../../environments/environment';
import { AuthenService } from '../../../shared/authen/authen.service';
import { LogService } from '../../../shared/log.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-statusupdate',
  templateUrl: './statusupdate.component.html',
  styleUrls: ['./statusupdate.component.scss']
})
export class StatusupdateComponent {
  orderRouteData: any = {
    orderNo: '',
  };
  orderData: any = {};

  jsonOrderStatusRequest: JsonEditorOptions = new JsonEditorOptions;
  jsonDataToDisplay: any = {};
  jsonDataDoAction: any = {};

  jsonOrderStatusResponse: JsonEditorOptions = new JsonEditorOptions;
  jsonResponseToDisplay: any = {
    display: 'N',
    title: '',
    colorcode: '',
    result: {}
  };
  updateOrderStatusButton: boolean = true;

  private DISP_API_BE = environment.disp_api_be;

  apiName: any = '';
  apiNameDisp: any = [];
  statusCode: any = '';
  statusCodeDisp: any = [];
  statusMsg: any = '';
  statusMsgDisp: any = [];

  spinner: boolean = false;

  constructor(
    private title: Title,
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    private authenService: AuthenService,
    private logger: LogService,
    private dialog: MatDialog
  ) {
    this.title.setTitle('Order Status Update - LEGO Admintools');
  }

  // initial and prepare data
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((event) => {
      if (event['orderno'] && typeof event['orderno'] != 'undefined') {
        this.orderRouteData.orderNo = event['orderno'].trim();
      }

      const req = {
        transactionID: this.orderService.getTransactionID(),
        orderNo: this.orderRouteData.orderNo
      };

      this.spinner = true;
      this.getOrderDetail(req);
    });

    this.jsonOrderStatusRequest.mode = 'tree';
    this.jsonOrderStatusRequest.mainMenuBar = true;
    this.jsonOrderStatusRequest.navigationBar = true;
    this.jsonOrderStatusRequest.statusBar = true;
    this.jsonOrderStatusRequest.expandAll = true;

    this.jsonOrderStatusResponse.mode = 'view';
    this.jsonOrderStatusResponse.expandAll = true;

    // set dropdown display data
    this.apiNameDisp.push({'apiname':'updateOrderStatus','apipath':this.DISP_API_BE + '/be-updateorderstatus/action/updateOrderStatus'});
    this.apiNameDisp.push({'apiname':'getOrderStatusUpdate','apipath':this.DISP_API_BE + '/be/getorderstatusupdate/action/getOrderStatusUpdate'});
    this.apiNameDisp.push({'apiname':'shipment_status','apipath':this.DISP_API_BE + '/be/shipmentstatus/action/shipment_status'});

    this.statusCodeDisp.push({'code':'02','value':'02'});
    this.statusCodeDisp.push({'code':'03','value':'03'});
    this.statusCodeDisp.push({'code':'06','value':'06'});
    this.statusCodeDisp.push({'code':'09','value':'09'});

    this.statusMsgDisp.push({'msgcode':'Customer Received','msgtext':'Customer Received'});
    this.statusMsgDisp.push({'msgcode':'Order Complete','msgtext':'Order Complete'});
    this.statusMsgDisp.push({'msgcode':'Canceled','msgtext':'Canceled'});
    this.statusMsgDisp.push({'msgcode':'Waiting Delivery','msgtext':'Waiting Delivery'});
  }

  // get order data
  async getOrderDetail(request: any) {
    try {
      const data = await lastValueFrom(this.orderService.getOrderDetail(request));
      if (data.resultCode && Number(data.resultCode) == 20000) {
        if (data.result && typeof data.result != 'undefined') {
          this.orderData = data.result;
        }
      }
    } catch (error: any) {
      console.log(error.error);
    }

    this.spinner = false;
  }

  changeJsonOrderStatusData($event: any): any {
    this.jsonDataDoAction = $event;
  }

  // click edit order status button
  async doSendStatusOrder() {
    this.spinner = true;
    console.log(this.apiName);
    console.log(this.statusCode);
    console.log(this.statusMsg);

    try {
      if (this.apiName.toUpperCase() === 'UPDATEORDERSTATUS' && this.statusCode !== '' && this.jsonDataDoAction) {
        const data = await lastValueFrom(this.orderService.callUpdateOrderStatus(this.jsonDataDoAction));

        // writelog to db
        const logData: any = {};
        logData.progressName = this.apiName;
        logData.requestData = this.jsonDataDoAction;
        logData.responseData = data;
        logData.username = this.authenService.getUserLoginData();
        this.logger.log('DO ACTION : UPDATEORDERSTATUS', logData);

        // prepare response data
        this.jsonResponseToDisplay.display = 'Y';

        if (data.resultCode && typeof data.resultCode != 'undefined' && Number(data.resultCode) == 20000) {
          this.jsonResponseToDisplay.title = 'Update Order Status: Success';
          this.jsonResponseToDisplay.colorcode = 'success';
          this.jsonResponseToDisplay.result = data;
          this.updateOrderStatusButton = false;
        } else {
          this.jsonResponseToDisplay.title = 'Update Order Status: Error';
          this.jsonResponseToDisplay.colorcode = 'error';
          this.jsonResponseToDisplay.result = data;
          this.updateOrderStatusButton = true;
        }
      }
      else if (this.apiName.toUpperCase() === 'GETORDERSTATUSUPDATE' && this.statusMsg !== '' && this.jsonDataDoAction) {
        const data = await lastValueFrom(this.orderService.callGetOrderStatusUpdate(this.jsonDataDoAction));

        // writelog to db
        const logData: any = {};
        logData.progressName = this.apiName;
        logData.requestData = this.jsonDataDoAction;
        logData.responseData = data;
        logData.username = this.authenService.getUserLoginData();
        this.logger.log('DO ACTION : GETORDERSTATUSUPDATE', logData);

        // prepare response data
        this.jsonResponseToDisplay.display = 'Y';

        if (data.resultCode && typeof data.resultCode != 'undefined' && Number(data.resultCode) == 20000) {
          this.jsonResponseToDisplay.title = 'Update Order Status: Success';
          this.jsonResponseToDisplay.colorcode = 'success';
          this.jsonResponseToDisplay.result = data;
          this.updateOrderStatusButton = false;
        } else {
          this.jsonResponseToDisplay.title = 'Update Order Status: Error';
          this.jsonResponseToDisplay.colorcode = 'error';
          this.jsonResponseToDisplay.result = data;
          this.updateOrderStatusButton = true;
        }
      }
      else if (this.apiName.toUpperCase() === 'SHIPMENT_STATUS' && this.statusCode === '' && this.statusMsg === '' && this.jsonDataDoAction) {
        const data = await lastValueFrom(this.orderService.callShipmentStatus(this.jsonDataDoAction));

        // writelog to db
        const logData: any = {};
        logData.progressName = this.apiName;
        logData.requestData = this.jsonDataDoAction;
        logData.responseData = data;
        logData.username = this.authenService.getUserLoginData();
        this.logger.log('DO ACTION : SHIPMENT_STATUS', logData);

        // prepare response data
        this.jsonResponseToDisplay.display = 'Y';

        if (data.resultCode && typeof data.resultCode != 'undefined' && Number(data.resultCode) == 20000) {
          this.jsonResponseToDisplay.title = 'Update Order Status: Success';
          this.jsonResponseToDisplay.colorcode = 'success';
          this.jsonResponseToDisplay.result = data;
          this.updateOrderStatusButton = false;
        } else {
          this.jsonResponseToDisplay.title = 'Update Order Status: Error';
          this.jsonResponseToDisplay.colorcode = 'error';
          this.jsonResponseToDisplay.result = data;
          this.updateOrderStatusButton = true;
        }
      }
      else {
        this.apiName = '';
        this.statusCode = '';
        this.statusMsg = '';
        this.jsonDataDoAction = {};

        this.jsonResponseToDisplay.display = 'Y';
        this.jsonResponseToDisplay.title = 'Update Order Status: Error';
        this.jsonResponseToDisplay.colorcode = 'error';
        this.jsonResponseToDisplay.result = {'error':'Incorrect API name or request data.'};
        this.updateOrderStatusButton = true;
      }

    } catch (error: any) {
      console.log(error.error);
      this.apiName = '';
      this.statusCode = '';
      this.statusMsg = '';
      this.jsonDataDoAction = {};

      this.jsonResponseToDisplay.display = 'Y';
      this.jsonResponseToDisplay.title = 'Update Order Status: Error';
      this.jsonResponseToDisplay.colorcode = 'error';
      this.jsonResponseToDisplay.result = error;
      this.updateOrderStatusButton = true;
    }

    this.spinner = false;
  }

  // set dropdown api name
  setApiName($event: any) {
    console.log($event);
    this.updateOrderStatusButton = true;
    this.jsonDataToDisplay = {};
    this.jsonDataDoAction = this.jsonDataToDisplay;

    this.apiName = '';
    this.statusCode = '';
    this.statusMsg = '';

    if (typeof $event != 'undefined') {
      this.apiName = $event;

      if (this.apiName.toUpperCase() == 'SHIPMENT_STATUS') {
        let obj: any = {};
        obj.transactionID = this.orderData.transaction_id;
        obj.channelOrderNo = '';
        obj.trackingNo = '';

        obj.statusTMS = {};
        if (this.orderData.progress?.get_tracking?.response?.result) {
          let thisObj: any = this.orderData.progress.get_tracking.response.result;
          obj.channelOrderNo = thisObj.channelOrderNo;
          obj.trackingNo = thisObj.trackingNo;

          let oData: any = {};
          oData.forwarderName = thisObj.forwarderName;
          oData.statusName = thisObj.message;
          oData.statusDate = this.orderData.order_date;
          oData.messageEN = thisObj.message;
          oData.messageTH = thisObj.message;

          obj.statusTMS = oData;
        }

        this.jsonDataToDisplay = obj;
        this.jsonDataDoAction = this.jsonDataToDisplay;
      }
    }
  }

  // set request data for edit or update order status
  setStatusCode($event: any) {
    this.updateOrderStatusButton = true;
    this.statusMsg = '';

    if (typeof $event != 'undefined') {
      this.statusCode = $event;

      switch (this.statusCode) {
        case '02':
          this.getStatusCode02();
          break;

        case '03':
          this.getStatusCode03();
          break;

        case '06':
          this.getStatusCode06();
          break;

        case '09':
          this.getStatusCode06();
          break;

        default:
          this.jsonDataToDisplay = {};
          this.jsonDataDoAction = this.jsonDataToDisplay;
          break;
      }
    }
  }

  getStatusCode02() {
    let obj: any = {};
    obj.transactionID = this.orderData.transaction_id;
    obj.orderNo = this.orderData.order_no;
    obj.statusOrder = this.statusCode.toString();

    this.jsonDataToDisplay = obj;
    this.jsonDataDoAction = this.jsonDataToDisplay;
  }

  getStatusCode03() {
    let obj: any = {};
    obj.transactionID = this.orderData.transaction_id;
    obj.orderNo = this.orderData.order_no;
    obj.statusOrder = this.statusCode.toString();

    obj.products = [];
    if (this.orderData.data_order?.items && this.orderData.data_order.items.length > 0) {
      this.orderData.data_order.items.forEach((items: any) => {
        if (items.product_imei && items.product_imei.length > 0) {
          obj.products = items.product_imei;
        }
      });
    }

    obj.freeGoods = [];
    obj.simCard = [];
    obj.crossSelling = [];

    this.jsonDataToDisplay = obj;
    this.jsonDataDoAction = this.jsonDataToDisplay;
  }

  getStatusCode06() {
    let obj: any = {};
    obj.referChannel = this.orderData.data_order?.referChannel;
    obj.referChannelIP = this.orderData.data_order?.referChannelIP;
    obj.transactionID = this.orderData.transaction_id;

    let orderDate = this.orderData.created_at.split('T');
    obj.orderDate = orderDate[0];

    obj.orderNo = this.orderData.order_no;
    obj.statusOrder = this.statusCode.toString();

    this.jsonDataToDisplay = obj;
    this.jsonDataDoAction = this.jsonDataToDisplay;
  }

  // set order status message
  setStatusMsg($event: any) {
    this.updateOrderStatusButton = true;
    this.statusCode = '';

    if (typeof $event != 'undefined') {
      this.statusMsg = $event;

      switch (this.statusMsg.toUpperCase()) {
        case 'CUSTOMER RECEIVED':
          this.getStatusMsg01();
          break;

        case 'ORDER COMPLETE':
          this.getStatusMsg01();
          break;

        case 'CANCELED':
          this.getStatusMsg01A();
          break;

        case 'WAITING DELIVERY':
          this.getStatusMsg02();
          break;

        default:
          this.jsonDataToDisplay = {};
          this.jsonDataDoAction = this.jsonDataToDisplay;
          break;
      }
    }
  }

  getStatusMsg01() {
    let obj: any = {};
    obj.transactionID = this.orderData.transaction_id;
    obj.orderNo = this.orderData.order_no;
    obj.channel = this.orderData.data_order?.referChannel;
    obj.status = this.statusMsg.toString();

    this.jsonDataToDisplay = obj;
    this.jsonDataDoAction = this.jsonDataToDisplay;
  }

  getStatusMsg01A() {
    let obj: any = {};
    obj.transactionID = this.orderData.transaction_id;
    obj.orderNo = this.orderData.order_no;
    obj.channel = this.orderData.data_order?.referChannel;
    obj.cnNumber = '';
    if (this.orderData.progress_refund?.cancel_document?.response?.result?.cnNum
      && this.orderData.progress_refund.cancel_document.response.result.cnNum != '') {
      obj.cnNumber = this.orderData.progress_refund.cancel_document.response.result.cnNum;
    }
    obj.status = this.statusMsg.toString();

    this.jsonDataToDisplay = obj;
    this.jsonDataDoAction = this.jsonDataToDisplay;
  }

  getStatusMsg02() {
    let obj: any = {};
    obj.transactionID = this.orderData.transaction_id;
    obj.orderNo = this.orderData.order_no;
    obj.channel = this.orderData.data_order?.referChannel;
    obj.apiRequest = 'updateorderstatus';
    obj.status = this.statusMsg.toString();

    obj.products = [];
    if (this.orderData.data_order?.items && this.orderData.data_order.items.length > 0) {
      this.orderData.data_order.items.forEach((items: any) => {
        if (items.product_imei && items.product_imei.length > 0) {
          obj.products = items.product_imei;
        }
      });
    }

    this.jsonDataToDisplay = obj;
    this.jsonDataDoAction = this.jsonDataToDisplay;
  }

  openStatusUpdateDialog() {
    const dialogRef = this.dialog.open(DialogContentLogoutDialog);

    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
      if (result) {
        this.doSendStatusOrder();
      }
    });
  }
}

@Component({
  selector: 'status-update-dialog',
  templateUrl: './status-update-dialog.html',
  styleUrls: ['./statusupdate.component.scss'],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class DialogContentLogoutDialog {}
