import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiQuickRatio } from './kpi-quick-ratio';

describe('KpiQuickRatio', () => {
  let component: KpiQuickRatio;
  let fixture: ComponentFixture<KpiQuickRatio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiQuickRatio]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KpiQuickRatio);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
