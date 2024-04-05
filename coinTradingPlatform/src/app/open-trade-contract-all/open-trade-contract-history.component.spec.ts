import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeContractHistoryAllComponent } from './open-trade-contract-history.component';

describe('TradeHistoryComponent', () => {
  let component: TradeContractHistoryAllComponent;
  let fixture: ComponentFixture<TradeContractHistoryAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradeContractHistoryAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeContractHistoryAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
