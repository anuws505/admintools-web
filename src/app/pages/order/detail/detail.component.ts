import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { OrderService } from '../order.service';

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

  constructor(
    private title: Title,
    private activeroute: ActivatedRoute,
    private orderService: OrderService
  ) {
    this.title.setTitle('Order Detail - LEGO Admintools');
  }

  ngOnInit() {
    this.activeroute.params.subscribe((event) => {
      if (event['orderno'] && event['orderno'] !== undefined) {
        this.orderRouteData.orderNo = event['orderno'].trim();
      }
      if (event['progress'] && event['progress'] !== undefined) {
        this.orderRouteData.orderProgress = event['progress'].trim().toLowerCase();
      } else {
        this.orderRouteData.orderProgress = 'order_list';
      }

      const req = {
        transactionID: this.orderService.getTransactionID(),
        orderNo: this.orderRouteData.orderNo
      };
      this.getOrderDetail(req);
    });
  }

  async getOrderDetail(request: any) {
    try {
      const data = await lastValueFrom(this.orderService.getExOrderDetail(request));
      if (data.resultCode && data.resultCode === '20000') {
        console.log(data);
        // if (data.result && data.result.data.length > 0) {
        if (undefined !== data.result) {
          // order data origin
          this.orderData = data.result;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}
