import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { CartItem } from '../../../core/models/cart-item.interface';
import { Product } from '../../../core/models/product.interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {  
  cartCount$: Observable<number>;
  totalPrice$: Observable<number>;

  private cartItems: CartItem[] = [];
  private cartCountSubject = new BehaviorSubject<number>(0);
  private totalPriceSubject = new BehaviorSubject<number>(0);

  constructor() {
    this.cartCount$ = this.cartCountSubject.asObservable();
    this.totalPrice$ = this.totalPriceSubject.asObservable();
  }

  getCart(): CartItem[] {
    return this.cartItems;
  }

  addToCart(product: Product): void {
    const existingProduct = this.cartItems.find(item => item.id === product.id);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      this.cartItems.push({ ...product, quantity: 1 });
    }
    this.updateCartCount();
    this.updateTotalPrice();
  }

  removeFromCart(productId: number): void {
    this.cartItems = this.cartItems.filter(item => item.id !== productId);
    this.updateCartCount();
    this.updateTotalPrice();
  }

  updateCart(product: CartItem): void {
    const existingProduct = this.cartItems.find(item => item.id === product.id);
    if (existingProduct) {
      existingProduct.quantity = product.quantity;
    }
    this.updateCartCount();
    this.updateTotalPrice();
  }

	/*
		I have a slight confusion here regarding the cart count implementation:
		Should the cart count increase each time a user clicks the 'Add to Cart' button,
		regardless of the quantity of the same product, or should it only reflect the total number
		of unique products in the cart?
	*/
	private updateCartCount(): void {
		/*
			If the cart count should reflect the total number of products (including multiple quantities),
			following lines will work:
		*/
		const totalCount = this.cartItems.reduce((acc, item) => acc + item.quantity, 0);
		this.cartCountSubject.next(totalCount);
		/*
			If the cart count should only reflect the total number of unique products in the cart,
			following statement will work:
			this.cartCountSubject.next(this.cartItems.length);
		*/
	}

  private updateTotalPrice(): void {
    const totalPrice = this.cartItems.reduce((acc, product) => acc + product.price * product.quantity, 0);
    this.totalPriceSubject.next(totalPrice);
  }
}
