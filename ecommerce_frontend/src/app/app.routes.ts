import { Routes } from '@angular/router';
import { HomeComponent } from './components/landingpage/home/home.component';
import { LoginComponent } from './components/Authentication/login/login.component';
import { RegisterComponent } from './components/Authentication/register/register.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { AddProductComponent } from './components/admin/productmanagement/add-product/add-product.component';
import { ViewproductlistComponent } from './components/admin/productmanagement/viewproductlist/viewproductlist.component';
import { UserdashboardComponent } from './components/users/userdashboard/userdashboard.component';
import { UserlistComponent } from './components/admin/userlist/userlist.component';
import { CartlistComponent } from './components/users/cartlist/cartlist.component';
import { ForgotpasswordComponent } from './components/Authentication/forgotpassword/forgotpassword.component';
import { OrderhistoryComponent } from './components/users/orderhistory/orderhistory.component';


export const routes: Routes = [

    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'login',
        component: LoginComponent

    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard],
        children: [
           
            { path: 'viewproductlist', component: ViewproductlistComponent },
            { path: 'edit-product/:id', component: AddProductComponent },
            { path: 'userlist', component: UserlistComponent },
            { path:'orderhistory', component:OrderhistoryComponent
            },
            // Default sub-route when you just visit /admin
            { path: '', redirectTo: 'viewproductlist', pathMatch: 'full' } 
        ]
    },
    {
        path: 'add-product',
        component: AddProductComponent,
        canActivate: [authGuard]
    },
    
    
   /* {
        path:'viewproductlist',
        component:ViewproductlistComponent,
        canActivate: [authGuard]
    },
     {
        path:'userlist',
        component:UserlistComponent
    },
    {
        path:'orderhistory',
        component:OrderhistoryComponent,
         canActivate: [authGuard]
    },*/

    {
        path:'userdashboard',
        component:UserdashboardComponent,
        canActivate: [authGuard]
    },
     {
        path: 'edit-product/:id', // Optional: Add route for editing product
        component: AddProductComponent,
        canActivate: [authGuard]
    },
  
     {
        path:'forgot-password',
        component:ForgotpasswordComponent
    },
    {
        path:'cartlist',
        component:CartlistComponent,
         canActivate: [authGuard]
    },
    
    {
        path: '**', // Wildcard route for 404 - Page Not Found
        redirectTo: 'home'
    }
    

];
