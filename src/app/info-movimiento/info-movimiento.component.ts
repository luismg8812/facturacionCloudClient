import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TipoDocumentoModel } from '../model/tipoDocumento.model';
import { DocumentoService } from '../services/documento.service';
import { UsuarioService } from '../services/usuario.service';
import { UsuarioModel } from '../model/usuario.model';
import { EmpleadoModel } from '../model/empleado.model';
import { EmpleadoService } from '../services/empleado.service';
import { CalculosService } from '../services/calculos.service';
import { ImpresionService } from '../services/impresion.service';
import { EmpresaService } from '../services/empresa.service';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-info-movimiento',
  templateUrl: './info-movimiento.component.html',
  styleUrls: ['./info-movimiento.component.css']
})
export class InfoMovimientoComponent implements OnInit {


  public tiposDocumento: Array<TipoDocumentoModel>;
  public usuarios: Array<UsuarioModel>;
  public empleados: Array<EmpleadoModel>;
  public empresaId: number;
  public dias: Array<any>;
  public total: number = 0;
  public gravable_5: number = 0;
  public gravable_19: number = 0;
  public iva_5: number = 0;
  public iva_19: number = 0;
  public exento: number = 0;

  @ViewChild("fechaIni") fechaIni: ElementRef;
  @ViewChild("fechaFin") fechaFin: ElementRef;
  @ViewChild("tipoDocumento") tipoDocumento: ElementRef;
  @ViewChild("empleadoPV") empleadoPV: ElementRef;
  @ViewChild("usuariosPV") usuariosPV: ElementRef;
  

  constructor(public documentoService: DocumentoService,
    public usuarioService: UsuarioService,
    public empleadoService: EmpleadoService,
    public impresionService: ImpresionService,
    public empresaService: EmpresaService,
    public calculosService: CalculosService) { }

     
  ngOnInit() { 
    this.empresaId = Number(localStorage.getItem("empresa_id"));
    this.asignarFechas();
    this.getTiposDocumento();
    this.getUsuarios(this.empresaId);
    this.getEmpleados(this.empresaId);
  }

  asignarFechas() {

  }

  

  calcular() {
    this.total = 0;
    this.gravable_5 = 0;
    this.gravable_19 = 0;
    this.iva_5 = 0;
    this.iva_19 = 0;
    this.exento = 0;
    let ini: string = this.fechaIni.nativeElement.value;
    let fin: string = this.fechaFin.nativeElement.value;
    if (ini != '' && fin != '') {
      ini = this.calculosService.fechaInicial1(this.fechaIni.nativeElement.value).toLocaleString();
      fin = this.calculosService.fechaFinal1(this.fechaFin.nativeElement.value).toLocaleString();
    } else {
      let date: Date = new Date();
      date.setDate(1);
      ini = date.toLocaleString();
      date.setDate(30);
      fin = date.toLocaleString();
    }
    this.documentoService.getDocumentosByFechaAndTipo(ini, fin,
      this.empleadoPV.nativeElement.value, this.tipoDocumento.nativeElement.value,
      this.usuariosPV.nativeElement.value, this.empresaId
    ).subscribe(res => {
      this.dias = res;
      for (let dia of this.dias) {
        this.total = Number(this.total) + Number(dia.total);
        this.gravable_5 = Number(this.gravable_5) + Number(dia.base_5);
        this.gravable_19 = Number(this.gravable_19) + Number(dia.base_19);
        this.iva_5 = Number(this.iva_5) + Number(dia.iva_5);
        this.iva_19 = Number(this.iva_19) + Number(dia.iva_19);
        this.exento = Number(this.exento) + Number(dia.excento);
      }
    });
  }

  formatearNumber(number: number) {
    let formato: string = "";
    formato = new Intl.NumberFormat().format(number);
    return formato;
  }

  getTiposDocumento() {
    this.documentoService.getTiposDocumento().subscribe(res => {
      this.tiposDocumento = res;
    });
  }

  getUsuarios(empresaId: number) {
    this.usuarioService.getByUsuario(null, empresaId.toString(), null).subscribe(res => {
      this.usuarios = res;
    });
  }
  getEmpleados(empresaId: number) {
    this.empleadoService.getEmpleadoAll(empresaId).subscribe(res => {
      this.empleados = res;
    });
  }

  

}
