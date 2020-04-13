import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { EmpleadoModel } from '../model/empleado.model';
import { EmpleadoService } from '../services/empleado.service';
import { DocumentoModel } from '../model/documento.model';
import { CalculosService } from '../services/calculos.service';
import { DocumentoService } from '../services/documento.service';
import { ProductoEmpleadoModel } from '../model/productoEmpleado.model';
import { PagosEmpleadoModel } from '../model/pagosEmpleado.model';
import { NominaModel } from '../model/nomina.model';
import { ImpresoraEmpresaModel } from '../model/impresoraEmpresa.model';
import { ClienteService } from '../services/cliente.service';
import { ImpresionService } from '../services/impresion.service';
import { DetalleNominaModel } from '../model/detalleNomina.model';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-nomina',
  templateUrl: './nomina.component.html',
  styleUrls: ['./nomina.component.css']
})
export class NominaComponent implements OnInit {

  readonly TIPO_DOCUMENTO_VALE: number = 8;
  readonly TIPO_IMPRESION_PDFCARTA: number = 3;
  readonly TIPO_IMPRESION_TXT80MM: number = 1;
  readonly TIPO_IMPRESION_TXT50MM: number = 2;

  public empleados: Array<EmpleadoModel>;
  public pagosEmpleados: Array<PagosEmpleadoModel>;
  public nomimas: Array<NominaModel>;
  public subtotal: number = 0;
  public vales: number = 0;
  public productos: number = 0;
  public total: number = 0;
  public impresoraEmpresa: Array<ImpresoraEmpresaModel>;
  //detalle
  public empleadoSelect: EmpleadoModel = new EmpleadoModel();
  public totalSelect: number;
  public ordenesSelect: Array<DocumentoModel>;
  public valesSelect: Array<DocumentoModel>;
  public productosSelect: Array<ProductoEmpleadoModel>;
  public nominaSelect: NominaModel;

  public empresaId: number;
  public usuarioId: number;
  //vales
  @ViewChild("empleadoPV") empleadoPV: ElementRef;
  @ViewChild("valorVale") valorVale: ElementRef;
  @ViewChild("conceptoVale") conceptoVale: ElementRef;

  //producto
  @ViewChild("empleadoProductoPV") empleadoProductoPV: ElementRef;
  @ViewChild("valorProducto") valorProducto: ElementRef;
  @ViewChild("conceptoProducto") conceptoProducto: ElementRef;

  //configuracion
  @ViewChild("sueldo") sueldo: ElementRef;
  @ViewChild("porcentajePago") porcentajePago: ElementRef;
  @ViewChild("empleadoConfiguracionPV") empleadoConfiguracionPV: ElementRef;
  @ViewChild("pagoPV") pagoPV: ElementRef;
  @ViewChild("ahorro") ahorro: ElementRef;
  @ViewChild("pagoAdmin") pagoAdmin: ElementRef;

  @ViewChild("fechaIni") fechaIni: ElementRef;
  @ViewChild("fechaFin") fechaFin: ElementRef;
  @ViewChild("downloadZipLink") downloadZipLink: ElementRef;


  constructor(public empleadoService: EmpleadoService,
    public calculosService: CalculosService,
    public documentoService: DocumentoService,
    public clienteService: ClienteService,
    public impresionService: ImpresionService) { }

  ngOnInit() {
    this.empresaId = Number(localStorage.getItem("empresa_id"));
    this.usuarioId = Number(localStorage.getItem("usuario_id"));
    this.getEmpleados();
    this.getPagos();
    this.getImpresorasEmpresa(this.empresaId);
    this.nominaDefaul();
    

  }

  detalleSelect(detalle: NominaModel) {
    this.nominaSelect = detalle;
    this.detalleNomina(this.nominaSelect);
  }

