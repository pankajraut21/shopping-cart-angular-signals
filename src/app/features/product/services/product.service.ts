import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

import { API_ENDPOINTS } from '../../../core/constants/api-endpoints';
import { environment } from '../../../../environments/environment';
import { Product } from '../../../core/models/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = environment.DUMMY_MICROSERVICE;
  private productsEndpoint = API_ENDPOINTS.PRODUCTS;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<{ products: Product[] }>(`${this.apiUrl}/${this.productsEndpoint}?limit=50`)
      .pipe(
        map(response => response.products),
        catchError(this.handleError)
      );
  }
  
  private handleError(error: HttpErrorResponse): Observable<Product[]> {
    let errorMessage = 'An unknown error occurred.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error ${error.status}: ${error.statusText}: ${error.message}`;
    }
	alert(errorMessage);
    return of([]);
  }
}
