import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessfullpaymentComponent } from './successfullpayment.component';

describe('SuccessfullpaymentComponent', () => {
  let component: SuccessfullpaymentComponent;
  let fixture: ComponentFixture<SuccessfullpaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuccessfullpaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessfullpaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
