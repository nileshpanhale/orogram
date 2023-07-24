import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMapContractComponent } from './create-map-contract.component';

describe('CreateMapContractComponent', () => {
  let component: CreateMapContractComponent;
  let fixture: ComponentFixture<CreateMapContractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateMapContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMapContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
