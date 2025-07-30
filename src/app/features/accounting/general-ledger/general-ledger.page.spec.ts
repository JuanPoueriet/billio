import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralLedger } from './general-ledger.page';

describe('GeneralLedger', () => {
  let component: GeneralLedger;
  let fixture: ComponentFixture<GeneralLedger>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralLedger]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralLedger);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
