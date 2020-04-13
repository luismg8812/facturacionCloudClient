import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UsuarioModel } from '../model/usuario.model';
import { UsuarioService } from '../services/usuario.service';
import { EmpleadoModel } from '../model/empleado.model';
import { EmpleadoService } from '../services/empleado.service';
import { ClienteModel } from '../model/cliente.model';
import { ClienteService } from '../services/cliente.service';
import { TipoDocumentoModel } from '../model/tipoDocumento.model';
import { DocumentoService } from '../services/documento.service';
import { DocumentoModel } from '../model/documento.model';
import { ActivacionModel } from '../model/activacion';
import { DocumentoDetalleModel } from '../model/documentoDetalle.model';
import { DocumentoDetalleService } from '../services/documento-detalle.service';
import { ImpresoraEmpresaModel } from '../model/impresoraEmpresa.model';
import { EmpresaService } from '../services/empresa.service';
import { EmpresaModel } from '../model/empresa.model';
import { FacturaModel } from '../vo/factura.model';
import { ImpresionService } from '../services/impresion.service';
import { ConfiguracionModel } from '../model/configuracion.model';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-buscar-documentos',
  templateUrl: './buscar-documentos.component.html',
  styleUrls: ['./buscar-documentos.component.css']
})
export class BuscarDocumentosComponent implements OnInit {

  public usuarios: Array<UsuarioModel>;
  public empleados: Array<EmpleadoModel>;
  public clientes: Array<ClienteModel> = [];
  public tiposDocumento:Array<TipoDocumentoModel>;
  public documentos:Array<DocumentoModel>;
  public activaciones: Array<ActivacionModel>;
  public impresoraEmpresa: Array<ImpresoraEmpresaModel>;
  public itemsFactura: Array<DocumentoDetalleModel> = [];
  public tituloFactura: string = "";
  public empresaId: number;
  public documentoSelect: DocumentoModel= new DocumentoModel();
  public cambioFechaActivo: boolean = false;
  public anularFacturaActivo: boolean = false;
  public copiaFacturaActivo: boolean = false;
  public usuarioId: number;
  public factura: FacturaModel;
  public configuracion: ConfiguracionModel;

  readonly ANULAR_FACTURA: string = '6';
  readonly COPIA_FACTURA: string = '11';
  readonly CAMBIO_FECHA: string = '22';
  readonly TIPO_IMPRESION_PDFCARTA: number = 3;
  readonly TIPO_IMPRESION_TXT80MM: number = 1;
  readonly TIPO_IMPRESION_TXT50MM: number = 2;
  

  @ViewChild("tipoDocumento") tipoDocumento: ElementRef;
  @ViewChild("cajeroBuscar") cajeroBuscar: ElementRef;
  @ViewChild("empleadoBuscar") empleadoBuscar: ElementRef;
  @ViewChild("fechaIniBuscar") fechaIniBuscar: ElementRef;
  @ViewChild("fechaFinBuscar") fechaFinBuscar: ElementRef;
  @ViewChild("consecutivoDianBuscar") consecutivoDianBuscar: ElementRef;
  @ViewChild("internoBuscar") internoBuscar: ElementRef;
  @ViewChild("clientePV") clientePV: ElementRef;
  @ViewChild("proveedorBuscar") proveedorBuscar: ElementRef;
  @ViewChild("downloadZipLink") downloadZipLink: ElementRef;

  constructor(public usuarioService: UsuarioService,
    public empleadoService: EmpleadoService,
    public empresaService: EmpresaService,
    public impresionService: ImpresionService,
    public documentoDetalleService: DocumentoDetalleService,
    public documentoService:DocumentoService,
    public clienteService: ClienteService) { }

  ngOnInit() {
    this.empresaId = Number(localStorage.getItem("empresa_id"));
    this.usuarioId = Number(localStorage.getItem("usuario_id"));
    this.getUsuarios(this.empresaId);
    this.getEmpleados(this.empresaId);
    this.getclientes(this.empresaId);
    this.getTiposDocumento();
    this.getActivaciones(this.usuarioId);
    this.getImpresorasEmpresa(this.empresaId);
    this.factura = new FacturaModel();
  
  }


