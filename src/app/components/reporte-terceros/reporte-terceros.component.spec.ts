import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteTercerosComponent } from './reporte-terceros.component';

describe('ReporteTercerosComponent', () => {
  let component: ReporteTercerosComponent;
  let fixture: ComponentFixture<ReporteTercerosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteTercerosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteTercerosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
