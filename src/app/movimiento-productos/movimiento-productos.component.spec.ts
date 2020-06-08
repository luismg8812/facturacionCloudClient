import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MovimientoProductosComponent } from './movimiento-productos.component';

describe('MovimientoProductosComponent', () => {
  let component: MovimientoProductosComponent;
  let fixture: ComponentFixture<MovimientoProductosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MovimientoProductosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovimientoProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
