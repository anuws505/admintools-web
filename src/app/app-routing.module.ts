import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PagenotfoundComponent } from './pages/pagenotfound/pagenotfound.component';
import { OrderComponent } from './pages/order/order.component';
import { ListComponent } from './pages/order/list/list.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'order', component: OrderComponent,
    children: [
      { path: '', component: ListComponent },
      // { path: 'status/:orderno', component: StatusComponent },
      { path: ':orderno', component: ListComponent },
      // { path: ':orderno/:progress', component: OrderdetailComponent }
    ]
  },
  { path: '**', component: PagenotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
