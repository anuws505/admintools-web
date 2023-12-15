import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-actionlogconfig',
  templateUrl: './actionlogconfig.component.html',
  styleUrls: ['./actionlogconfig.component.scss']
})
export class ActionlogconfigComponent {
  constructor(private title: Title) {
    this.title.setTitle('Action Logs Configuration - LEGO Admintools');
  }
}
