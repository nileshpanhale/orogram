import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPurchasecryptoComponent } from './admin-purchase.component';

describe('PurchasecryptoComponent', () => {
  let component: AdminPurchasecryptoComponent;
  let fixture: ComponentFixture<AdminPurchasecryptoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPurchasecryptoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPurchasecryptoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
