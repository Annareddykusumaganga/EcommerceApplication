import { Component} from '@angular/core';

import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ViewproductlistComponent } from '../productmanagement/viewproductlist/viewproductlist.component';
import { UserlistComponent } from '../userlist/userlist.component';
import { OrderhistoryComponent } from '../../users/orderhistory/orderhistory.component';



@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ReactiveFormsModule, ViewproductlistComponent, UserlistComponent,OrderhistoryComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
 searchControl = new FormControl<string>('');
categoryControl = new FormControl<string>('');
priceControl = new FormControl<number | null>(null);

  showLogoutPopup: boolean = false;
   isSidebarOpen: boolean = true;
  isMobile: boolean = false;


  currentView: 'products' | 'users' | 'orders' = 'products';

  constructor(private router: Router) {}
   ngOnInit() {
    this.checkMobile();
    window.addEventListener('resize', () => this.checkMobile());
  }

  checkMobile() {
    this.isMobile = window.innerWidth <= 768;
    if (this.isMobile) {
      this.isSidebarOpen = false;
    } else {
      this.isSidebarOpen = true;
    }
  }

  // Toggle view between products/users
  setView(view: 'products' | 'users'|'orders') {
    this.currentView = view;
    
    this.searchControl.setValue('');
    this.categoryControl.setValue('');
    this.priceControl.setValue(null);
    
   
     if (this.isMobile) {
      this.isSidebarOpen = false;
    }
  }
  // Close sidebar on mobile after selection
   
  
toggleSidebar() {
  this.isSidebarOpen = !this.isSidebarOpen;
}
 


  onLogout() {
    this.showLogoutPopup = true;
  }

  confirmLogout() {
    this.showLogoutPopup = false;
    localStorage.clear();
    this.router.navigate(['/']);
  }

  cancelLogout() {
    this.showLogoutPopup = false;
  }

  navigateToAdd() {
    this.router.navigate(['/add-product']);
  }
}