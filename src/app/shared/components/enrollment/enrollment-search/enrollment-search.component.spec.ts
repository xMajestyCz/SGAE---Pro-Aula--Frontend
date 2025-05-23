import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EnrollmentSearchComponent } from './enrollment-search.component';

describe('EnrollmentSearchComponent', () => {
  let component: EnrollmentSearchComponent;
  let fixture: ComponentFixture<EnrollmentSearchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EnrollmentSearchComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EnrollmentSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