  imprimirCopia(documentoCopi:DocumentoModel) {
    this.documentoSelect=documentoCopi;
    let tipoImpresion = 0;
    for (var i = 0; i < this.impresoraEmpresa.length; i++) {
      if (this.documentoSelect.impresora == Number(this.impresoraEmpresa[i].numero_impresora)) {
        tipoImpresion = this.impresoraEmpresa[i].tipo_impresion_id;
      }
    }
    switch (this.documentoSelect.tipo_documento_id) {
      case 9:
        this.tituloFactura = "FACTURA DE VENTA.";
        break;
        case 10:
        this.tituloFactura = "FACTURA DE VENTA";
        break;
        case 4:
          this.tituloFactura = "No. DE COTIZACIÓN";
          break;
      default:
        break;
    }  
    this.empresaService.getEmpresaById(this.empresaId.toString()).subscribe(res => {
      this.documentoDetalleService.getDocumentoDetalleByDocumento(this.documentoSelect.documento_id).subscribe(res1 => {
        this.itemsFactura = res1;
        console.log("detalles encontrados:" + res.length);
     
      this.imprimirFactura(1, res[0], tipoImpresion);
    });
  });

  }

  imprimirFactura(numeroImpresiones: number, empresa: EmpresaModel, tipoImpresion: number) {
    console.log("entra a imprimir factura");
    let tituloDocumento: string = "";

    if (numeroImpresiones == undefined) {
      numeroImpresiones = 1;
    }
    
    tituloDocumento = this.tituloFactura + "_" + this.documentoSelect.consecutivo_dian + "_" + this.documentoSelect.impresora + "_false_" + numeroImpresiones + "_" + tipoImpresion;
    this.factura.documento = this.documentoSelect;
    this.factura.nombreTipoDocumento = this.tituloFactura;
    this.factura.detalle = this.itemsFactura
    this.factura.titulo = tituloDocumento;
    this.factura.empresa = empresa;
    this.factura.nombreUsuario = localStorage.getItem("nombreUsuario");
    this.factura.cliente = this.clientes.find(cliente => cliente.cliente_id == this.documentoSelect.cliente_id);
    for (var i = 0; i < numeroImpresiones; i++) {
      switch (tipoImpresion) {
        case this.TIPO_IMPRESION_TXT80MM:
          this.descargarArchivo(this.impresionService.imprimirFacturaTxt80(this.factura, this.configuracion), tituloDocumento + '.txt');
          break;
        case this.TIPO_IMPRESION_TXT50MM:
          this.descargarArchivo(this.impresionService.imprimirFacturaTxt50(this.factura, this.configuracion), tituloDocumento + '.txt');
          break;
      //  case "TXTCARTA":
      //    this.descargarArchivo(this.impresionService.imprimirFacturaTxtCarta(this.factura, this.configuracion), tituloDocumento + '.txt');
      //    break;
        case this.TIPO_IMPRESION_PDFCARTA:
          this.impresionService.imprimirFacturaPDFCarta(this.factura, this.configuracion);
          break;

        default:
          alert("no tiene un tipo impresion");
          //Impresion.imprimirPDF(getDocumento(), getProductos(), usuario(), configuracion, impresora,
          //    enPantalla, e);
          break;
      }
    }
  }

  closeModal(){
    $('#detalleDocumentoModal').modal('hide');
  }

  nombreClienteFun(id) {

    let cliente = this.clientes.find(cliente => cliente.cliente_id == id);
    if (cliente == undefined) {
      return "";
    } else {
      return cliente.nombre;
    }
  }

  

  detalleDocumento(documento:DocumentoModel){
    this.documentoSelect=documento;
    this.documentoDetalleService.getDocumentoDetalleByDocumento(documento.documento_id).subscribe(res => {
      this.itemsFactura = res;
      console.log("detalles encontrados:" + res.length);
    });
  }

