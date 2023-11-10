import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  userData: any = {};

  constructor(private title: Title) {
    this.title.setTitle('Home - LEGO Admintools');
  }

  ngOnInit() {
    this.getUserData();
  }

  getUserData() {
    this.userData.username = 'pepper';
    this.userData.name = 'Pepper';
    this.userData.role = 'admin';
  }
}
