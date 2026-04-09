import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://localhost:8082/user';
  private adminUrl = 'http://localhost:8082/admin';

  constructor(private http: HttpClient) { }

  /**
   * ✅ SSR-SAFE HEADER HELPER
   * Centralizes token retrieval and prevents ReferenceErrors
   */
  private getAuthHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    
    // Check if we are in the browser before accessing localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }
    return headers;
  }

  // --- USER METHODS ---

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/products`, {
      headers: this.getAuthHeaders()
    });
  }

  // addToCart(cartData: any): Observable<any> {
  //   return this.http.post(`${this.baseUrl}/cart`, cartData, {
  //     headers: this.getAuthHeaders()
  //   });
  // }

  // --- ADMIN METHODS ---

  addProduct(productData: any): Observable<any> {
    return this.http.post(`${this.adminUrl}/add`, productData, {
      headers: this.getAuthHeaders()
    });
  }

  getAllProductsAdmin(): Observable<any[]> {
    return this.http.get<any[]>(`${this.adminUrl}/products`, {
      headers: this.getAuthHeaders()
    });
  }

  updateProduct(id: number, productData: any): Observable<any> {
    return this.http.put(`${this.adminUrl}/edit/${id}`, productData, {
      headers: this.getAuthHeaders()
    });
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.adminUrl}/delete/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  getAllUsers(page: number, size: number): Observable<any> {
  return this.http.get<any>(
    `${this.adminUrl}/users?page=${page}&size=${size}`,
    {
      headers: this.getAuthHeaders()
    }
  );
}

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.adminUrl}/users/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  updateUser(id: number, userData: any): Observable<any> {
    return this.http.put(`${this.adminUrl}/users/${id}`, userData, {
      headers: this.getAuthHeaders()
    });
  }
}
