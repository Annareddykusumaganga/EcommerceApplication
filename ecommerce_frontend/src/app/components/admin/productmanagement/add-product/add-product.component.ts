import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../../services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-product',
  imports: [FormsModule, ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  productForm!: FormGroup;
  imagePreview: string | null = null;
   
  // --- Toast popup ---
  showToast: boolean = false;
  constructor(private productService: ProductService, public router: Router) {}

  ngOnInit(): void {
    this.productForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9 ]{3,50}$/)]),
      price: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
      quantity: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/)]),
      category: new FormControl('', Validators.required),
      description: new FormControl('', [Validators.required, Validators.minLength(10)])
    });
  }

  // --- NAVIGATION METHODS ---
  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  navigateToViewProducts() {
    this.router.navigate(['/dashboard']); 
  }

  onLogout() {
    const confirmExit = confirm("Are you sure you want to exit?");
    if (confirmExit) {
      this.router.navigate(['/dashboard']); 
    }
  }

  // --- IMAGE UPLOAD LOGIC ---
  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      // Only allow specific types
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/jfif'];
      if (!allowedTypes.includes(file.type)) {
        alert("Only JPG, JPEG, JFIF, and PNG formats are allowed!");
        event.target.value = '';
        this.imagePreview = null;
        return;
      }

      // Convert to Base64
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1]; // Extract pure base64
        this.imagePreview = base64;
      };

      reader.readAsDataURL(file); // ✅ Important to read file
    }
  }

  // --- FORM SUBMISSION ---
  onSubmit() {
    if (this.productForm.valid && this.imagePreview) {
      const productData = {
        ...this.productForm.value,
        image: this.imagePreview // Base64 string
      };

      this.productService.addProduct(productData).subscribe({
        next: () => {
          this.showToast = true;
          
           // Clear form fields and image preview
             this.productForm.reset();
             this.imagePreview = null;

          // Auto-hide toast after 3 seconds
          setTimeout(() => {
            this.showToast = false;
            this.navigateToViewProducts();
          }, 3000);
        },
        error: (err) => alert('Error: ' + err.message)
      });
    } else if (!this.imagePreview) {
      alert("Please upload a product image.");
    }
  }
}