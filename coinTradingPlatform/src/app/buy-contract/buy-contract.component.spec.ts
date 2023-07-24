import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyContractComponent } from './buy-contract.component';

describe('BuyCryptoComponent', () => {
  let component: BuyContractComponent;
  let fixture: ComponentFixture<BuyContractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
