import { Component, OnInit, OnDestroy, effect, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { CartService } from '../../services/cart.service';
import { IntegerOnlyDirective } from '../../directives/integer-only.directive';
import { CartItem } from '../../../../core/models/cart-item.interface';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IntegerOnlyDirective]
})
export class CartComponent implements OnInit, OnDestroy {
  cartItemsSignal: WritableSignal<CartItem[]> = signal<CartItem[]>([]);
  cartForm: FormGroup;
  totalPriceSignal = this.cartService.totalPriceSignal;

  constructor(public cartService: CartService, private formBuilder: FormBuilder) {
    this.cartForm = this.formBuilder.group({});
  }

  ngOnInit(): void {
    effect(() => {
      const items = this.cartService.cartItemsSignal();
      this.cartItemsSignal.set(items);
      this.loadCart();
    });
  }

  ngOnDestroy(): void {}

  loadCart(): void {
    const cartItems = this.cartItemsSignal();
    this.cartForm = this.formBuilder.group({}); // Reset the form group

    cartItems.forEach(item => {
      if (!this.cartForm.contains(item.id.toString())) {
        const control = this.formBuilder.control(item.quantity || 0);
        control.valueChanges.subscribe(() => this.updateQuantity(item));
        this.cartForm.addControl(item.id.toString(), control);
      } else {
        this.cartForm.get(item.id.toString())?.setValue(item.quantity, { emitEvent: false });
      }
    });
  }

  updateQuantity(item: CartItem): void {
    const quantity = this.cartForm.get(item.id.toString())?.value || 0;
    if (quantity !== item.quantity) {
      item.quantity = quantity;
      this.cartService.updateCart(item);
    }
  }

  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId);
    this.loadCart();
  }
}
