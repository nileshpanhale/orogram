import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyContractClosedComponent } from './buy-contract-closed.component';

describe('BuyCryptoComponent', () => {
  let component: BuyContractClosedComponent;
  let fixture: ComponentFixture<BuyContractClosedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyContractClosedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyContractClosedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
