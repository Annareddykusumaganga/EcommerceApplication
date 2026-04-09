import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ToastService } from '../../../services/toast.service';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-orderhistory',
  imports: [CommonModule],
  templateUrl: './orderhistory.component.html',
  styleUrl: './orderhistory.component.css'
})
export class OrderhistoryComponent implements OnInit,OnChanges{
  @Input() isAdmin: boolean = false;
  @Input() filterStatus: string = ''; 
  @Input() searchTerm: string = '';   


  allOrders: any[] = []; // Store original data here
 orders: any[] = [];
  userId: number = 0;
  loading: boolean = true;

  // Add this method
  ngOnChanges(changes: SimpleChanges) {
  // Triggered when isAdmin changes or on initial binding
  if (changes['isAdmin']) {
    this.refreshData();
  }
  // Trigger local filtering when inputs change
    if (changes['filterStatus'] || changes['searchTerm']) {
      this.applyFilters();
    }
}
  
  constructor(
    private orderService: OrderService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
  // If ngOnChanges didn't catch the initial value, trigger here
  if (this.orders.length === 0) {
    this.refreshData();
  }
}

private refreshData() {
  this.loading = true;
  console.log("Fetching orders. Admin Mode:", this.isAdmin);

  if (this.isAdmin) {
    this.loadAllOrders();
  } else {
    this.initUserMode();
  }
}

private initUserMode() {
  const userData = localStorage.getItem('user');
  if (userData) {
    const user = JSON.parse(userData);
    const actualId = user.id || user.userId;
    if (actualId) {
      this.userId = actualId;
      this.loadUserOrders(actualId);
    } else {
      this.loading = false;
      this.toastService.error("User ID not found in session.");
    }
  } else {
    this.loading = false;
    this.toastService.error("Session expired. Please login.");
  }
}

loadAllOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        this.allOrders = data; // Save original
        this.applyFilters();   // Apply any active filters
        this.loading = false;
      },
      error: (err) => {
        this.toastService.error("Failed to load all orders");
        this.loading = false;
      }
    });
  }



loadUserOrders(id: number): void {
  // Use the 'id' passed into the function directly
  this.orderService.getUserOrders(id).subscribe({
    next: (data: any) => {
      this.orders = data;
      this.loading = false;
    },
    error: (err: any) => {
      console.error(err); // Log the actual error for debugging
      this.toastService.error("Failed to load order history");
      this.loading = false;
    }
  });
}


applyFilters(): void {
    let filtered = [...this.allOrders];

    // 1. Filter by Status
    if (this.filterStatus) {
      filtered = filtered.filter(o => o.status === this.filterStatus);
    }

    // 2. Filter by Name (Product name or Customer name)
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(o => 
        o.productName?.toLowerCase().includes(term) || 
        o.username?.toLowerCase().includes(term)
      );
    }

    this.orders = filtered;
  }
  
// New method for Admin to update status
  updateStatus(orderId: number, status: string): void {
    this.orderService.updateOrderStatus(orderId, status).subscribe({
      next: (res: any) => {
        this.toastService.success("Status updated to " + status);
        // Update local array so UI updates immediately
        const order = this.orders.find(o => o.id === orderId);
        if (order) order.status = status;
      },
      error: (err) => {
        this.toastService.error("Failed to update status");
      }
    });
  }
  cancelOrder(orderId: number): void {
    const msg = this.isAdmin ? "Delete this record?" : "Cancel this order?";
    if (confirm(msg)) {
      this.orderService.deleteOrder(orderId).subscribe({
        next: () => {
          this.toastService.success("Record removed");
          this.orders = this.orders.filter(o => o.id !== orderId);
        },
        error: (err: any) => {
          this.toastService.error("Delete failed");
        }
      });
    }
  }
}