import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepPlan } from './step-plan';

describe('StepPlan', () => {
  let component: StepPlan;
  let fixture: ComponentFixture<StepPlan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepPlan]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepPlan);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
