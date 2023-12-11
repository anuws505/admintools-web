import { Component, HostListener } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthenService } from './shared/authen/authen.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  activeNavbar: any = '';
  innerWidth: any;
  userData: any = { nameID: '', userName: 'visitors', email: '', sessionIndex: '', role: 'guests' };

  constructor(
    private title: Title,
    private authenService: AuthenService,
    public dialog: MatDialog
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

    if (this.authenService.loggedIn()) {
      this.userData = this.authenService.getUserLoginData();
    }
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

  openDialog() {
    const dialogRef = this.dialog.open(DialogContentLogoutDialog);

    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
      if (result) {
        window.location.href = '/logout';
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
