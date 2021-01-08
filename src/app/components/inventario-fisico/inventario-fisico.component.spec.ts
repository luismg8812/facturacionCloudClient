import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventarioFisicoComponent } from './inventario-fisico.component';

describe('InventarioFisicoComponent', () => {
  let component: InventarioFisicoComponent;
  let fixture: ComponentFixture<InventarioFisicoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventarioFisicoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventarioFisicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
