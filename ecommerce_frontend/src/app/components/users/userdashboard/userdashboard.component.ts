import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../services/cart.service';
import { CartlistComponent } from '../cartlist/cartlist.component';
import { Router } from '@angular/router';
import { OrderhistoryComponent } from '../orderhistory/orderhistory.component';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-userdashboard',
  imports: [CommonModule,FormsModule,CartlistComponent,OrderhistoryComponent],
  templateUrl: './userdashboard.component.html',
  styleUrls: ['./userdashboard.component.css']
})
export class UserdashboardComponent implements OnInit{
  @ViewChild('navbarContent') navbarContent!: ElementRef; // Reference to the collapse div
products: any[] = [];
  filteredProducts: any[] = [];
  searchTerm: string = '';
  selectedProduct: any = null;
  cartCount: number = 0;
  userId: number = 0;
  showLogoutPopup: boolean = false;
  showCart: boolean = false;
  showOrders: boolean = false;
  user: any = null; // ✅ Added this to fix the "Welcome" message in HTML
  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private toastService: ToastService// 2. Inject Service
  ) {}

  // Create a helper method to close the menu
  private closeNavbar() {
    const navbar = this.navbarContent?.nativeElement;
    if (navbar && navbar.classList.contains('show')) {
      navbar.classList.remove('show');
    }
  }

  ngOnInit(): void {
    this.loadProducts();
    // ✅ FIXED: SSR Safety check prevents the localStorage crash
    if (typeof window !== 'undefined' && window.localStorage) {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
      this.userId = this.user.id;
      this.loadCartCount();
    }
    }
  }

  // ✅ ADDED THIS MISSING FUNCTION
  toggleCartView(status: boolean) {
    this.closeNavbar(); // Close menu
    this.showCart = status;
    this.showOrders = false;
    if (status) {
      this.loadCartCount(); // Refresh count when opening cart
    }
  }

  loadProducts() {
    this.productService.getProducts().subscribe(data => {
      // Initialize selectedQty to 1 for every product
      this.products = data.map((p: any) => ({ ...p, selectedQty: 1 }));
      this.filteredProducts = [...this.products];
    });
  }

  search() {
    const term = this.searchTerm.toLowerCase();
    this.filteredProducts = this.products.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term)
    );
  }

  filterByCategory(category: string) {
    this.filteredProducts = this.products.filter(p =>
      p.category?.toLowerCase() === category.toLowerCase()
    );
  }

  loadAllProducts() {
    this.filteredProducts = [...this.products];
  }

  increment(p: any) {
    if (p.selectedQty < p.quantity) p.selectedQty++;
  }

  decrement(p: any) {
    if (p.selectedQty > 1) p.selectedQty--;
  }

  openProduct(p: any) {
    this.selectedProduct = { ...p };
  }

  closeProduct() {
    this.selectedProduct = null;
  }

 addToCart(product: any) {
    if (!this.userId) {
      this.toastService.error('Please login to add items to your cart.'); // Use toast for error
      return;
    }

    const payload = {
      user: { id: this.userId },
      product: { id: product.id },
      quantity: product.selectedQty || 1
    };

    this.cartService.addToCart(payload).subscribe({
      next: () => {
        // 3. Use the Toast Service here
        this.toastService.success(`${product.name} added to cart successfully!`);
        
        // Refresh cart count
        this.loadCartCount();
      },
      error: (err: any) => {
        this.toastService.error(err.error?.message || 'Failed to add to cart');
      }
    });
  }

toggleOrdersView(status: boolean) {
  this.closeNavbar(); // Close menu
  this.showOrders = status;
  this.showCart = false;

}

 loadCartCount() {
  if (!this.userId) return;
  this.cartService.getCart(this.userId).subscribe((res: any) => {
    // Check if res.content exists (for Paged results) 
    // or use res directly if it's a simple array
    const items = res.content ? res.content : res;
    
    if (Array.isArray(items)) {
      this.cartCount = items.reduce((sum: number, item: any) => sum + item.quantity, 0);
    } else {
      this.cartCount = 0;
    }
  });
}

  openLogoutPopup() { this.showLogoutPopup = true; }
  closeLogoutPopup() { this.showLogoutPopup = false; }

  confirmLogout() {
    if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
   this.router.navigate(['/login']);
    }
  }
}