  imprimirDetalle(impresora) {
    if (impresora.value == "") {
      impresora.value = 1;
    }
    let tipoImpresion = 0;
    for (var i = 0; i < this.impresoraEmpresa.length; i++) {
      if (impresora.value == this.impresoraEmpresa[i].numero_impresora) {
        tipoImpresion = this.impresoraEmpresa[i].tipo_impresion_id;
      }
    }
    if (tipoImpresion == 0) {
      alert("No existen impresoras configuradas para la empresa");
      return;
    }
    console.log(tipoImpresion);
    let detalleNomina: DetalleNominaModel = new DetalleNominaModel();
    let empleado1 = this.empleados.find(empleado => empleado.empleado_id == this.nominaSelect.empleado_id);
    detalleNomina.empleado = empleado1;
    detalleNomina.nomina = this.nominaSelect;
    detalleNomina.vales = this.valesSelect;
    detalleNomina.productos = this.productosSelect;
    detalleNomina.ordenes = this.ordenesSelect;
    let tituloDocumento = "detalle_nomina" + "_" + impresora.value + "_" + tipoImpresion;
    switch (tipoImpresion) {

      case this.TIPO_IMPRESION_TXT50MM:
        this.descargarArchivo(this.impresionService.imprimirNominaTxt50(detalleNomina), tituloDocumento + '.txt');
        break;

      default:
        alert("no tiene un tipo impresion");
        //Impresion.imprimirPDF(getDocumento(), getProductos(), usuario(), configuracion, impresora,
        //    enPantalla, e);
        break;
    }
  }

  cierre() {
    this.documentoService.cierreNomina().subscribe(res => {
      if (res.code == 200) {
        $('#cierreModal').modal('hide');
      } else {
        alert("Algo salio mal modificando el empleado... Comunicate con soporte");
        return;
      }
      this.nominaDefaul();
    });

  }

  buscarporFecha() {
    if (this.fechaIni.nativeElement.value == "" || this.fechaFin.nativeElement.value == "") {
      alert("La fecha inicial y la final son obligatorias");
      return;
    }
    let idEmpleados: number[] = [];
    for (let id of this.empleados) {
      idEmpleados.push(id.empleado_id);
    }
    this.nomimas = [];
    this.subtotal = 0;
    this.vales = 0;
    this.productos = 0;
    this.total = 0;
    this.documentoService.getNominaByEmpleado(this.calculosService.fechaInicial1(this.fechaIni.nativeElement.value).toLocaleString(), this.calculosService.fechaFinal1(this.fechaFin.nativeElement.value).toLocaleString(), idEmpleados).subscribe(res => {
      this.nomimas = res;
      for (let nomi of this.nomimas) {
        this.subtotal = Number(this.subtotal) + Number(nomi.subtotal);
        this.vales = Number(this.vales) + Number(nomi.vales);
        this.productos = Number(this.productos) + Number(nomi.productos);
        this.total = Number(this.total) + Number(nomi.total)
      }
    });
  }

  detalleNomina(nomina: NominaModel) {

    this.empleadoSelect = this.empleados.find(empleado => empleado.empleado_id == nomina.empleado_id);
    this.totalSelect = nomina.total;
    let tipo_docu = 11;// se trae las ordenes de los empleados
    //agregar las fechas cuando ya se tengan
    let ini: string = this.fechaIni.nativeElement.value;
    let fin: string = this.fechaFin.nativeElement.value;
    if (ini != '' && fin != '') {
      ini = this.calculosService.fechaInicial1(this.fechaIni.nativeElement.value).toLocaleString();
      fin = this.calculosService.fechaFinal1(this.fechaFin.nativeElement.value).toLocaleString();
    } else {
      ini = "";
      fin = "";
    }

    this.documentoService.getOrdenesByEmpleado(nomina.empleado_id, ini, fin, tipo_docu).subscribe(res => {
      this.ordenesSelect = res;
    });
    tipo_docu = 8;// se trae las vales de los empleados
    this.documentoService.getOrdenesByEmpleado(nomina.empleado_id, ini, fin, tipo_docu).subscribe(res => {
      this.valesSelect = res;
    });
    this.empleadoService.getProductoEmpleadoByEmpleado(nomina.empleado_id, ini, fin).subscribe(res => {
      this.productosSelect = res;
    });

  }

