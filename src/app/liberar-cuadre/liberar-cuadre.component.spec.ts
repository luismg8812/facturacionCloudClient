import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiberarCuadreComponent } from './liberar-cuadre.component';

describe('LiberarCuadreComponent', () => {
  let component: LiberarCuadreComponent;
  let fixture: ComponentFixture<LiberarCuadreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiberarCuadreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiberarCuadreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
