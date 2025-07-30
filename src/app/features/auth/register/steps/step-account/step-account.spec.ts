import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepAccount } from './step-account';

describe('StepAccount', () => {
  let component: StepAccount;
  let fixture: ComponentFixture<StepAccount>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepAccount]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepAccount);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
