import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HojaDeVidaArticuloComponent } from './hoja-de-vida-articulo.component';

describe('HojaDeVidaArticuloComponent', () => {
  let component: HojaDeVidaArticuloComponent;
  let fixture: ComponentFixture<HojaDeVidaArticuloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HojaDeVidaArticuloComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HojaDeVidaArticuloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
