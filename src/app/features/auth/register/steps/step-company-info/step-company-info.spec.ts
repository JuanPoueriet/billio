import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepCompanyInfo } from './step-company-info';

describe('StepCompanyInfo', () => {
  let component: StepCompanyInfo;
  let fixture: ComponentFixture<StepCompanyInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepCompanyInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepCompanyInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
