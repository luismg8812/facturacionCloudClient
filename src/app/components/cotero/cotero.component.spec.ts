import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoteroComponent } from './cotero.component';

describe('CoteroComponent', () => {
  let component: CoteroComponent;
  let fixture: ComponentFixture<CoteroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoteroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoteroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
