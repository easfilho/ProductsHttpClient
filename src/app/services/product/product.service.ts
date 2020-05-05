import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from 'src/app/model/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  readonly baseUrl: string = 'http://localhost:8080/v1/products';
  constructor(private httpClient: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(this.baseUrl);
  }

  getProductsError(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.baseUrl}/error`);
  }

  getProductsLoading(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.baseUrl}/loading`);
  }

  getProductsIds(): Observable<string[]> {
    return this.httpClient.get<string[]>(`${this.baseUrl}/ids`);
  }

  getProductName(id: string): Observable<string> {
    return this.httpClient.get(`${this.baseUrl}/${id}/name`, {responseType: 'text'});
  }

  saveProduct(product: Product): Observable<Product> {
    return this.httpClient.post<Product>(this.baseUrl, product);
  }

  delete(product: Product) {
    return this.httpClient.delete(`${this.baseUrl}/${product.id}`);
  }

  update(product: Product) {
    return this.httpClient.put(`${this.baseUrl}/${product.id}`, product);
  }
}
