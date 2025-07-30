import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepLocation } from './step-location';

describe('StepLocation', () => {
  let component: StepLocation;
  let fixture: ComponentFixture<StepLocation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepLocation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepLocation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
