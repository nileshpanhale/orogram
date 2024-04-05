import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyHashComponent } from './verify-hash.component';

describe('VerifyHashComponent', () => {
  let component: VerifyHashComponent;
  let fixture: ComponentFixture<VerifyHashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyHashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyHashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
