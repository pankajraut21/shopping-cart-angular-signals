import { Injectable } from "@angular/core";
import { Signal, signal } from "@angular/core";
import { CartItem } from "../models/cart-item.interface";

@Injectable({
    providedIn: "root"
})
export class ShoppingCartService {
    private items = signal<CartItem[]>([]);

    getItems(): Signal<CartItem[]> {
        return this.items;
    }

    addItem(item: CartItem): void {
        this.items.update((currentItems)=> [...currentItems, item]);
    }

    removeItem(itemId: number): void {
        this.items.update((currentItems)=> currentItems.filter(item => item.id !== itemId));
    }

    updateQuantity(itemId: number, quantity: number): void {
        this.items.update((currentItems) => (
            currentItems.map(item => 
                item.id === itemId ? {...item, quantity} : item
            )
        ))
    }

    clearCart(): void {
        this.items.update(() => []);
    }

}