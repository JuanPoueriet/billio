import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepBusiness } from './step-business';

describe('StepBusiness', () => {
  let component: StepBusiness;
  let fixture: ComponentFixture<StepBusiness>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepBusiness]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepBusiness);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
