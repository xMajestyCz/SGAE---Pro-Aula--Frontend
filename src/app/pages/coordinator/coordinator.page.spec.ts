import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoordinatorPage } from './coordinator.page';

describe('CoordinatorPage', () => {
  let component: CoordinatorPage;
  let fixture: ComponentFixture<CoordinatorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CoordinatorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
