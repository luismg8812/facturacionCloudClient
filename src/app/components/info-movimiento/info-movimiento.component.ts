import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ClienteModel } from "src/app/model/cliente.model";
import { DetalleNominaModel } from "src/app/model/detalleNomina.model";
import { DocumentoModel } from "src/app/model/documento.model";
import { EmpleadoModel } from "src/app/model/empleado.model";
import { ResolucionEmpresaModel } from "src/app/model/resolucionEmpresa.model";
import { TipoDocumentoModel } from "src/app/model/tipoDocumento.model";
import { UsuarioModel } from "src/app/model/usuario.model";
import { CalculosService } from "src/app/services/calculos.service";
import { ClienteService } from "src/app/services/cliente.service";
import { DocumentoService } from "src/app/services/documento.service";
import { EmpleadoService } from "src/app/services/empleado.service";
import { EmpresaService } from "src/app/services/empresa.service";
import { ImpresionService } from "src/app/services/impresion.service";
import { UsuarioService } from "src/app/services/usuario.service";

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
  public detalles: Array<DocumentoModel>;
  public empresaId: number;
  public dias: Array<any>;
  public total: number = 0;
  public gravable_5: number = 0;
  public gravable_19: number = 0;
  public iva_5: number = 0;
  public iva_19: number = 0;
  public exento: number = 0;
  public clientes: Array<ClienteModel> = [];
  public resolucionAll: Array<ResolucionEmpresaModel>;

  @ViewChild("fechaIni") fechaIni: ElementRef;
  @ViewChild("fechaFin") fechaFin: ElementRef;
  @ViewChild("tipoDocumento") tipoDocumento: ElementRef;
  @ViewChild("empleadoPV") empleadoPV: ElementRef;
  @ViewChild("usuariosPV") usuariosPV: ElementRef;
   @ViewChild("autorizacion") autorizacion: ElementRef;
  

  constructor(public documentoService: DocumentoService,
    public usuarioService: UsuarioService,
    public empleadoService: EmpleadoService,
    public clienteService:ClienteService,
    public impresionService: ImpresionService,
    public empresaService: EmpresaService,
    public calculosService: CalculosService) { }

     
  ngOnInit() { 
    this.empresaId = Number(localStorage.getItem("empresa_id"));
    this.asignarFechas();
    this.getTiposDocumento();
    this.getUsuarios(this.empresaId);
    this.getEmpleados(this.empresaId);
    this.getclientes(this.empresaId);
    this.getResolucion();
  }

  asignarFechas() {

  }

  cargarDetalle(detalle){
    let fechaInicial:string=this.calculosService.fechaIniBusquedaDate( detalle.fecha);
    let fechaFinal:string=this.calculosService.fechaFinBusquedaDate( detalle.fecha);
 console.log(fechaInicial);
 console.log(fechaFinal);
    this.documentoService.getDocumentosByFechaAndTipoDetalle(fechaInicial, fechaFinal,
      this.empleadoPV.nativeElement.value, this.tipoDocumento.nativeElement.value,
      this.usuariosPV.nativeElement.value, this.empresaId
    ).subscribe(res => {
      this.detalles = res;
      
    });
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
      ini = this.calculosService.fechaIniBusqueda(this.fechaIni.nativeElement.value);
      fin = this.calculosService.fechaFinBusqueda(this.fechaFin.nativeElement.value);
    } else {
      let date: Date = new Date();
      date.setDate(1);
      ini = date.toLocaleString();
      date.setDate(30);
      fin = date.toLocaleString();
    }
    this.documentoService.getDocumentosByFechaAndTipo(ini, fin,
      this.empleadoPV.nativeElement.value, this.tipoDocumento.nativeElement.value,
      this.usuariosPV.nativeElement.value, this.empresaId, this.autorizacion.nativeElement.value
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

  getclientes(empresaId: number) {
    this.clienteService.getClientesByEmpresa(empresaId.toString()).subscribe(res => {
      this.clientes = res;
      console.log("lista de clientes cargados: " + this.clientes.length);
    });
  }

  nombreClienteFun(id) {

    let cliente = this.clientes.find(cliente => cliente.cliente_id == id);
    if (cliente == undefined) {
      return "";
    } else {
      return cliente.nombre+" "+cliente.apellidos+" "+cliente.razon_social;
    }
  }  

  getResolucion() {
    this.clienteService.getResolucion(this.empresaId).subscribe(res => {
      this.resolucionAll = res;
      console.log("resoluciones:" + this.resolucionAll.length);
    });
  }

}
