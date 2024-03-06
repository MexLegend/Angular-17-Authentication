import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialAuthActionsComponent } from './social-auth-actions.component';

describe('SocialAuthActionsComponent', () => {
  let component: SocialAuthActionsComponent;
  let fixture: ComponentFixture<SocialAuthActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialAuthActionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SocialAuthActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
