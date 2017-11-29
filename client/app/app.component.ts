import { Component, OnInit } from '@angular/core';

import { Product } from './product';
import { ProductService } from './product.service';

@Component({
  selector: 'my-app',
  template: `<h1>Lista produktów</h1>
  <div>
    <label>Nazwa produktu:</label> <input #productName /><br />
    <label>Ilość:</label> <input #productQuantity /><br />
    <button (click)="add(productName.value, productQuantity.value);productName.value='';productQuantity.value='';">
      Dodaj produkt
    </button>
  </div>
  <ul class="products">
    <li *ngFor="let product of products" (click)="onSelect(product)"
      [class.selected]="product === selectedProduct"
    >
       <span class="quantity">{{product.quantity}}</span>
       <span>{{product.name}}</span>
       <button class="delete" (click)="delete(product); $event.stopPropagation();">x</button>
    </li>
  </ul>
  <div *ngIf="selectedProduct">
    <h2>{{selectedProduct.name}} - {{selectedProduct.quantity}}</h2>
    <div><label>id: </label>{{selectedProduct.id}}</div>
    <div>
      <label>Nazwa: </label>
      <input [(ngModel)]="selectedProduct.name" placeholder="nazwa" />
      <label>Ilość: </label>
      <input [(ngModel)]="selectedProduct.quantity" placeholder="ilość" />
      <button (click)="save()">Zapisz</button>
    </div>
  </div>
  `,
  styles: [
    `
    .selected {
      background-color: #CFD8DC !important;
      color: white;
    }
    .products {
      margin: 0 0 2em 0;
      list-style-type: none;
      padding: 0;
      width: 15em;
    }
    .products li {
      cursor: pointer;
      position: relative;
      left: 0;
      background-color: #EEE;
      margin: .5em;
      padding: .3em 0;
      height: 1.6em;
      border-radius: 4px;
    }
    .products li.selected:hover {
      background-color: #BBD8DC !important;
      color: white;
    }
    .products li:hover {
      color: #607D8B;
      background-color: #DDD;
      left: .1em;
    }

    .products .quantity {
      display: inline-block;
      font-size: small;
      color: white;
      padding: 0.8em 0.7em 0 0.7em;
      background-color: #607D8B;
      line-height: 1em;
      position: relative;
      left: -1px;
      top: -4px;
      height: 1.8em;
      margin-right: .8em;
      border-radius: 4px 0 0 4px;
      width: 30px;
      text-align: center;
    }

    button.delete {
      float: right;
      margin-top: 2px;
      margin-right: .8em;
      background-color: gray !important;
      color: white;
    }
    `
  ],
  providers: [ProductService]
})
export class AppComponent implements OnInit {
  products: Product[];
  selectedProduct: Product;

  constructor(private productService: ProductService) { }

  getProducts(): void {
    this.productService.getProducts()
      .then(products => this.products = products);
  }

  onSelect(product: Product): void {
    this.selectedProduct = product;
  }

  delete(product: Product): void {
    this.productService
      .delete(product.id)
      .then(() => {
        this.products = this.products.filter(p => p !== product);
        if (this.selectedProduct === product) { this.selectedProduct = null; }
      })
  }

  save(): void {
    this.productService.update(this.selectedProduct)
      .then(() => this.getProducts());
  }

  add(productName: string, productQuantity: string): void {
    productName = productName.trim();
    productQuantity = productQuantity.trim();

    if (!productName || !productQuantity) {
      return;
    }

    this.productService.create(productName, productQuantity)
      .then(products => {
        this.products = products;
        this.selectedProduct = null;
      });
  }

  ngOnInit(): void {
    this.getProducts();
  }
}