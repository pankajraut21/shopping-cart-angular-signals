import { Injectable } from '@angular/core';
import { WritableSignal, signal } from '@angular/core';

import { CartItem } from '../../../core/models/cart-item.interface';
import { Product } from '../../../core/models/product.interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItemsSignal: WritableSignal<CartItem[]> = signal<CartItem[]>([]);
  totalPriceSignal: WritableSignal<number> = signal<number>(0);

  private cartItems: CartItem[] = [];

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
    this.updateCartItems();
    this.updateTotalPrice();
  }

  removeFromCart(productId: number): void {
    this.cartItems = this.cartItems.filter(item => item.id !== productId);
    this.updateCartItems();
    this.updateTotalPrice();
  }

  updateCart(product: CartItem): void {
    const existingProduct = this.cartItems.find(item => item.id === product.id);
    if (existingProduct) {
      existingProduct.quantity = product.quantity;
    }
    this.updateCartItems();
    this.updateTotalPrice();
  }

  private updateCartItems(): void {
    this.cartItemsSignal.set([...this.cartItems]);
  }

  private updateTotalPrice(): void {
    const totalPrice = this.cartItems.reduce((acc, product) => acc + product.price * product.quantity, 0);
    this.totalPriceSignal.set(totalPrice);
  }
}
