import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

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
  cartItems: CartItem[] = [];
  cartForm: FormGroup;
  totalPrice$: Observable<number> | undefined;

  private subscriptions: Subscription = new Subscription();

  constructor(private cartService: CartService, private formBuilder: FormBuilder) {
    this.cartForm = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.totalPrice$ = this.cartService.totalPrice$;
    this.loadCart();    
    const cartCountSubscription = this.cartService.cartCount$.subscribe(() => {
      this.loadCart();
    });
    this.subscriptions.add(cartCountSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadCart(): void {
    this.cartItems = this.cartService.getCart();
    this.cartItems?.forEach(item => {
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
