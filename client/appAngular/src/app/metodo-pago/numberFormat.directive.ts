import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNumberFormat]'
})
export class NumberFormatDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '');
    const formattedValue = this.formatNumber(value);
    input.value = formattedValue;
  }

  private formatNumber(value: string): string {
    const splitValue = value.match(/^(\d{0,2})(\d{0,4})$/);
    if (!splitValue) return '';
    return splitValue[1] + (splitValue[2] ? '/' + splitValue[2] : '');
  }
}
