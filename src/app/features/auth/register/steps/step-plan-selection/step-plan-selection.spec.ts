import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepPlanSelection } from './step-plan-selection';

describe('StepPlanSelection', () => {
  let component: StepPlanSelection;
  let fixture: ComponentFixture<StepPlanSelection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepPlanSelection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepPlanSelection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
