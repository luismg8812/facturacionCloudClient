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
import { ProductoModel } from '../model/producto.model';
import { ProductoService } from '../services/producto.service';
import { CalculosService } from '../services/calculos.service';
import { DocumentoInvoiceModel } from '../model/documentoInvoice.model';
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
  public tiposDocumento: Array<TipoDocumentoModel>;
  public documentos: Array<DocumentoModel>;
  public activaciones: Array<ActivacionModel>;
  public impresoraEmpresa: Array<ImpresoraEmpresaModel>;
  public itemsFactura: Array<DocumentoDetalleModel> = [];
  public tituloFactura: string = "";
  public empresaId: number;
  public documentoSelect: DocumentoModel = new DocumentoModel();
  public cambioFechaActivo: boolean = false;
  public anularFacturaActivo: boolean = false;
  public copiaFacturaActivo: boolean = false;
  public usuarioId: number;
  public factura: FacturaModel;
  public configuracion: ConfiguracionModel;
  public productoIdSelect: ProductoModel=undefined;
  public productosAll: Array<ProductoModel>;

  readonly ANULAR_FACTURA: string = '6';
  readonly COPIA_FACTURA: string = '11';
  readonly CAMBIO_FECHA: string = '22';
  readonly TIPO_IMPRESION_PDFCARTA: number = 3;
  readonly TIPO_IMPRESION_TXT80MM: number = 1;
  readonly TIPO_IMPRESION_TXT50MM: number = 2;

  readonly NOTA_CREDITO: number = 12;
  readonly NOTA_DEBITO: number = 13;
  readonly INVOICE_SIN_ENVIAR: number = 1;

  


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
    public productoService: ProductoService,
    public calculosService: CalculosService,
    public documentoDetalleService: DocumentoDetalleService,
    public documentoService: DocumentoService,
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
    this.getProductosByEmpresa(this.empresaId);
    this.factura = new FacturaModel();

  }

  confirmarNota(observacion){
    let newDocu:DocumentoModel=this.documentoSelect;
    if(observacion.value==""){
      alert("La descripción del error es obligatoria");
      return;
    }
    this.documentoService.getByDocumentoId(this.documentoSelect.documento_id).subscribe(res => {
      if(newDocu.total==res[0].total){
        alert("Los valores totales de la factura y de la nota son iguales, por lo cual no se creará la Nota");
        return;
      }
      newDocu.descripcion_trabajador=observacion.value;
      newDocu.fecha_registro=new Date();
      newDocu.usuario_id = this.usuarioId;
      newDocu.invoice_id=this.INVOICE_SIN_ENVIAR;
      newDocu.cufe="";
      if(newDocu.total<res[0].total){
        newDocu.tipo_documento_id=this.NOTA_CREDITO;
      }else{
        newDocu.tipo_documento_id=this.NOTA_DEBITO;
      }
      this.documentoService.saveDocumento(newDocu).subscribe(res => {
        if (res.code == 200) {
          newDocu.documento_id = res.documento_id;
          let documentoInvoice: DocumentoInvoiceModel = new DocumentoInvoiceModel()
          documentoInvoice.documento_id = res.documento_id;
          documentoInvoice.fecha_registro = new Date();
          documentoInvoice.invoice_id = this.INVOICE_SIN_ENVIAR;
          this.documentoService.saveInvoice(documentoInvoice).subscribe(res => {
            if (res.code == 200) {
              console.log("Se agrega estado para facturación electrónica");
            } else {
              alert("error creando documento, por favor inicie nuevamente la creación del documento, si persiste consulte a su proveedor");
              return;
            }
          });
          for(let deta of this.itemsFactura){
            deta.documento_id=newDocu.documento_id;
            this.documentoDetalleService.saveDocumentoDetalle(deta).subscribe(res => {
              if (res.code != 200) {
                alert("Error agregando producto: " + res.error);
              }
            }); 
          }
          $('#notaModal').modal('hide');
        } else {
          alert("error creando documento, por favor inicie nuevamente la creación del documento");
          return;
        }
      });
    });
  }

  cerrarNota(){
    $('#notaModal').modal('hide');
  }

  adjuntarProducto(cantidad) {
    if (this.productoIdSelect == undefined) {
      alert("Debe seleccionar un articulo primero");
      return;
    }
    if(cantidad.value==""){
      alert("Debe seleccionar la cantidad primero");
      return;
    }
    this.asignarDocumentoDetalle(cantidad.value, this.productoIdSelect.costo_publico);
  }

  cambioCantidad(cantidad){
    if (isNaN(cantidad.value)) {
      console.log("no es numérico:" + cantidad.value);
      return; 
    }
    if (cantidad.value<0) {
      console.log("la cantidad no puede ser negativa:" + cantidad.value);
      return;
    }
    let id=cantidad.id.toString().replace("c_", "");
    for(let i=0; i<this.itemsFactura.length; i++){
      if(this.itemsFactura[i].documento_detalle_id.toString()==id){
        this.itemsFactura[i].cantidad=cantidad.value;
        this.itemsFactura[i].parcial=Number(cantidad.value)*this.itemsFactura[i].unitario;
        this.documentoSelect = this.calculosService.calcularExcento(this.documentoSelect, this.itemsFactura);
        break;
      }
    }
  }

  borrarItem(borrar){
    let id=borrar.id.toString().replace("d_", "");
    for(let i=0; i<this.itemsFactura.length; i++){
      if(this.itemsFactura[i].documento_detalle_id.toString()==id){
        this.itemsFactura.splice(i, 1);
        this.documentoSelect = this.calculosService.calcularExcento(this.documentoSelect, this.itemsFactura);
        break;
      }
    }
  }

  cambioUnitario(unitario){
    if (isNaN(unitario.value)) {
      alert("no es numérico:" + unitario.value);
      return;
    }
    if (unitario.value<0) {
      alert("el valor unitario no puede ser negativa:" + unitario.value);
      return;
    }
    let id=unitario.id.toString().replace("u_", "");
    for(let i=0; i<this.itemsFactura.length; i++){
      if(this.itemsFactura[i].documento_detalle_id.toString()==id){
        this.itemsFactura[i].unitario=unitario.value;
        this.itemsFactura[i].parcial=Number(unitario.value)*this.itemsFactura[i].cantidad;
        this.documentoSelect = this.calculosService.calcularExcento(this.documentoSelect, this.itemsFactura);
        break;
      }
    }
  }

  private asignarDocumentoDetalle(cantidad: number, costo_publico: number) {
    let docDetalle = new DocumentoDetalleModel();
    docDetalle.cantidad = cantidad;
    docDetalle.impuesto_producto = Number(this.productoIdSelect.impuesto);
    docDetalle.peso_producto = Number(this.productoIdSelect.peso);
    docDetalle.producto_id = this.productoIdSelect.producto_id;
    docDetalle.documento_id = this.documentoSelect.documento_id;
    docDetalle.descripcion = this.productoIdSelect.nombre;
    docDetalle.costo_producto = this.productoIdSelect.costo;
    docDetalle.fecha_registro = new Date;
    docDetalle.estado = 1;
    //se valida promocion
    if (this.calculosService.validarPromo(this.productoIdSelect, cantidad)) {
      let precioPromo: number = this.productoIdSelect.pub_promo;
      let cantidadPromo: number = this.productoIdSelect.kg_promo;
      let unitarioPromo: number = precioPromo / cantidadPromo;
      docDetalle.parcial = cantidad * unitarioPromo;
      docDetalle.unitario = unitarioPromo;
    } else {
      if (cantidad != null && costo_publico != null) {
        docDetalle.parcial = cantidad * costo_publico;
        docDetalle.unitario = costo_publico;
      } else {
        docDetalle.parcial = 0;
        docDetalle.unitario = 0;
      }
    }
    console.log(docDetalle);  
      this.itemsFactura.unshift(docDetalle);
      this.documentoSelect = this.calculosService.calcularExcento(this.documentoSelect, this.itemsFactura);
      let newCantidad: number = this.productoIdSelect.cantidad;
      this.productoIdSelect.cantidad = newCantidad - docDetalle.cantidad;
      //this.restarCantidadesSubProducto(docDetalle); 
  }

  articuloSelect(element) {
    console.log("articulo select:" + element.value);
    let productoNombre: string = element.value;
    this.productoIdSelect = this.productosAll.find(product => product.nombre === productoNombre);
    console.log(this.productoIdSelect);
  }


  imprimirCopia(documentoCopi: DocumentoModel) {
    this.documentoSelect = documentoCopi;
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

  closeModal() {
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



  detalleDocumento(documento: DocumentoModel) {
    this.documentoSelect = documento;
    this.documentoDetalleService.getDocumentoDetalleByDocumento(documento.documento_id).subscribe(res => {
      this.itemsFactura = res;
      console.log("detalles encontrados:" + res.length);
    });
  }

  buscarDocumentos() {
    let tipoDocumento: string = this.tipoDocumento.nativeElement.value;
    let cajeroBuscar: string = this.cajeroBuscar.nativeElement.value;
    let empleadoBuscar: string = this.empleadoBuscar.nativeElement.value;
    let fechaIniBuscar: string = this.fechaIniBuscar.nativeElement.value;
    let fechaFinBuscar: string = this.fechaFinBuscar.nativeElement.value;
    let consecutivoDianBuscar: string = this.consecutivoDianBuscar.nativeElement.value;
    let internoBuscar: string = this.internoBuscar.nativeElement.value;
    let clientePV: string = this.clientePV.nativeElement.value;
    let proveedorBuscar: string = this.proveedorBuscar.nativeElement.value;
    if (tipoDocumento == "") {
      tipoDocumento = "10";
    }
    let cliente1 = this.clientes.find(cliente => cliente.nombre == clientePV);
    let cliente_id = "";
    if (cliente1 != undefined) {
      cliente_id = cliente1.cliente_id.toString();
    }
    console.log(tipoDocumento);
    this.documentoService.getDocumentoByTipoAndFecha(tipoDocumento, cajeroBuscar, empleadoBuscar, fechaIniBuscar, fechaFinBuscar,
      consecutivoDianBuscar, internoBuscar, cliente_id, proveedorBuscar, this.empresaId).subscribe(res => {
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

  getProductosByEmpresa(empresaId: number) {
    this.productoService.getProductosByEmpresa(empresaId.toString()).subscribe(res => {
      this.productosAll = res;
    });
  }

  getTiposDocumento() {
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
