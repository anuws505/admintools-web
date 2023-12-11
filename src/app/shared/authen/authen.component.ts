import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-authen',
  templateUrl: './authen.component.html',
  styleUrls: ['./authen.component.scss']
})
export class AuthenComponent {
  constructor(private title: Title) {
    this.title.setTitle('Authenticate - LEGO Admintools');
  }
}
