import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private baseUrl = 'http://localhost:8082/auth'; // Spring Boot backend URL
  private adminUrl = 'http://localhost:8082/admin';
  constructor(private http: HttpClient) { }

  /** Register user */
  register(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user);
  }

  /** Login user */
  login(credentials: { username: string; password: string }): Observable<any> {
    // We simply return the POST request. 
  // Angular's HttpClient will automatically throw an error if the status is NOT 2xx.
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }
forgotPasswordByEmail(email: string) {
  return this.http.post(`${this.baseUrl}/forgot-password`, { email: email });
}

verifyAndResetPassword(data: any) {
  return this.http.post(`${this.baseUrl}/reset-password`, data);
}
  
 
   /** --- SESSION MANAGEMENT --- **/
  /** Save token and user info in localStorage */
  setSession(data: any) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
  }

  /** Get current user info */
  getCurrentUser(): any | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  /** Get JWT token */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /** Logout user */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  /** Check if user is logged in */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}