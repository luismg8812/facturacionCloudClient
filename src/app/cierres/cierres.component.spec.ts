import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CierresComponent } from './cierres.component';

describe('CierresComponent', () => {
  let component: CierresComponent;
  let fixture: ComponentFixture<CierresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CierresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CierresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
