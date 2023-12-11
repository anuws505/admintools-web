import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthenService } from '../../shared/authen/authen.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  userData: any = { nameID: '', userName: 'visitors', email: '', sessionIndex: '', role: 'guests' };

  constructor(
    private title: Title,
    private authenService: AuthenService
  ) {
    this.title.setTitle('Home - LEGO Admintools');
  }

  ngOnInit() {
    this.getUserData();
  }

  getUserData() {
    if (this.authenService.loggedIn()) {
      this.userData = this.authenService.getUserLoginData();
    }
  }
}
