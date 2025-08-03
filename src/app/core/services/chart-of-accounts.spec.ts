import { TestBed } from '@angular/core/testing';

import { ChartOfAccounts } from './chart-of-accounts';

describe('ChartOfAccounts', () => {
  let service: ChartOfAccounts;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChartOfAccounts);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