  buscarDocumentos(){
    let tipoDocumento:string=this.tipoDocumento.nativeElement.value; 
    let cajeroBuscar:string=this.cajeroBuscar.nativeElement.value; 
    let empleadoBuscar:string=this.empleadoBuscar.nativeElement.value; 
    let fechaIniBuscar:string=this.fechaIniBuscar.nativeElement.value; 
    let fechaFinBuscar:string=this.fechaFinBuscar.nativeElement.value; 
    let consecutivoDianBuscar:string=this.consecutivoDianBuscar.nativeElement.value; 
    let internoBuscar:string=this.internoBuscar.nativeElement.value; 
    let clientePV:string=this.clientePV.nativeElement.value; 
    let proveedorBuscar:string=this.proveedorBuscar.nativeElement.value; 
    if(tipoDocumento==""){
      tipoDocumento="10";
    }
    let cliente1 = this.clientes.find(cliente => cliente.nombre == clientePV);
    let cliente_id="";
    if(cliente1!=undefined){
      cliente_id=cliente1.cliente_id.toString();
    }
    console.log(tipoDocumento);
      this.documentoService.getDocumentoByTipoAndFecha(tipoDocumento,cajeroBuscar,empleadoBuscar,fechaIniBuscar,fechaFinBuscar,
        consecutivoDianBuscar,internoBuscar,cliente_id,proveedorBuscar,this.empresaId).subscribe(res => {
        this.documentos = res;
      });
    
  }

  getActivaciones(user: number) {
    this.usuarioService.getActivacionByUsuario(user.toString()).subscribe(res => {
      this.activaciones = res;
      for (var e = 0; e < this.activaciones.length; e++) {
        if (this.activaciones[e].activacion_id == this.CAMBIO_FECHA) {
          console.log("cambio de fecha activo");
          this.cambioFechaActivo = true;
        }
        if (this.activaciones[e].activacion_id == this.ANULAR_FACTURA) {
          console.log("anular factura activo");
          this.anularFacturaActivo = true;
        }
        if (this.activaciones[e].activacion_id == this.COPIA_FACTURA) {
          console.log("copia factura activo");
          this.copiaFacturaActivo = true;
        }
      }
    });
  }

  getUsuarios(empresaId: number) {
    this.usuarioService.getByUsuario(null, empresaId.toString(), null).subscribe(res => {
      this.usuarios = res;
    });
  }

  getImpresorasEmpresa(empresaId: number) {
    this.clienteService.getImpresorasEmpresa(empresaId.toString()).subscribe(res => {
      this.impresoraEmpresa = res;
      console.log("impresoras configuradas en la empresa:" + res.length);
    });
  }

  getConfiguracion(empresaId: number) {
    this.clienteService.getConfiguracionByEmpresa(empresaId.toString()).subscribe(res => {
      this.configuracion = res[0];
    });
  }

  getEmpleados(empresaId: number) {
    this.empleadoService.getEmpleadoAll(empresaId).subscribe(res => {
      this.empleados = res;
      console.log("lista de empleados cargados: " + this.empleados.length);
    });
  }

  getclientes(empresaId: number) {
    this.clienteService.getClientesByEmpresa(empresaId.toString()).subscribe(res => {
      this.clientes = res;
      console.log("lista de clientes cargados: " + this.clientes.length);
    });
  }

  getTiposDocumento(){
    this.documentoService.getTiposDocumento().subscribe(res => {
      this.tiposDocumento = res;
    });
  }

  formatearNumber(number: number) {
    let formato: string = "";
    formato = new Intl.NumberFormat().format(number);
    return formato;
  }

  descargarArchivo(contenidoEnBlob, nombreArchivo) {
    const url = window.URL.createObjectURL(contenidoEnBlob);
    const link = this.downloadZipLink.nativeElement;
    link.href = url;
    link.download = nombreArchivo;
    link.click();
    window.URL.revokeObjectURL(url);
  }


}
