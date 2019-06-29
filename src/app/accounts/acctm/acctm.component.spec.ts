import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcctmComponent } from './acctm.component';

describe('AcctmComponent', () => {
  let component: AcctmComponent;
  let fixture: ComponentFixture<AcctmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcctmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcctmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
