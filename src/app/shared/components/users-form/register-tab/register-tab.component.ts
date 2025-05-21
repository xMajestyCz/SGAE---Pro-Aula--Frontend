import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Guardian } from 'src/app/shared/models/guardian';

@Component({
  selector: 'app-register-tab',
  templateUrl: './register-tab.component.html',
  styleUrls: ['./register-tab.component.scss'],
  standalone: false
})
export class RegisterTabComponent {
  @Input() form!: FormGroup;
  @Input() role!: string;
  @Input() guardians: Guardian[] = [];
  @Input() isLoading = false;

  @Input() maxBirthDateStudent!: Date;
  @Input() minBirthDateStudent!: Date;
  @Input() maxBirthDateOtherRoles!: Date;
  @Input() minBirthDateOtherRoles!: Date;

  @Output() submitForm = new EventEmitter<void>();

  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  onSubmit(): void {
    if (this.form.valid) {
      this.submitForm.emit();
    } else {
      this.form.markAllAsTouched();
    }
  }

  handleFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.form.patchValue({ image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(event: Event): void {
    event.stopPropagation();
    this.form.patchValue({ image: null });
    if (this.fileInputRef?.nativeElement) {
      this.fileInputRef.nativeElement.value = '';
    }
  }
}
