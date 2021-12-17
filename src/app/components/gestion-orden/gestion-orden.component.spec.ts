import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionOrdenComponent } from './gestion-orden.component';

describe('GestionOrdenComponent', () => {
  let component: GestionOrdenComponent;
  let fixture: ComponentFixture<GestionOrdenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionOrdenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionOrdenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
