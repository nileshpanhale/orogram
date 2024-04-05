import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateContractClosedComponent } from './create-contract-closed.component';

describe('CreateContractClosedComponent', () => {
  let component: CreateContractClosedComponent;
  let fixture: ComponentFixture<CreateContractClosedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateContractClosedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateContractClosedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
