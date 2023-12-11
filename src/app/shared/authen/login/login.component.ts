import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AuthenService } from '../authen.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  authToken: any = '';
  displayMessage: any = '';
  userData: any = { nameID: '', userName: '', email: '', sessionIndex: '', role: '' };

  spinner: boolean = false;

  constructor(
    private title: Title,
    private activatedRoute: ActivatedRoute,
    private authenService: AuthenService
  ) {
    this.title.setTitle('Authenticate Login - LEGO Admintools');
  }

  ngOnInit() {
    this.spinner = true;

    this.activatedRoute.params.subscribe((event) => {
      if (event['authentoken'] && typeof event['authentoken'] != 'undefined') {
        this.authToken = event['authentoken'].trim();
      }

      if (this.authToken == '') {
        if (this.authenService.loggedIn()) {
          this.displayMessage = 'Logged in!';
          this.userData = this.authenService.getUserLoginData();
        } else {
          this.displayMessage = 'Logging in...';
          // this.authenService.doLogin();
          // this.doLogin();
          // this.authenService.makeLocalData();
          // window.location.href = '/login';
        }
      }
      else if (this.authToken != '') {
        this.displayMessage = 'Logging in...';
        // this.authToken = 'eyJuYW1lSUQiOiJhbnV3YXM0OSIsInVzZXJOYW1lIjoiYW51d2FzNDkiLCJlbWFpbCI6ImFudXdhdC5zQGF3YXJlLmNvLnRoIiwic2Vzc2lvbkluZGV4IjoibW9ja3VwU2Vzc2lvbkluZGV4RGF0YSIsInJvbGUiOiJhZG1pbjEyMyJ9';
        const base64regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
        if (base64regex.test(this.authToken)) {
          this.authenService.setUserLoginData(this.authToken);
          window.location.href = '/login';
        } else {
          this.displayMessage = 'Login fail, please try to login again.';
          this.authenService.removeUserLoginData();
        }
      } else {
        this.displayMessage = 'Unknown error, please try to login again.';
        this.authenService.removeUserLoginData();
      }
    });

    this.spinner = false;
  }

  async doLogin() {
    const result = await this.authenService.authenLogin();
    result.subscribe((data: any) => {
      if (data && typeof data.url != 'undefined') {
        window.location.href = data.url;
      }
    });
  }
}
