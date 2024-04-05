import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyhashAllComponent } from './verifyhash-open-trade-contract-history.component';

describe('TradeHistoryComponent', () => {
  let component: VerifyhashAllComponent;
  let fixture: ComponentFixture<VerifyhashAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyhashAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyhashAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
