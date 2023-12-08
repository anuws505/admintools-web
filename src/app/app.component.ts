import { Component, HostListener } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  activeNavbar: any = '';
  innerWidth: any;

  constructor(
    private title: Title
  ) {
    this.title.setTitle('App - LEGO Admintools');
  }

  activeClass() {
    if (this.activeNavbar === '') { this.activeNavbar = 'active'; }
    else if (this.activeNavbar === 'active') { this.activeNavbar = ''; }
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
      this.activeNavbar = 'active';
    } else {
      this.activeNavbar = '';
    }
  }
}
