import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarteraProveedoresComponent } from './cartera-proveedores.component';

describe('CarteraProveedoresComponent', () => {
  let component: CarteraProveedoresComponent;
  let fixture: ComponentFixture<CarteraProveedoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarteraProveedoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarteraProveedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
