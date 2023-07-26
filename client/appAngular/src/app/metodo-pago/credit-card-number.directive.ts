import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appCreditCardNumber]',
})
export class CreditCardNumberDirective {
  constructor(private ngControl: NgControl) {}

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\s+/g, '').replace(/-/g, '');

    if (value.length > 0) {
      const formattedValue = value
        .match(new RegExp('.{1,4}', 'g'))
        .join('-')
        .substr(0, 19);
      this.ngControl.control?.setValue(formattedValue, { emitEvent: false });
    }
  }
}
