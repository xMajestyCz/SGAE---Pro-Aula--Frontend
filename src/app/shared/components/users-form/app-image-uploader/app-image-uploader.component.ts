import { Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html'
})
export class ImageUploaderComponent {
  @Input() form!: FormGroup;
  imagePreview: string | null = null;

  handleFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.form.patchValue({ image: this.imagePreview });
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  removeImage(): void {
    this.imagePreview = null;
    this.form.patchValue({ image: null });
  }
}
