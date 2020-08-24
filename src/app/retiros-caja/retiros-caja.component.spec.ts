import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetirosCajaComponent } from './retiros-caja.component';

describe('RetirosCajaComponent', () => {
  let component: RetirosCajaComponent;
  let fixture: ComponentFixture<RetirosCajaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetirosCajaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetirosCajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
