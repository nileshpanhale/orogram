import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessresetpasswdComponent } from './successresetpasswd.component';

describe('SuccessresetpasswdComponent', () => {
  let component: SuccessresetpasswdComponent;
  let fixture: ComponentFixture<SuccessresetpasswdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuccessresetpasswdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessresetpasswdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
