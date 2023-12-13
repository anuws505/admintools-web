import { Component, HostListener } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthenService } from './shared/authen/authen.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  activeNavbar: any = '';
  innerWidth: any;
  userData: any = { nameID: '', userName: 'visitors', email: '', sessionIndex: '', role: 'guests' };
  loggedin: boolean = this.authenService.loggedIn();

  constructor(
    private title: Title,
    private authenService: AuthenService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.title.setTitle('App - LEGO Admintools');
  }

  activeClass() {
    if (this.loggedin) {
      if (this.activeNavbar == '') { this.activeNavbar = 'active'; }
      else if (this.activeNavbar == 'active') { this.activeNavbar = ''; }
    }
  }

  ngOnInit() {
    if (this.loggedin) {
      this.innerWidth = window.innerWidth;
      this.setActiveByWidth();
      this.userData = this.authenService.getUserLoginData();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (this.loggedin) {
      this.innerWidth = window.innerWidth;
      this.setActiveByWidth();
    }
  }

  setActiveByWidth() {
    if (this.innerWidth >= 768) {
      this.activeNavbar = 'active';
    } else {
      this.activeNavbar = '';
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogContentLogoutDialog);

    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
      if (result) {
        this.router.navigate(['/logout']);
      }
    });
  }
}

@Component({
  selector: 'app-logout-dialog',
  templateUrl: './app-logout-dialog.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class DialogContentLogoutDialog {}
