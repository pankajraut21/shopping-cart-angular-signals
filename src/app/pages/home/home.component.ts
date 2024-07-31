import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  template: `
    <ng-container *ngIf="view === 'shop'">
        <ng-content select="app-shop"></ng-content>
    </ng-container>
      
    <ng-container *ngIf="view === 'cart'">
        <ng-content select="app-cart"></ng-content>
    </ng-container>
  `,
  standalone: true,
  imports: [CommonModule]
})
export class HomeComponent {
  @Input() view: string = 'shop';
}
