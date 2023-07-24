import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionSellComponent } from './transaction-sell.component';

describe('TransactionSellComponent', () => {
  let component: TransactionSellComponent;
  let fixture: ComponentFixture<TransactionSellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionSellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionSellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
