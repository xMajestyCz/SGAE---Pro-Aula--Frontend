import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EnrollmentEditFormComponent } from './enrollment-edit-form.component';

describe('EnrollmentEditFormComponent', () => {
  let component: EnrollmentEditFormComponent;
  let fixture: ComponentFixture<EnrollmentEditFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EnrollmentEditFormComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EnrollmentEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
