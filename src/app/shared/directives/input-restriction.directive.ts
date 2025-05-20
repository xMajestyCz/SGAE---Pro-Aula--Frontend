import { Directive } from "@angular/core";

@Directive({
    standalone: false,
    selector: '[appLettersOnly]',
    host: {
        '(keypress)': 'onKeyPress($event)'
    }
})
export class LettersOnlyDirective {
    onKeyPress(event: KeyboardEvent) {
        const pattern = /[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/;
        const inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar)) {
            event.preventDefault();
        }
    }
}

@Directive({
    standalone: false,
    selector: '[appNumbersOnly]',
    host: {
        '(keypress)': 'onKeyPress($event)'
    }
})
export class NumbersOnlyDirective {
    onKeyPress(event: KeyboardEvent) {
        const pattern = /[0-9]/;
        const inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar)) {
        event.preventDefault();
        }
    }
}