import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateContractsComponent } from './private-contracts.component';

describe('TradesComponent', () => {
  let component: PrivateContractsComponent;
  let fixture: ComponentFixture<PrivateContractsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivateContractsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivateContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
