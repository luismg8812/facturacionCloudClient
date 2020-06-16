import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoGananciaComponent } from './info-ganancia.component';

describe('InfoGananciaComponent', () => {
  let component: InfoGananciaComponent;
  let fixture: ComponentFixture<InfoGananciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoGananciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoGananciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
