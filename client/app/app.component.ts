import { ProductService } from './product.service';
import { Product } from './product';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'my-app',
    template: `<h1>Produkty</h1>
    <div>
        <label>Nazwa produktu:</label><input #productName /><br />
        <label>Ilość produktu:</label><input #productQuantity /><br />
        <button (click)="add(productName.value, productQuantity.value); productName.value=''; productQuantity.value='';">
            Dodaj produkt
        </button>
    </div>
    <ul class="products">
        <li *ngFor="let product of products" (click)="onSelect(product)"
            [class.selected]="product === selectedProduct"
        >
            <span class="quantity">{{product.quantity}}</span>
            {{product.name}}
            <button class="delete" (click)="delete(product); $event.stopPropagation();">x</button>
        </li>
    </ul>
    <div *ngIf="selectedProduct">
        <h2>{{selectedProduct.name}} - {{selectedProduct.quantity}}</h2>
        <div><label>id: </label>{{selectedProduct.id}}</div>
        <div>
            <label>Nazwa: </label>
            <input [(ngModel)]="selectedProduct.name" placeholder="name" />
            <label>Ilość: </label>
            <input [(ngModel)]="selectedProduct.quantity" placeholder="quantity" />
            <button (click)="save()">Zapisz</button>
        </div>
    </div>
    `,
    styles: [
        `
        .selected {
            background-color: #CFD8DC !important;
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
            background: #EEE;
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
            color: #607D8b;
            background-color: #DDD;
            left: .1em;
        }
        .products .quantity {
            display: inline-block;
            font-size: small;
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

    constructor(private productService: ProductService) {

    }

    getProducts(): void {
        this.productService.getProducts()
        .then(products => this.products = products)
    }

    onSelect(product: Product): void {
        this.selectedProduct = product
    }

    ngOnInit():void {
        this.getProducts();
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
    delete(product: Product): void {
        this.productService
            .delete(product.id)
            .then(() => {
                this.products = this.products.filter(p => p!== product);
                if (this.selectedProduct == product) {
                    this.selectedProduct = null;
                }
            });
    }
}