import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepUserInfo } from './step-user-info';

describe('StepUserInfo', () => {
  let component: StepUserInfo;
  let fixture: ComponentFixture<StepUserInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepUserInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepUserInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
