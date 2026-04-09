import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-register',
  standalone:true,
  imports: [ReactiveFormsModule,CommonModule,RouterModule],
  templateUrl: './register.component.html',
  styleUrls:['./register.component.css']
})
export class RegisterComponent {
signupForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  //toastMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthenticationService,
    private toast: ToastService
  ) {
    // Form controls
    this.signupForm = this.fb.group({
      fullname: ['', Validators.required],
      username: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{4,12}$/)]],
      contactno: ['', [Validators.required, Validators.pattern(/^[6-9][0-9]{9}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[0-9])(?=.*[A-Z]).{8,}$/)]],
      confirmPassword: ['', Validators.required],
      role: ['USER', Validators.required] // Ensure 'USER' is the default
    }, { validators: this.passwordMatchValidator });
  }

  // Form controls getter
  get f() {
    return this.signupForm.controls;
  }

  // Password confirmation validator
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  // Only validate if both fields have values
  if (!password?.value || !confirmPassword?.value) {
    return null;
  }

  return password.value !== confirmPassword.value ? 
  { mismatch: true } : null;
}
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // showToast(message: string) {
  //   this.toastMessage = message;
  //   setTimeout(() => this.toastMessage = '', 1500);
  // }

  onSubmit() {

  if (this.signupForm.valid) {

    const payload = { ...this.signupForm.value };

    delete payload.confirmPassword;

    this.authService.register(payload).subscribe({

      next: (res: any) => {

        if (res.success) {

          this.toast.success(res.message);

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);

        } else {

          this.toast.error(res.message);

        }

      },

      error: (err: any) => {

        console.error('Backend Error:', err);

        this.toast.error(
          '⚠️ Registration failed. Please try again!'
        );

      }

    });

  }

  else {

    this.signupForm.markAllAsTouched();

    this.toast.info(
      "⚠️ Please fill all required details"
    );

  }

}
}