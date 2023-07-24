import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellcryptoAdminComponent } from './sell-crypto-admin.component';

describe('SellcryptoAdminComponent', () => {
  let component: SellcryptoAdminComponent;
  let fixture: ComponentFixture<SellcryptoAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellcryptoAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellcryptoAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
