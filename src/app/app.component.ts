import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  active: any = '';
  innerWidth: any;

  activeClass() {
    if (this.active === '') { this.active = 'active'; }
    else if (this.active === 'active') { this.active = ''; }
  }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.setActiveByWidth();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
    this.setActiveByWidth();
  }

  setActiveByWidth() {
    if (this.innerWidth >= 768) {
      this.active = 'active';
    } else {
      this.active = '';
    }
  }
}
