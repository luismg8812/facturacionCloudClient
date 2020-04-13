import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvioDocumentosComponent } from './envio-documentos.component';

describe('EnvioDocumentosComponent', () => {
  let component: EnvioDocumentosComponent;
  let fixture: ComponentFixture<EnvioDocumentosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnvioDocumentosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvioDocumentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
