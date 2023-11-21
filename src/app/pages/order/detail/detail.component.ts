import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { OrderService } from '../order.service';
import { JsonEditorOptions } from 'ang-jsoneditor';

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

  constructor(
    private title: Title,
    private activeroute: ActivatedRoute,
    private orderService: OrderService
  ) {
    this.title.setTitle('Order Detail - LEGO Admintools');
  }

  ngOnInit() {
    this.activeroute.params.subscribe((event) => {
      if (event['orderno'] && typeof(event['orderno']) !== 'undefined') {
        this.orderRouteData.orderNo = event['orderno'].trim();
      }
      if (event['progress'] && typeof(event['progress']) !== 'undefined') {
        this.orderRouteData.orderProgress = event['progress'].trim().toLowerCase();
      } else {
        this.orderRouteData.orderProgress = 'order_list';
      }

      const request = {
        transactionID: this.orderService.getTransactionID(),
        orderNo: this.orderRouteData.orderNo
      };
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
    try {
      const data = await lastValueFrom(this.orderService.getOrderDetailExample(request));
      if (data.resultCode && data.resultCode === '20000') {
        if (data.result && data.result !== undefined) {
          // order data origin
          this.orderData = data.result;

          // display progress data default by order_list progress
          if (typeof(this.orderData?.progress[this.orderRouteData.orderProgress]?.request) === 'undefined') {
            this.jsonDataToDisplay = this.orderData?.progress[Object.keys(data.result?.progress)[0]]?.request;
            this.orderRouteData.orderProgress = Object.keys(data.result?.progress)[0];
          } else {
            this.jsonDataToDisplay = this.orderData?.progress[this.orderRouteData.orderProgress]?.request;
          }
          // initial action data to repair
          this.jsonDataDoAction = this.jsonDataToDisplay;

          // default progress message data
          let stat = '';
          if (undefined !== this.orderData?.progress[this.orderRouteData.orderProgress]?.response?.resultCode) {
            if (20000 === Number(this.orderData?.progress[this.orderRouteData.orderProgress]?.response?.resultCode)) {
              stat = 'success';
            } else if (50000 <= Number(this.orderData?.progress[this.orderRouteData.orderProgress]?.response?.resultCode)) {
              stat = 'fail';
            }
          }
          this.actionMessage.status = stat;
          this.actionMessage.title = 'Result Message : ('+this.orderRouteData.orderProgress+' progress)';
          if (typeof(this.orderData?.progress[this.orderRouteData.orderProgress]?.response?.result) !== 'undefined') {
            this.actionMessage.message = this.orderData?.progress[this.orderRouteData.orderProgress]?.response?.result;
          }
          else if (typeof(this.orderData?.progress[this.orderRouteData.orderProgress]?.response?.resultData) !== 'undefined') {
            this.actionMessage.message = this.orderData?.progress[this.orderRouteData.orderProgress]?.response?.resultData;
          }

          // because "create_contract" progress respone is [] other is {}
          if ('create_contract' === this.orderRouteData.orderProgress) {
            let stat = '';
            if (undefined !== this.orderData?.progress['create_contract']?.response) {
              if (20000 === Number(this.orderData?.progress['create_contract']?.response[0]?.resultCode)) {
                stat = 'success';
              } else if (50000 <= Number(this.orderData?.progress['create_contract']?.response[0]?.resultCode)) {
                stat = 'fail';
              }
            }
            this.actionMessage.status = stat;
            this.actionMessage.title = 'Result Message : ('+this.orderRouteData.orderProgress+' progress)';
            this.actionMessage.message = this.orderData?.progress['create_contract']?.response;
          }

          // order progress data action html-aside
          this.orderProgress = this.orderingOrderProgress(this.orderData?.progress);

          // order progress disable zone-button
          if (undefined !== this.orderData?.progress[this.orderRouteData.orderProgress]?.status?.status_code &&
                  '003' === this.orderData?.progress[this.orderRouteData.orderProgress]?.status?.status_code) {
            this.resendButton = true;
          } else {
            this.resendButton = false;
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  orderingOrderProgress(progress: any) {
    const myArr: any = [];
    Object.keys(progress).forEach((prop: any) => {
      let actionLabel = '';
      let textclassStatus = '';

      if (undefined !== progress[prop]?.status?.status_code) {
        if ('001' === progress[prop].status.status_code) {
          actionLabel = 'waiting';
          textclassStatus = 'txt-stat-waiting';
        }
        else if ('002' === progress[prop].status.status_code) {
          actionLabel = 'in-progress';
          textclassStatus = 'txt-stat-in-progress';
        }
        else if ('003' === progress[prop].status.status_code) {
          actionLabel = 'fail';
          textclassStatus = 'txt-stat-fail';
        }
        else if ('004' === progress[prop].status.status_code) {
          textclassStatus = 'txt-stat-success';
        }
        else if ('006' === progress[prop].status.status_code) {
          actionLabel = 'auto-cancel';
          textclassStatus = 'txt-stat-auto-cancel';
        }
        else if ('007' === progress[prop].status.status_code) {
          textclassStatus = 'txt-stat-repair-success';
        }
      }

      let tmp: any = {
        actionLabel: actionLabel,
        textLabel: prop.replace(/_/g, " "),
        textClassStatus: textclassStatus,
        activeClass: ('order_list' === prop) ? 'active' : '',
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
    let repairObj: any = {
      resultCode: '50000',
      resultMessage: 'Unknown message',
      result: {}
    };
    console.log(repairObj);
    console.log(this.jsonDataDoAction);
  }
}
