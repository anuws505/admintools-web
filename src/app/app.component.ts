import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  li: any = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
  active: any = '';

  activeClass() {
    if (this.active === '') { this.active = 'active'; }
    else if (this.active === 'active') { this.active = ''; }
  }
}
