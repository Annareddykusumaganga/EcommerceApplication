import { Component} from '@angular/core';

import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { ViewproductlistComponent } from '../productmanagement/viewproductlist/viewproductlist.component';
import { UserlistComponent } from '../userlist/userlist.component';
import { OrderhistoryComponent } from '../../users/orderhistory/orderhistory.component';
import { filter } from 'rxjs';



@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ReactiveFormsModule, ViewproductlistComponent, UserlistComponent,OrderhistoryComponent,RouterModule],
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

    // ✅ Detect current URL on page load
  this.setViewFromUrl(this.router.url);
    // Detect URL change
  this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: any) => {
      this.setViewFromUrl(event.url);

    });
  }
    setViewFromUrl(url: string) {
      if (url.includes('viewproductlist')) {
        this.currentView = 'products';
      }

      else if (url.includes('userlist')) {
        this.currentView = 'users';
      }

      else if (url.includes('orderhistory')) {
        this.currentView = 'orders';
      }

      // Reset filters
      this.searchControl.setValue('');
      this.categoryControl.setValue('');
      this.priceControl.setValue(null);

   
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