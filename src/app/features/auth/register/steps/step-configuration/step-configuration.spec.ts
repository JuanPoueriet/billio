import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepConfiguration } from './step-configuration';

describe('StepConfiguration', () => {
  let component: StepConfiguration;
  let fixture: ComponentFixture<StepConfiguration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepConfiguration]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepConfiguration);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
