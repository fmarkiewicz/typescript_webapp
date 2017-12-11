import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Product } from './product';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ProductService {

    private header = new Headers({'Content-Type': 'application/json'});
    private productsUrl = 'products';

    constructor(private http: Http) {

    }

    getProducts(): Promise<Product[]> {
        return this.http.get(this.productsUrl)
        .toPromise()
        .then(response => response.json() as Product[])
        .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.log('An error occured', error);
        return Promise.reject(error.message || error);
    }
}