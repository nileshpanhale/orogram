import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellContractClosedComponent } from './sell-contract-closed.component';

describe('SellCryptoComponent', () => {
  let component: SellContractClosedComponent;
  let fixture: ComponentFixture<SellContractClosedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellContractClosedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellContractClosedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
