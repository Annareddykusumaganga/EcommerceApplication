import { Component, Input, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-userlist',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit {
  @Input() searchTerm: string = '';
  @Input() filterRole: string = '';

  users: any[] = [];
  filteredUsers: any[] = [];

  showEditModal = false;

  selectedUser: any = {};
  // ✅ Pagination Variables
  page = 0;
  size = 5;
  totalPages = 0;
  totalElements = 0;

  constructor(private productService: ProductService,
    private toast:ToastService
  ) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {

    this.productService
      .getAllUsers(this.page, this.size)
      .subscribe(response => {

        // Backend Page<User> response
        this.users = response.content;

        this.totalPages = response.totalPages;

        this.totalElements = response.totalElements;

        this.applyFilters();

      });

  }

  // This handles the real-time filtering from the dashboard search bar
  ngOnChanges() {
    this.page = 0;

    this.loadUsers();
    // this.applyFilters();
  }

  applyFilters() {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = user.fullname.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesRole = this.filterRole ? user.role === this.filterRole : true;
      return matchesSearch && matchesRole;
    });
  }

  onDelete(id: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.productService.deleteUser(id).subscribe(() => {
        this.users = this.users.filter(u => u.id !== id);
        this.applyFilters();
      });
    }
  }

  onEdit(user: any) {
    // Logic for editing (e.g., opening a modal or navigating to edit page)
    console.log("Edit user:", user);

    this.selectedUser = { ...user };

  this.showEditModal = true;
  }

  updateUser() {

  this.productService
    .updateUser(
      this.selectedUser.id,
      this.selectedUser
    )
    .subscribe({

      next: () => {

        console.log("User updated successfully");

        // ✅ Toast instead of alert
        this.toast.success("User updated successfully");

        this.showEditModal = false;

        this.loadUsers();

      },

      error: (err) => {

        console.error("Update failed:", err);

        // ❌ Replace alert
        this.toast.error("Update failed");

      }

    });

}
closeModal() {

  this.showEditModal = false;

}

  // ✅ Pagination Controls

  nextPage() {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.loadUsers();
    }
  }

  prevPage() {
    if (this.page > 0) {
      this.page--;
      this.loadUsers();
    }
  }
}

