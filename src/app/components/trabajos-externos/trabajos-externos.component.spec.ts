import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrabajosExternosComponent } from './trabajos-externos.component';

describe('TrabajosExternosComponent', () => {
  let component: TrabajosExternosComponent;
  let fixture: ComponentFixture<TrabajosExternosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrabajosExternosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrabajosExternosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
