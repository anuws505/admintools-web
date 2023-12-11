import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenService {
  private API_AUTHEN = environment.api_authen_url;
  private SAML_DESTINATION = environment.saml_destination;
  private SAML_ASSERTION_URL = environment.saml_assertion_url;
  private SAML_ISSUER = environment.saml_issuer;
  private ADMIN_USER = environment.admin_user;

  constructor(private httpClient: HttpClient) {}

  // authen login
  async doLogin() {
    let samlStr = await lastValueFrom(this.getLoginXML());

    if (samlStr) {
      let xmldata = this.xmlReplacement();
      samlStr = samlStr.replace('UNIQUEID', xmldata.uniqueid);
      samlStr = samlStr.replace('ISSUEINSTANT_LOCALTIME', xmldata.issueinstant);
      samlStr = samlStr.replace('SAML_DESTINATION', this.SAML_DESTINATION);
      samlStr = samlStr.replace('SAML_ASSERTION_URL', this.SAML_ASSERTION_URL);
      samlStr = samlStr.replace('SAML_ISSUER', this.SAML_ISSUER);
    }

    let form = document.createElement('form');
    form.method = 'POST';
    form.acceptCharset = 'UTF-8';
    form.action = this.SAML_DESTINATION;

    let value = btoa(samlStr.trim());
    let samlInput = document.createElement('input');
    samlInput.type = 'hidden';
    samlInput.name = 'SAMLRequest';
    samlInput.value = value;
    form.appendChild(samlInput);

    document.body.appendChild(form);
    form.submit();
  }


  async authenLogin() {
    let samlStr = await lastValueFrom(this.getLoginXML());

    if (samlStr) {
      let xmldata = this.xmlReplacement();
      samlStr = samlStr.replace('UNIQUEID', xmldata.uniqueid);
      samlStr = samlStr.replace('ISSUEINSTANT_LOCALTIME', xmldata.issueinstant);
      samlStr = samlStr.replace('SAML_DESTINATION', this.SAML_DESTINATION);
      samlStr = samlStr.replace('SAML_ASSERTION_URL', this.SAML_ASSERTION_URL);
      samlStr = samlStr.replace('SAML_ISSUER', this.SAML_ISSUER);
    }

    let body = new URLSearchParams();
    body.set('SAMLRequest', btoa(samlStr.trim()));
    // let body = `SAMLRequest=${btoa(samlStr).trim()}`;

    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
    };

    return this.httpClient.post(this.API_AUTHEN + '/action/login', body.toString(), options);
  }

  getLoginXML(): Observable<any> {
    return this.httpClient.get('assets/provider-login.xml', { responseType: 'text' });
  }

  xmlReplacement(): any {
    const dateNow: Date = new Date();
    const pipe = new DatePipe('en-US');
    const myFormattedDate = pipe.transform(dateNow, 'yyyyMMddHHmmssSSS');

    let issueinstant = pipe.transform(dateNow, 'yyyy-MM-dd');
    issueinstant += 'T'+pipe.transform(dateNow, 'HH:mm:ss')+'Z';

    return { 'uniqueid': 'LGO'+myFormattedDate, 'issueinstant': issueinstant };
  }


  // authen logout
  async doLogout() {
    let samlStr = await lastValueFrom(this.getLogoutXML());

    if (samlStr && this.loggedIn()) {
      let userData = this.getUserLoginData();
      samlStr = samlStr.replace('SAML_DESTINATION', this.SAML_DESTINATION);
      samlStr = samlStr.replace('SAML_ISSUER', this.SAML_ISSUER);
      samlStr = samlStr.replace('SAML_NAME_ID_LOGIN', userData.nameID);
      samlStr = samlStr.replace('SAML_SESSION_INDEX', userData.sessionIndex);
    }

    let form = document.createElement('form');
    form.method = 'POST';
    form.acceptCharset = 'UTF-8';
    form.action = this.SAML_DESTINATION;

    let value = btoa(samlStr.trim());
    let samlInput = document.createElement('input');
    samlInput.type = 'hidden';
    samlInput.name = 'SAMLRequest';
    samlInput.value = value;
    form.appendChild(samlInput);

    document.body.appendChild(form);
    form.submit();
  }


  async authenLogout() {
    let samlStr = await lastValueFrom(this.getLogoutXML());

    if (samlStr && this.loggedIn()) {
      let userData = this.getUserLoginData();
      samlStr = samlStr.replace('SAML_DESTINATION', this.SAML_DESTINATION);
      samlStr = samlStr.replace('SAML_ISSUER', this.SAML_ISSUER);
      samlStr = samlStr.replace('SAML_NAME_ID_LOGIN', userData.nameID);
      samlStr = samlStr.replace('SAML_SESSION_INDEX', userData.sessionIndex);
    }

    let body = new URLSearchParams();
    body.set('SAMLRequest', btoa(samlStr.trim()));
    // let body = `SAMLRequest=${btoa(samlStr).trim()}`;

    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
    };

    return this.httpClient.post(this.API_AUTHEN + '/action/logout', body.toString(), options);
  }

  getLogoutXML(): Observable<any> {
    return this.httpClient.get('assets/provider-logout.xml', { responseType: 'text' });
  }


  // helper login data
  haveLocalStorage() {
    return !!localStorage.getItem(btoa(this.ADMIN_USER));
  }

  getUserLoginData() {
    const userData: any = { nameID: '', userName: '', email: '', sessionIndex: '', role: '' };

    if (this.haveLocalStorage()) {
      const localStoreData: any = localStorage.getItem(btoa(this.ADMIN_USER));
      const base64regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
      if (base64regex.test(localStoreData)) {
        const json = JSON.parse(atob(localStoreData));
        userData.nameID = json.nameID;
        userData.userName = json.userName;
        userData.email = json.email;
        userData.sessionIndex = json.sessionIndex;
        userData.role = json.role;
      }
    }

    return userData;
  }

  loggedIn() {
    let loggedIn = false;
    if (this.haveLocalStorage()) {
      const data = this.getUserLoginData();
      if (data.userName != '') {
        loggedIn = true;
      }
    }
    return loggedIn;
  }

  setUserLoginData(userData: any) {
    localStorage.setItem(btoa(this.ADMIN_USER), userData);
  }

  removeUserLoginData() {
    localStorage.removeItem(btoa(this.ADMIN_USER));
  }

  makeLocalData() {
    const userData: any = {
      nameID: 'anuwas49',
      userName: 'anuwas49',
      email: 'anuwat.s@aware.co.th',
      sessionIndex: 'mockupSessionIndexData',
      role: 'admin123'
    };
    localStorage.setItem(btoa(this.ADMIN_USER), btoa(JSON.stringify(userData)));
    let data: any = localStorage.getItem(btoa(this.ADMIN_USER));
    console.log(atob(data));
  }
}
