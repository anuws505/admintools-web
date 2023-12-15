import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PagenotfoundComponent } from './pages/pagenotfound/pagenotfound.component';
import { OrderComponent } from './pages/order/order.component';
import { ListComponent } from './pages/order/list/list.component';
import { DetailComponent } from './pages/order/detail/detail.component';
import { ReserveComponent } from './pages/order/reserve/reserve.component';
import { AuthenComponent } from './shared/authen/authen.component';
import { LoginComponent } from './shared/authen/login/login.component';
import { LogoutComponent } from './shared/authen/logout/logout.component';
import { StatusupdateComponent } from './pages/order/statusupdate/statusupdate.component';
import { authGuard } from './shared/authen/auth.guard';
import { ActionlogComponent } from './pages/logger/actionlog/actionlog.component';
import { ActionlogconfigComponent } from './pages/configuration/actionlogconfig/actionlogconfig.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'order', component: OrderComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: ListComponent },
      { path: 'reserve', component: ReserveComponent },
      { path: ':orderno', component: DetailComponent },
      { path: ':orderno/:progress', component: DetailComponent }
    ],
    canActivate: [authGuard]
  },
  {
    path: 'orderstatusupdate/:orderno', component: StatusupdateComponent,
    canActivate: [authGuard]
  },
  {
    path: 'logger/actionlog', component: ActionlogComponent,
    canActivate: [authGuard]
  },
  {
    path: 'configuration/actionlog', component: ActionlogconfigComponent,
    canActivate: [authGuard]
  },
  {
    path: 'login', component: AuthenComponent,
    children: [
      { path: '', component: LoginComponent },
      { path: ':authentoken', component: LoginComponent }
    ]
  },
  {
    path: 'logout', component: AuthenComponent,
    children: [
      { path: '', component: LogoutComponent },
      { path: ':authentoken', component: LogoutComponent }
    ],
    canActivate: [authGuard]
  },
  { path: '**', component: PagenotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
