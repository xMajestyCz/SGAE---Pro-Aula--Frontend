import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SecretaryPage } from './secretary.page';

describe('SecretaryPage', () => {
  let component: SecretaryPage;
  let fixture: ComponentFixture<SecretaryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SecretaryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
