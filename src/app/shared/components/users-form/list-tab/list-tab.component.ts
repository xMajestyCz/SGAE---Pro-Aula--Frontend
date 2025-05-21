import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { UserData } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-list-tab',
  templateUrl: './list-tab.component.html',
  styleUrls: ['./list-tab.component.scss'],
  standalone: false,
})
export class ListTabComponent implements OnInit {
  @Input() role!: string;
  @Input() users: UserData[] = [];
  @Input() isLoading = false;

  @Output() userSelected = new EventEmitter<UserData>();
  @Output() deleteUser = new EventEmitter<UserData>();

  searchControl = new FormControl('');
  isSearching = false;
  searchResult: UserData | null = null;

  headers = ['Nombre', 'Documento', 'Teléfono', 'Email', 'Eliminar'];

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(400))
      .subscribe((term) => {
        this.handleSearch(term ?? ''); // si es null, se convierte en string vacío
      });
  }

  handleSearch(term: string): void {
    const cleanTerm = term.trim();
    if (!cleanTerm) {
      this.searchResult = null;
      return;
    }

    this.isSearching = true;

    const found = this.users.find((user) =>
      user.id_card?.toString().startsWith(cleanTerm)
    );

    this.searchResult = found || null;
    this.isSearching = false;
  }

  clearSearch(): void {
    this.searchControl.setValue('');
    this.searchResult = null;
  }

  onUserClick(user: UserData): void {
    this.userSelected.emit(user);
  }

  onDelete(user: UserData): void {
    this.deleteUser.emit(user);
  }

  trackById(index: number, user: UserData): string {
    return user.id_card;
  }
}
