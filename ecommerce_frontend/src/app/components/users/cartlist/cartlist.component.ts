import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-cartlist',
  imports: [CommonModule],
  templateUrl: './cartlist.component.html',
  styleUrls: ['./cartlist.component.css']
})
export class CartlistComponent implements OnInit {
 cartItems: any[] = [];
  userId: number = 0;
  total: number = 0;

  constructor(private cartService: CartService,private toastService:ToastService) {}

  ngOnInit(): void {
    // Get user data from local storage
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      this.userId = user.id;
      console.log(this.userId);
      this.loadCart();
    }
  }

  loadCart() {

  if (!this.userId) return;

  this.cartService
    .getCart(this.userId)
    .subscribe({

      next: (res) => {

        // 🔥 THIS IS REQUIRED
        this.cartItems = res.content;

        this.calculateTotal();

      },

      error: (err) =>
        console.error("Error loading cart:", err)

    });

}

  calculateTotal() {
    this.total = this.cartItems.reduce((sum, item) => 
      sum + (item.product.price * item.quantity), 0
    );
  }

  removeItem(id: number) {
    if (confirm("Remove this item from cart?")) {
      this.cartService.removeItem(id).subscribe(() => {
        // Filter locally for immediate UI update or reload from DB
        this.cartItems = this.cartItems.filter(item => item.id !== id);
        this.calculateTotal();
        this.toastService.info("Item removed from cart");  // Success toast
        // Optional: Trigger a count update in a shared service if needed
      });
    }
  }

  placeOrder() {
    this.cartService.placeOrder(this.userId).subscribe({
      next: () => {
        this.toastService.success("🎉 Order placed successfully!"); // Success toast
        this.cartItems = [];
        this.total = 0;
      },
      error: (err) =>this.toastService.error("Failed to place order: " + err.message)
    });
  }
}