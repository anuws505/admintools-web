import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  userData: any = {};

  ngOnInit() {
    this.getUserData();
  }

  getUserData() {
    this.userData.username = 'pepper';
    this.userData.name = 'Pepper';
    this.userData.role = 'admin';
  }
}
