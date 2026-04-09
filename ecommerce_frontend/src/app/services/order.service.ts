import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

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

  // Base URL matching your @RequestMapping("/admin")
  private baseUrl = 'http://localhost:8082/admin';

// Matches your @CrossOrigin and @RequestMapping in UserController
  private apiUrl = 'http://localhost:8082/user/orders';

  constructor(private http: HttpClient) {}

 
  /**
   * USER METHODS
   */

   // Calls @GetMapping("/orders/{userId}")
  getUserOrders(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${userId}`, { 
      headers: this.getAuthHeaders() 
    });
  }

  // DELETE: /user/orders/delete/{id}
  deleteOrder(orderId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${orderId}`, { 
      headers: this.getAuthHeaders(),
      responseType: 'text' 
    });
  }

  /**
   * ADMIN METHODS
   */

  // GET: /admin/orders
  getAllOrders(): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/orders`, { 
    headers: this.getAuthHeaders() 
  });
}

  // PUT: /admin/orders/{id}?status=...
  updateOrderStatus(orderId: number, status: string): Observable<any> {
    const params = new HttpParams().set('status', status);
    return this.http.put(`${this.baseUrl}/orders/${orderId}`, {}, { 
      headers: this.getAuthHeaders(),
      params: params 
    });
  }
}