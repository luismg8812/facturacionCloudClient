import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AceptacionMercanciaComponent } from './aceptacion-mercancia.component';

describe('AceptacionMercanciaComponent', () => {
  let component: AceptacionMercanciaComponent;
  let fixture: ComponentFixture<AceptacionMercanciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AceptacionMercanciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AceptacionMercanciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