  nominaDefaul() {
    this.empleadoService.getEmpleadoAll(this.empresaId).subscribe(res => {
      this.empleados = res;
    let idEmpleados: number[] = [];
    for (let id of this.empleados) {
      idEmpleados.push(id.empleado_id);
    }
    this.nomimas = [];
    this.subtotal = 0;
    this.vales = 0;
    this.productos = 0;
    this.total = 0;
    this.documentoService.getNominaByEmpleado("", "", idEmpleados).subscribe(res => {
      this.nomimas = res;
      for (let nomi of this.nomimas) {
        this.subtotal = Number(this.subtotal) + Number(nomi.subtotal);
        this.vales = Number(this.vales) + Number(nomi.vales);
        this.productos = Number(this.productos) + Number(nomi.productos);
        this.total = Number(this.total) + Number(nomi.total)
      }
    });
  });
  }

  guardarConfiguracion() {
    let valido: boolean = true;
    let mensageError: string = "Son obligatorios:\n ";
    if (this.empleadoConfiguracionPV.nativeElement.value == "") {
      mensageError += "empleado\n";
      valido = false;
    }
    if (this.pagoPV.nativeElement.value == "") {
      mensageError += "Tipo pago\n";
      valido = false;
    }
    switch (this.pagoPV.nativeElement.value) {
      case '1':
        if (this.sueldo.nativeElement.value == "") {
          mensageError += "sueldo\n";
          valido = false;
        }
        break;
      case '2':
        if (this.porcentajePago.nativeElement.value == "") {
          mensageError += "% pago\n";
          valido = false;
        }
        break;
      case '3':
        if (this.porcentajePago.nativeElement.value == "") {
          mensageError += "% pago\n";
          valido = false;
        }
        if (this.sueldo.nativeElement.value == "") {
          mensageError += "sueldo\n";
          valido = false;
        }
        break;
      default:
        break;
    }
    if (valido == false) {
      alert(mensageError);
      return;
    }
    let empleado = this.empleados.find(empleado => empleado.nombre == this.empleadoConfiguracionPV.nativeElement.value);
    if (empleado == undefined) {
      alert("El Empleado no existe: debe crear empleados");
      return;
    }
    empleado.pago_empleado_id = this.pagoPV.nativeElement.value;
    switch (this.pagoPV.nativeElement.value) {
      case '1':
        empleado.sueldo = this.sueldo.nativeElement.value;
        break;
      case '2':
        empleado.porcentaje_pago = this.porcentajePago.nativeElement.value;
        break;
      case '3':
        empleado.sueldo = this.sueldo.nativeElement.value;
        empleado.porcentaje_pago = this.porcentajePago.nativeElement.value;
        break;
      default:
        break;
    }
    empleado.pago_admin = this.pagoAdmin.nativeElement.value;
    empleado.porcentaje_descuento = this.ahorro.nativeElement.value;
    this.empleadoService.updateEmpleado(empleado).subscribe(res => {
      if (res.code == 200) {
        $('#configuracionModal').modal('hide');
      } else {
        alert("Algo salio mal modificando el empleado... Comunicate con soporte");
        return;
      }
    });
  }

  tipoPagoSelect(tipoPago) {
    console.log(tipoPago.value);
    switch (tipoPago.value) {
      case '1':
        this.sueldo.nativeElement.disabled = false;
        this.porcentajePago.nativeElement.disabled = true;
        break;
      case '2':
        this.sueldo.nativeElement.disabled = true;
        this.porcentajePago.nativeElement.disabled = false;
        break;
      case '3':
        this.sueldo.nativeElement.disabled = false;
        this.porcentajePago.nativeElement.disabled = false;
        break;

      default:
        this.sueldo.nativeElement.disabled = true;
        this.porcentajePago.nativeElement.disabled = true;
        break;
    }
  }

