import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;

  //toastMessage: string = '';
  // toastType: 'success' | 'error' = 'success';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthenticationService,  // ✅ service injected
    private toast: ToastService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  // आसान access for form fields
  get f() {
    return this.loginForm.controls;
  }

  // 👁️ toggle password
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // 🔔 Toast function
  /*showToast(message: string, type: 'success' | 'error') {
    this.toastMessage = message;
    this.toastType = type;

    setTimeout(() => {
      this.toastMessage = '';
    }, 2000);
  }*/

  // 🔐 LOGIN FUNCTION
  // login.component.ts

  onLogin() {

    if (this.loginForm.valid) {

      localStorage.clear();

      this.authService
        .login(this.loginForm.value)
        .subscribe({

          next: (res) => {

            // ❌ Handle invalid credentials returned with 200
            if (!res || !res.token) {

              this.toast.error("❌ Invalid Credentials");

              return;
            }

            // ✅ Save Token
            localStorage.setItem('token', res.token);

            const userRole = res.role.toUpperCase();

            localStorage.setItem('role', userRole);

            localStorage.setItem(
              'user',
              JSON.stringify(res)
            );

            // ✅ Success Toast
            this.toast.success(
              "✅ Login Successful"
            );

            setTimeout(() => {

              if (res.role === 'ADMIN') {

                this.router.navigate(['/dashboard']);

              }

              else {

                this.router.navigate(['/userdashboard']);

              }

            }, 1500);

          },
          error: (err) => {

            console.error(err);

            let message = "❌ Invalid Credentials";

            if (err?.error?.message) {
              message = err.error.message;
            }

            this.toast.error(message);

          }
        });

    }

    else {

      this.loginForm
        .markAllAsTouched();

      this.toast.info(
        "Please fill the details"
      );

    }

  }
}