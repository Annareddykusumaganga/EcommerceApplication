import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
private baseUrl = 'http://localhost:8082/user';

 
  // ✅ Refresh cart trigger
  private refresh = new Subject<void>();
  refresh$ = this.refresh.asObservable();  
constructor(private http: HttpClient) {}


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
  // ✅ Add to Cart
  addToCart(data: any): Observable<any> {

    return this.http.post(
      `${this.baseUrl}/cart`,
      data,
      { headers: this.getAuthHeaders() }   // 🔥 ADD HERE
    );

  }

 // 🔥 THIS WAS THE MAIN PROBLEM
  getCart(
  userId: number,
  page: number = 0,
  size: number = 5
): Observable<any> {

  return this.http.get<any>(
    `${this.baseUrl}/cart/${userId}?page=${page}&size=${size}`,
    { headers: this.getAuthHeaders() }
  );

}
  // ✅ Remove item
  removeItem(id: number): Observable<any> {

  return this.http.delete(
    `${this.baseUrl}/cart/${id}`,
    { headers: this.getAuthHeaders() }
  );

}

  // ✅ Place order
 placeOrder(userId: number): Observable<any> {

  return this.http.post(
    `${this.baseUrl}/orders/${userId}`,
    {},
    { headers: this.getAuthHeaders() }
  );

}
   // ✅ Refresh Cart Trigger
  refreshCart() {

    this.refresh.next();

  }
}
