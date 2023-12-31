import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { NgJsonEditorModule } from 'ang-jsoneditor';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './pages/home/home.component';
import { PagenotfoundComponent } from './pages/pagenotfound/pagenotfound.component';
import { HttpClientModule } from '@angular/common/http';
import { OrderComponent } from './pages/order/order.component';
import { ListComponent } from './pages/order/list/list.component';
import { DetailComponent } from './pages/order/detail/detail.component';
import { ReserveComponent } from './pages/order/reserve/reserve.component';
import { AuthenComponent } from './shared/authen/authen.component';
import { LoginComponent } from './shared/authen/login/login.component';
import { LogoutComponent } from './shared/authen/logout/logout.component';
import { StatusupdateComponent } from './pages/order/statusupdate/statusupdate.component';
import { ActionlogComponent } from './pages/logger/actionlog/actionlog.component';
import { ActionlogconfigComponent } from './pages/configuration/actionlogconfig/actionlogconfig.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PagenotfoundComponent,
    OrderComponent,
    ListComponent,
    DetailComponent,
    ReserveComponent,
    AuthenComponent,
    LoginComponent,
    LogoutComponent,
    StatusupdateComponent,
    ActionlogComponent,
    ActionlogconfigComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    NgJsonEditorModule,
    MatPaginatorModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
