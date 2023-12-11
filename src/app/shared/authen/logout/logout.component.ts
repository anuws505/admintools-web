import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthenService } from '../authen.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {
  authToken: any = '';
  displayMessage: any = '';

  spinner: boolean = false;

  constructor(
    private title: Title,
    private authenService: AuthenService
  ) {
    this.title.setTitle('Authenticate Logout - LEGO Admintools');
  }

  ngOnInit() {
    this.spinner = true;

    if (this.authenService.loggedIn()) {
      this.displayMessage = 'Logging out...';
      this.authenService.doLogout();
      // this.doLogout();
      this.authenService.removeUserLoginData();
    } else {
      this.displayMessage = 'You are logged out!';
      this.authenService.removeUserLoginData();
    }

    this.spinner = false;
  }

  async doLogout() {
    const result = await this.authenService.authenLogout();
    result.subscribe((data: any) => {
      if (data && typeof data.url != 'undefined') {
        window.location.href = data.url;
      }
    });
  }
}
