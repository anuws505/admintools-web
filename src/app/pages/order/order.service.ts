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
  private API_BE_ACQ = environment.api_be_acq_url;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': 'bearer onlinestore'
    })
  };

  constructor(private httpClient: HttpClient) {}

  getTransactionID(): any {
    const pipe = new DatePipe('en-US');
    const myFormattedDate = pipe.transform(new Date(), 'yyyyMMddHHmmssSSS');
    return 'LGO'+myFormattedDate;
  }

  // call api from lego-be
  // const result = await lastValueFrom(this.orderService.getOrders(request));
  getOrders(request: any): Observable<any> {
    return this.httpClient.get<any>('assets/testorders.json');
    return this.httpClient.post<any>(
      this.API_BE_ADMIN + '/be/admintoolsservice/action/queryOrderByKey',
      request, this.httpOptions
    );
  }
  getOrderDetail(request: any): Observable<any> {
    return this.httpClient.get<any>('assets/testorderdetail.json');
    return this.httpClient.post<any>(
      this.API_BE_ADMIN + '/be/admintoolsservice/action/queryOrderDetail',
      request, this.httpOptions
    );
  }
  callUpdateProgress(request: any): Observable<any> {
    return this.httpClient.get<any>('assets/errornodata.json');
    return this.httpClient.post<any>(
      this.API_BE_INTRA + '/be/admintoolsservice/action/callUpdateProgress',
      request, this.httpOptions
    );
  }
  callRepairDataDB(): Observable<any> {
    return this.httpClient.get<any>('assets/errornodata.json');
    return this.httpClient.post<any>(
      this.API_BE + '/be/repairDataDb/action/repairDataDB',
      {}, this.httpOptions
    );
  }

  // export order and reserve order data
  getExportOrder(request: any): Observable<any> {
    return this.httpClient.get<any>('assets/testorders.json');
    return this.httpClient.post<any>(
      this.API_BE_ADMIN + '/be/admintoolsservice/action/getExportAnOrders',
      request, this.httpOptions
    );
  }
  getReserveOrder(request: any): Observable<any> {
    return this.httpClient.get<any>('assets/testordersreserve.json');
    return this.httpClient.post<any>(
      this.API_BE_ADMIN + '/be/admintoolsservice/action/getReserveOrder',
      request, this.httpOptions
    );
  }

  // order status update page
  callUpdateOrderStatus(request: any): Observable<any> {
    return this.httpClient.get<any>('assets/errornodata.json');
    return this.httpClient.post<any>(
      this.API_BE + '/be-updateorderstatus/action/updateOrderStatus',
      request, this.httpOptions
    );
  }
  callGetOrderStatusUpdate(request: any): Observable<any> {
    return this.httpClient.get<any>('assets/errornodata.json');
    return this.httpClient.post<any>(
      this.API_BE + '/be/getorderstatusupdate/action/getOrderStatusUpdate',
      request, this.httpOptions
    );
  }
  callShipmentStatus(request: any): Observable<any> {
    return this.httpClient.get<any>('assets/errornodata.json');
    return this.httpClient.post<any>(
      this.API_BE + '/be/shipmentstatus/action/shipment_status',
      request, this.httpOptions
    );
  }

  // order progress all action
  actionDoResendData(progressName: any, request: any): Observable<any> {
    return this.httpClient.get<any>('assets/errornodata.json');
    const progName = progressName.trim().toLowerCase();

    switch (progName) {
      case 'order_list':
        return this.httpClient.post<any>(
          this.API_BE + '/dt/createOrderList/action/createOrderList',
          request, this.httpOptions
        );
        break;

      case 'get_tracking':
        return this.httpClient.post<any>(
          this.API_BE + '/tms/getTracking/action/getTracking',
          request, this.httpOptions
        );
        break;

      case 'create_receipt':
        return this.httpClient.post<any>(
          this.API_BE + '/dt/createreceipts/action/createReceipts',
          request, this.httpOptions
        );
        break;

      case 'perso_order_multi_mobile':
        return this.httpClient.post<any>(
          this.API_BE + '/optimus/persoordermultimobile/action/persoOrderMultiMobile',
          request, this.httpOptions
        );
        break;

      case 'request_esim':
        return this.httpClient.post<any>(
          this.API_BE + '/phx-requestesim/action/requestESIM',
          request, this.httpOptions
        );
        break;

      case 'inquiry_sim':
        return this.httpClient.post<any>(
          this.API_BE + '/pgz/inquirysim/action/inquirysim',
          request, this.httpOptions
        );
        break;

      case 'preparation':
        return this.httpClient.post<any>(
          this.API_BE + '/sff-preparation/action/preParation',
          request, this.httpOptions
        );
        break;

      case 'query_transaction_hist':
        return this.httpClient.post<any>(
          this.API_BE + '/sff-querytransactionhist/action/queryTransactionHist',
          request, this.httpOptions
        );
        break;

      case 'create_contract':
        return this.httpClient.post<any>(
          this.API_BE + '/dt/createContract/action/createContract',
          request, this.httpOptions
        );
        break;

      case 'new_regis_non_mobile':
        return this.httpClient.post<any>(
          this.API_BE + '/sff/newregisnonmobile/action/newRegisNonMobile',
          request, this.httpOptions
        );
        break;

      case 'check_change_charge_type':
        return this.httpClient.post<any>(
          this.API_BE + '/sff-checkchangechargetype/action/checkChangeChargeType',
          request, this.httpOptions
        );
        break;

      case 'batch_change_charge_type':
        return this.httpClient.post<any>(
          this.API_BE + '/sff-batchchangechargetype/action/batchChangeChargeType',
          request, this.httpOptions
        );
        break;

      case 'update_create_do_flg_to_release':
        return this.httpClient.post<any>(
          this.API_BE + '/dt/updateCreateDoFlgToRelease/action/updateCreateDoFlgToRelease',
          request, this.httpOptions
        );
        break;

      case 'number_migration':
        return this.httpClient.post<any>(
          this.API_BE_ACQ + '/acq/pgz-numbermigration/action/numberMigration',
          request, this.httpOptions
        );
        break;

      case 'pre_matching':
        return this.httpClient.post<any>(
          this.API_BE_ACQ + '/acq/pgz-prematching/action/preMatching',
          request, this.httpOptions
        );
        break;

      case 'save_order':
        return this.httpClient.post<any>(
          this.API_BE + '/fbss-saveorder/action/saveOrder',
          request, this.httpOptions
        );
        break;

      case 'create_order_mnp_portin':
        return this.httpClient.post<any>(
          this.API_BE + '/sff-createorderportin/action/createOrderPortin',
          request, this.httpOptions
        );
        break;

      case 'confirm_portin_request':
        return this.httpClient.post<any>(
          this.API_BE_ACQ + '/acq/phx-confirmportinrequest/action/ConfirmPortInRequest',
          request, this.httpOptions
        );
        break;

      case 'create_new_registration':
        return this.httpClient.post<any>(
          this.API_BE + '/sff-createnewregistration/action/createNewRegistration',
          request, this.httpOptions
        );
        break;

      case 'check_order_status_by_order_no':
        return this.httpClient.post<any>(
          this.API_BE + '/sff/checkOrderStatusByOrderNo/action/checkOrderStatusByOrderNo',
          request, this.httpOptions
        );
        break;

      case 'update_contract':
        return this.httpClient.post<any>(
          this.API_BE + '/dt-createContract/action/createContract',
          request, this.httpOptions
        );
        break;

      case 'request_privilege_barcode':
        return this.httpClient.post<any>(
          this.API_BE + '/priv/requestprivilegebarcode/action/requestPrivilegeBarcode',
          request, this.httpOptions
        );
        break;

      case 'update_password_used':
        return this.httpClient.post<any>(
          this.API_BE + '/priv/updatePasswordUsed/action/updatePasswordUsed',
          request, this.httpOptions
        );
        break;

      case 'update_return_code':
        return this.httpClient.post<any>(
          this.API_BE + '/dt/updateReturnCode/action/updateReturnCode',
          request, this.httpOptions
        );
        break;

      case 'change_account_promotion':
        return this.httpClient.post<any>(
          this.API_BE + '/sff/changeAccountPromotion/action/changeAccountPromotion',
          request, this.httpOptions
        );
        break;

      case 'update_knoxguard':
        return this.httpClient.post<any>(
          this.API_BE + '/sff/handleserviceknoxguard/action/handleServiceKnoxGuard',
          request, this.httpOptions
        );
        break;

      case 'confirm_pi_new_registration':
        return this.httpClient.post<any>(
          this.API_BE_ACQ + '/acq/phx-confirmpinewregistration/action/confirmPiNewRegistration',
          request, this.httpOptions
        );
        break;

      case 'wait_active_profile':
        return this.httpClient.post<any>(
          this.API_BE + '/sff-waitactiveprofile/action/waitActiveProfile',
          request, this.httpOptions
        );
        break;

      case 'clone_acq_profile':
        return this.httpClient.post<any>(
          this.API_BE_ACQ + '/acq/sff-evamcloneacqprofile/action/EvAMCloneACQProfile',
          request, this.httpOptions
        );
        break;

      case 'pre_register_ekyc':
        return this.httpClient.post<any>(
          this.API_BE + '/sff/evompreregisterekyc/action/evOMPreRegisterEKYC',
          request, this.httpOptions
        );
        break;

      case 'create_order_change_service':
        return this.httpClient.post<any>(
          this.API_BE + '/sff-createorderchangeservice/action/createOrderChangeService',
          request, this.httpOptions
        );
        break;

      case 'confirm_change_promotion':
        return this.httpClient.post<any>(
          this.API_BE + '/sff/confirmchangepromotion/action/confirmChangePromotion',
          request, this.httpOptions
        );
        break;

      case 'migration_mobile_from_pps_to_phx':
        return this.httpClient.post<any>(
          this.API_BE + '/be/migrationmobilefromppstophxdb/action/migrationMobileFromPpsToPhxDB',
          request, this.httpOptions
        );
        break;

      case 'pre_register_ekyc_for_postpaid':
        return this.httpClient.post<any>(
          this.API_BE + '/sff/preregisterekyc/action/preRegisterEkyc',
          request, this.httpOptions
        );
        break;

      case 'document_upload':
        return this.httpClient.post<any>(
          this.API_BE_INTRA + '/mo/documentupload/action/documentUpload',
          request, this.httpOptions
        );
        break;

      case 'eapp':
        return this.httpClient.post<any>(
          this.API_BE_INTRA + '/be/generateEApplicationDB/action/generateEApplicationDB',
          request, this.httpOptions
        );
        break;

      case 'modify_promotion_and_service':
        return this.httpClient.post<any>(
          this.API_BE_INTRA + '/sky/createorder/action/createOrder',
          request, this.httpOptions
        );
        break;

      case 'monthlyfee_discount':
        return this.httpClient.post<any>(
          this.API_BE_INTRA + '/sky/createorder/action/createOrder',
          request, this.httpOptions
        );
        break;

      default:
        return this.httpClient.get<any>('assets/errornodata.json');
        break;
    }
  }
}
