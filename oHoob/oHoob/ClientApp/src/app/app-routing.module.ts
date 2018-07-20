// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from "./components/login/login.component";
import { HomeComponent } from "./components/home/home.component";
import { CustomersComponent } from "./components/customers/customers.component";
import { ProductsComponent } from "./components/products/products.component";
import { OrdersComponent } from "./components/orders/orders.component";
import { SettingsComponent } from "./components/settings/settings.component";

import { NotFoundComponent } from "./components/not-found/not-found.component";
import { AuthService } from './services/auth.service';
import { AuthGuard } from './services/auth-guard.service';
import { LayoutComponent } from './layout/layout.component';
import { PublicComponent } from './layout/public.component';
import { AboutComponent } from './public/about/about.component';


const routes: Routes = [
  {
    path: "", component: PublicComponent, children: [
      { path: "", component: HomeComponent },
      
    ]
  },

  {
    path: "", component: LayoutComponent, canActivate: [AuthGuard], data: { title: "Home" }, children: [
      { path: "about", component: AboutComponent, data: { title: "About Us" } },
      { path: "app/customers", component: CustomersComponent, canActivate: [AuthGuard], data: { title: "Customers" } },
      { path: "app/products", component: ProductsComponent, canActivate: [AuthGuard], data: { title: "Products" } },
      { path: "app/orders", component: OrdersComponent, canActivate: [AuthGuard], data: { title: "Orders" } },
      { path: "app/settings", component: SettingsComponent, canActivate: [AuthGuard], data: { title: "Settings" } },
    ]
  },

  { path: "login", component: LoginComponent, data: { title: "Login" } },
  { path: "home", redirectTo: "/", pathMatch: "full" },
  { path: "**", component: NotFoundComponent, data: { title: "Page Not Found" } }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthService, AuthGuard]
})
export class AppRoutingModule { }
