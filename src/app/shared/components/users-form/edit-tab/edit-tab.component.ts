import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserData } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-edit-tab',
  templateUrl: './edit-tab.component.html',
  styleUrls: ['./edit-tab.component.scss'],
  standalone: false
})
export class EditTabComponent implements OnChanges {
  @Input() user!: UserData;
  @Input() isLoading = false;

  @Output() saveEdit = new EventEmitter<FormGroup>();

  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  form!: FormGroup;
  imagePreview: string | null = null;
  fileChanged = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      address: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      image: [null]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] && this.user) {
      this.form.patchValue({
        address: this.user.address,
        phone: this.user.phone,
        email: this.user.email,
        image: this.user.image
      });
      this.imagePreview = this.user.image || null;
      this.fileChanged = false;
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.saveEdit.emit(this.form);
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
        this.imagePreview = reader.result as string;
        this.form.patchValue({ image: reader.result });
        this.fileChanged = true;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(event: Event): void {
    event.stopPropagation();
    this.imagePreview = null;
    this.form.patchValue({ image: null });
    this.fileChanged = true;
    if (this.fileInputRef?.nativeElement) {
      this.fileInputRef.nativeElement.value = '';
    }
  }
}
