import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopComponent } from './features/product/components/shop/shop.component';
import { CartComponent } from './features/cart/components/cart/cart.component';
import { CartService } from './features/cart/services/cart.service';
import { HomeComponent } from './pages/home/home.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    HomeComponent,
    ShopComponent,
    CartComponent
  ],
})
export class AppComponent {
    view: 'shop' | 'cart' = 'shop';
    cartCount$: Observable<number>;

    constructor(private cartService: CartService) {
      this.cartCount$ = this.cartService.cartCount$;
    }

    displayShop(): void {
        this.view = 'shop';
    }
    
    displayCart(): void {
        this.view = 'cart';
    }
}
