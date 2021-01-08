import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoMovimientoComponent } from './info-movimiento.component';

describe('InfoMovimientoComponent', () => {
  let component: InfoMovimientoComponent;
  let fixture: ComponentFixture<InfoMovimientoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoMovimientoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoMovimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
