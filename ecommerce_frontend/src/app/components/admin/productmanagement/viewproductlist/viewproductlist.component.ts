import { Component, Input, OnChanges, OnInit,SimpleChanges } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Product } from '../../../../models/product';
import { ProductService } from '../../../../services/product.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-viewproductlist',
  standalone: true, // Added standalone if not already there
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './viewproductlist.component.html',
  styleUrls: ['./viewproductlist.component.css']
})
export class ViewproductlistComponent implements OnInit,OnChanges {
   products: Product[] = [];
  filteredProducts: Product[] = [];
  selectedProduct: Product | null = null;
  editingProduct: Product | null = null;
  editImagePreview: string | null = null;
  isUpdating: boolean = false;

  searchControl = new FormControl('');
  private _searchTerm: string = '';

  @Input() set searchTerm(value: string) {
    this._searchTerm = value || '';
    this.applyFilters();
  }

  @Input() filterCategory: string = '';
  @Input() filterPrice: number | null = null;

  constructor(
    private productService: ProductService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadProducts();
    this.searchControl.valueChanges.subscribe(value => {
      this._searchTerm = value || '';
      this.applyFilters();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filterCategory'] || changes['filterPrice'] || changes['searchTerm']) {
      this.applyFilters();
    }
  }

  loadProducts() {
    this.productService.getAllProductsAdmin().subscribe({
      next: (data) => {
        this.products = data.map((p: Product) => ({ ...p, showFullDesc: false }));
        this.applyFilters();
      },
      error: (err) => console.error('Error loading products:', err)
    });
  }

  toggleDescription(product: Product) {
    product.showFullDesc = !product.showFullDesc;
  }

  applyFilters() {
    const priceFilter = this.filterPrice != null ? Number(this.filterPrice) : null;
    this.filteredProducts = this.products.filter(p => {
      const matchesName = p.name.toLowerCase().includes(this._searchTerm.toLowerCase());
      const matchesCategory = !this.filterCategory || p.category === this.filterCategory;
      const matchesPrice = priceFilter == null || p.price <= priceFilter;
      return matchesName && matchesCategory && matchesPrice;
    });
  }

  // --- VIEW MODAL ---
  openViewModal(product: Product) {
    this.selectedProduct = product;
    document.body.style.overflow = 'hidden';
  }

  closeViewModal() {
    this.selectedProduct = null;
    document.body.style.overflow = 'auto';
  }

  // --- EDIT MODAL ---
  openEditModal(product: Product) {
    // Create a deep copy to avoid modifying original while editing
    this.editingProduct = JSON.parse(JSON.stringify(product));
    
    // Handle image preview - only set if image is a string
    if (product.image && typeof product.image === 'string') {
      this.editImagePreview = product.image;
    } else {
      this.editImagePreview = null;
    }
    
    document.body.style.overflow = 'hidden';
  }

  closeEditModal() {
    this.editingProduct = null;
    this.editImagePreview = null;
    this.isUpdating = false;
    document.body.style.overflow = 'auto';
  }

  onEditFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/jfif'];
      if (!allowedTypes.includes(file.type)) {
        alert("Only JPG, JPEG, JFIF, and PNG formats are allowed!");
        event.target.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        this.editImagePreview = base64;
        if (this.editingProduct) {
          this.editingProduct.image = base64;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  isEditFormValid(): boolean {
    if (!this.editingProduct) return false;
    const isValid = !!(
      this.editingProduct.name?.trim() &&
      this.editingProduct.price > 0 &&
      this.editingProduct.quantity !== undefined &&
      this.editingProduct.quantity >= 0 &&
      this.editingProduct.category &&
      this.editingProduct.description?.length >= 10
    );
    return isValid;
  }

  updateProductDetails() {
    if (this.editingProduct && this.isEditFormValid()) {
      if (!this.editingProduct.id) {
        alert('Product ID is missing');
        return;
      }
      
      this.isUpdating = true;
      
      // Ensure image is string before sending to API
      const productToUpdate = {
        ...this.editingProduct,
        image: typeof this.editingProduct.image === 'string' ? this.editingProduct.image : ''
      };
      
      this.productService.updateProduct(this.editingProduct.id, productToUpdate).subscribe({
        next: () => {
          alert('✅ Product updated successfully!');
          this.closeEditModal();
          this.loadProducts();
        },
        error: (err) => {
          console.error('Update error:', err);
          alert('❌ Error updating product: ' + (err.error?.message || err.message));
          this.isUpdating = false;
        }
      });
    } else {
      alert('Please fill all required fields correctly:\n\n- Name (min 3 chars)\n- Price > 0\n- Quantity >= 0\n- Category selected\n- Description (min 10 chars)');
    }
  }

  // --- DELETE PRODUCT ---
  deleteProduct(id: number | undefined): void {
    if (!id) {
      alert('Invalid product ID');
      return;
    }
    
    const confirmDelete = confirm('⚠️ Are you sure you want to delete this product?');
    if (confirmDelete) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          alert('✅ Product deleted successfully!');
          this.loadProducts();
        },
        error: (err) => {
          console.error('Delete error:', err);
          alert('❌ Error deleting product: ' + err.message);
        }
      });
    }
  }

  // --- NAVIGATION ---
  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  navigateToAddProduct() {
    this.router.navigate(['/add-product']);
  }
}