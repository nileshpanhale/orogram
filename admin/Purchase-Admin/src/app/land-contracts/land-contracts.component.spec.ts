import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandContractsComponent } from './land-contracts.component';

describe('LandContractsComponent', () => {
  let component: LandContractsComponent;
  let fixture: ComponentFixture<LandContractsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandContractsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
