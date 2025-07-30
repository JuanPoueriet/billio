import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartOfAccounts } from './chart-of-accounts.page';

describe('ChartOfAccounts', () => {
  let component: ChartOfAccounts;
  let fixture: ComponentFixture<ChartOfAccounts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartOfAccounts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartOfAccounts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
