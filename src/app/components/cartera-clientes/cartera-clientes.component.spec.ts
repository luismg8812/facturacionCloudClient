import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarteraClientesComponent } from './cartera-clientes.component';

describe('CarteraClientesComponent', () => {
  let component: CarteraClientesComponent;
  let fixture: ComponentFixture<CarteraClientesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarteraClientesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarteraClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
