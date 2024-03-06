import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthFormErrorComponent } from './auth-form-error.component';

describe('AuthFormErrorComponent', () => {
  let component: AuthFormErrorComponent;
  let fixture: ComponentFixture<AuthFormErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthFormErrorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuthFormErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
