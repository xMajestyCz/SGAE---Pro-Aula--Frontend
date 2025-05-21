import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateSchedulePage } from './create-schedule.page';

describe('CreateSchedulePage', () => {
  let component: CreateSchedulePage;
  let fixture: ComponentFixture<CreateSchedulePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSchedulePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
