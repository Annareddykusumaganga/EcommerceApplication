import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';


export const authGuard: CanActivateFn = (route,state) => {
 const router = inject(Router);
 // const token = localStorage.getItem('token');
 // const role = localStorage.getItem('role');
  // ✅ Safe localStorage access
  let token: string | null = null;
  let role: string | null = null;

  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token');
    role = localStorage.getItem('role');
  }
  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  // Protect Admin Dashboard from regular Users
  if (state.url.includes('dashboard') && !state.url.includes('userdashboard')) {
    if (role === 'ADMIN') {
      return true;
    } else {
      router.navigate(['/userdashboard']); // Send them to their own dashboard
      return false;
    }
  }

  return true;
};