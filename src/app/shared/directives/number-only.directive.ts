import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appNumberOnly]',
  standalone: true
})
export class NumberOnlyDirective {
  constructor(private el: ElementRef) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): boolean {
    const allowedKeys = [
      'Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 
      'Delete', 'Enter', '.', ','
    ];

    // Permitir: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if (event.ctrlKey || event.metaKey) {
      return true;
    }

    // Permitir teclas especiales
    if (allowedKeys.includes(event.key)) {
      return true;
    }

    // Permitir solo números (0-9)
    if (event.key >= '0' && event.key <= '9') {
      return true;
    }

    // Bloquear cualquier otra tecla
    event.preventDefault();
    return false;
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): boolean {
    event.preventDefault();
    const pastedInput = event.clipboardData?.getData('text/plain');
    
    if (pastedInput) {
      // Permitir solo números y punto decimal
      const sanitizedInput = pastedInput.replace(/[^0-9.]/g, '');
      document.execCommand('insertText', false, sanitizedInput);
    }
    
    return false;
  }
}
