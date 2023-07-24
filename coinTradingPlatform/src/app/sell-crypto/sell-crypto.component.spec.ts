import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellCryptoComponent } from './sell-crypto.component';

describe('SellCryptoComponent', () => {
  let component: SellCryptoComponent;
  let fixture: ComponentFixture<SellCryptoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellCryptoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellCryptoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
