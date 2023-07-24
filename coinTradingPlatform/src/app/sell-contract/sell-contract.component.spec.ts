import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellContractComponent } from './sell-contract.component';

describe('SellCryptoComponent', () => {
  let component: SellContractComponent;
  let fixture: ComponentFixture<SellContractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
