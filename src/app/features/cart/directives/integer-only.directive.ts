import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[integerOnly]',
  standalone: true
})
export class IntegerOnlyDirective {
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight'];

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (
        (this.specialKeys.indexOf(event.key) !== -1) || 
        (event.key === 'ArrowUp' || event.key === 'ArrowDown')
    ) {
      return;
    }
    const key = event.key;
    if (!/^\d$/.test(key)) {
      event.preventDefault();
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let sanitizedValue = input.value.replace(/[^0-9]/g, '');
    if (sanitizedValue !== input.value) {
      input.value = sanitizedValue;
      input.dispatchEvent(new Event('input'));
    }

    // Ensure value is at least 1
    if (parseInt(sanitizedValue, 10) < 1) {
      input.value = '1';
      input.dispatchEvent(new Event('input'));
    }
  }
}