  crearVale() {
    let valido: boolean = true;
    let mensageError: string = "Son obligatorios:\n ";
    if (this.empleadoPV.nativeElement.value == "") {
      mensageError += "empleado\n";
      valido = false;
    }
    if (this.valorVale.nativeElement.value == "") {
      mensageError += "valor vale\n";
      valido = false;
    }
    if (valido == false) {
      alert(mensageError);
      return;
    }
    let empleado = this.empleados.find(empleado => empleado.nombre == this.empleadoPV.nativeElement.value);
    if (empleado == undefined) {
      alert("El Empleado no existe: debe crear empleados");
      return;
    }
    let vale: DocumentoModel = new DocumentoModel();
    vale.tipo_documento_id = this.TIPO_DOCUMENTO_VALE;
    vale.fecha_registro = this.calculosService.fechaActual();
    vale.total = this.valorVale.nativeElement.value;
    vale.empleado_id = empleado.empleado_id;
    vale.descripcion_trabajador = this.conceptoVale.nativeElement.value;
    vale.empresa_id = this.empresaId;
    vale.usuario_id = this.usuarioId;
    vale.invoice = 1;
    this.documentoService.saveDocumento(vale).subscribe(res => {
      if (res.code == 200) {
        $('#valeModal').modal('hide');
      } else {
        alert("error creando vale, por favor inicie nuevamente la creación del documento, si persiste consulte a su proveedor");
        return;
      }
    });
  }

  asociarProducto() {
    let valido: boolean = true;
    let mensageError: string = "Son obligatorios:\n ";
    if (this.empleadoProductoPV.nativeElement.value == "") {
      mensageError += "empleado\n";
      valido = false;
    }
    if (this.valorProducto.nativeElement.value == "") {
      mensageError += "valor producto\n";
      valido = false;
    }
    if (this.conceptoProducto.nativeElement.value == "") {
      mensageError += "Concepto producto\n";
      valido = false;
    }
    if (valido == false) {
      alert(mensageError);
      return;
    }
    let empleado = this.empleados.find(empleado => empleado.nombre == this.empleadoProductoPV.nativeElement.value);
    if (empleado == undefined) {
      alert("El Empleado no existe: debe crear empleados");
      return;
    }
    let productoEmpleado: ProductoEmpleadoModel = new ProductoEmpleadoModel();
    productoEmpleado.empleado_id = empleado.empleado_id;
    productoEmpleado.fecha_registro = this.calculosService.fechaActual();
    productoEmpleado.concepto_producto = this.conceptoProducto.nativeElement.value
    productoEmpleado.valor = this.valorProducto.nativeElement.value;
    this.empleadoService.saveProductoEmpleado(productoEmpleado).subscribe(res => {
      if (res.code == 200) {
        $('#productoModal').modal('hide');
      } else {
        alert("Algo salio mal Creando el producto... Comunicate con soporte");
        return;
      }
    });
  }

  getEmpleados() {
    this.empleadoService.getEmpleadoAll(this.empresaId).subscribe(res => {
      this.empleados = res;
    });
  }

  getPagos() {
    this.empleadoService.getPagosEmpleadosAll().subscribe(res => {
      this.pagosEmpleados = res;
    });
  }

  getImpresorasEmpresa(empresaId: number) {
    this.clienteService.getImpresorasEmpresa(empresaId.toString()).subscribe(res => {
      this.impresoraEmpresa = res;
      console.log("impresoras configuradas en la empresa:" + res.length);
    });
  }

  descargarArchivo(contenidoEnBlob, nombreArchivo) {
    const url = window.URL.createObjectURL(contenidoEnBlob);
    const link = this.downloadZipLink.nativeElement;
    link.href = url;
    link.download = nombreArchivo;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  formatearNumber(number: number) {
    let formato: string = "";
    formato = new Intl.NumberFormat().format(number);
    return formato;
  }
}
