import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepAccess } from './step-access';

describe('StepAccess', () => {
  let component: StepAccess;
  let fixture: ComponentFixture<StepAccess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepAccess]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepAccess);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
