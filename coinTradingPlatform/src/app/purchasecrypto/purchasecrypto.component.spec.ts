import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasecryptoComponent } from './purchasecrypto.component';

describe('PurchasecryptoComponent', () => {
  let component: PurchasecryptoComponent;
  let fixture: ComponentFixture<PurchasecryptoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchasecryptoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasecryptoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
