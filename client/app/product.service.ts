import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Product } from './product';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class ProductService {

  private header = new Headers({ 'Content-Type': 'application/json' });

  private productsUrl = 'products';

  constructor(private http: Http) { }

  getProducts(): Promise<Product[]> {
    return this.http.get(this.productsUrl)
      .toPromise()
      .then(response => response.json() as Product[])
      .catch(this.handleError);
  }

  update(product: Product): Promise<Product> {
    const url = `${this.productsUrl}/${product.id}`;

    return this.http
      .put(url, JSON.stringify(product), { headers: this.header })
      .toPromise()
      .then(() => product)
      .catch(this.handleError);
  }

  create(productName: string, productQuantity: string): Promise<Product> {
    return this.http
      .post(this.productsUrl, JSON.stringify({
        name: productName, quantity: productQuantity
      }), { headers: this.header })
      .toPromise()
      .then(result => result.json())
      .catch(this.handleError);
  }

  delete(productId: number): Promise<void> {
    const url = `${this.productsUrl}/${productId}`;

    return this.http.delete(url, { headers: this.header })
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.log('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}