import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DocumentoModel } from '../model/documento.model';
import { TipoDocumentoModel } from '../model/tipoDocumento.model';
import { DocumentoService } from '../services/documento.service';
import { ProveedorService } from '../services/proveedor.service';
import { ProveedorModel } from '../model/proveedor.model';
import { FacturaModel } from '../vo/factura.model';
import { UsuarioService } from '../services/usuario.service';
import { ActivacionModel } from '../model/activacion';
import { ProductoModel } from '../model/producto.model';
import { DocumentoDetalleModel } from '../model/documentoDetalle.model';
import { ProductoService } from '../services/producto.service';
import { Router } from '@angular/router';
import { ConfiguracionModel } from '../model/configuracion.model';
import { ClienteService } from '../services/cliente.service';
import { SocketService } from '../services/socket.service';
import { CalculosService } from '../services/calculos.service';
import { DocumentoDetalleService } from '../services/documento-detalle.service';
import { TipoPagoModel } from '../model/tipoPago.model';
import { TipoPagoDocumentoModel } from '../model/tipoPagoDocumento.model';
import { EmpresaService } from '../services/empresa.service';
import { ImpresoraEmpresaModel } from '../model/impresoraEmpresa.model';
import { EmpresaModel } from '../model/empresa.model';
import { ImpresionService } from '../services/impresion.service';
import { SubMenuModel } from '../model/submenu.model';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-movimiento-mes',
  templateUrl: './movimiento-mes.component.html',
  styleUrls: ['./movimiento-mes.component.css']
})
export class MovimientoMesComponent implements OnInit {

  public tiposDocumento: Array<TipoDocumentoModel>;
  public proveedores: Array<ProveedorModel>;
  public activaciones: Array<ActivacionModel>;
  public productos: Array<DocumentoDetalleModel>;
  public productosAll: Array<ProductoModel>;
  public impresoraEmpresa: Array<ImpresoraEmpresaModel>;
  public opciones: Array<SubMenuModel>;
  public grupoList: Array<any>;
  public marcaList: Array<any>;
  
  public document: DocumentoModel;
  public clienteNew: ProveedorModel = new ProveedorModel();
  public empresaId: number;
  public usuarioId: number;
  public proveedorSelect: number;
  public productoIdSelect: ProductoModel;
  public configuracion: ConfiguracionModel;
  public productoNew: ProductoModel = new ProductoModel();

  public factura: FacturaModel;
  public guiaTransporteActivo: boolean = false;
  public codigoBarrasActivo: boolean = false;
  public multipleImpresoraActivo: boolean = false;
  public TipoPagosActivo: boolean = false;
  public cambioPrecioActivo: boolean = false;
  public descuentosActivo: boolean = false;
  public tituloFactura: string;
  public indexSelect: number = 0;
  public documentosList: Array<DocumentoModel> = [];
  public modificarFactura: boolean = false;
  public divGramera: boolean = false;
  public pesoGramera: number = 0.0;
  public indexModificarSelect: number = 0;


  @ViewChild("tipoDocumentoPV") tipoDocumentoPV: ElementRef;
  @ViewChild("detalleEntrada") detalleEntrada: ElementRef;
  @ViewChild("siguientePV") siguientePV: ElementRef;
  @ViewChild("anteriorPV") anteriorPV: ElementRef;
  @ViewChild("primeraPV") primeraPV: ElementRef;
  @ViewChild("ultimaPV") ultimaPV: ElementRef;
  @ViewChild("buscarPV") buscarPV: ElementRef;
  @ViewChild("modificarPV") modificarPV: ElementRef;
  @ViewChild("carteraPV") carteraPV: ElementRef;
  @ViewChild("costoIvaPV") costoIvaPV: ElementRef;
  @ViewChild("proveedorPV") proveedorPV: ElementRef;

  @ViewChild("downloadZipLink") downloadZipLink: ElementRef;
  @ViewChild("impresoraLavel") impresoraLavel: ElementRef;
  @ViewChild("impresoraPV") impresoraPV: ElementRef; // controla la impresora que se desea imprimir
  @ViewChild("descuentoPV") descuentoPV: ElementRef;
  @ViewChild("descuentoLavel") descuentoLavel: ElementRef;
  @ViewChild("tipoPagoLavel") tipoPagoLavel: ElementRef;
  @ViewChild("tipoPagoPV") tipoPagoPV: ElementRef;
  @ViewChild("valorTipoPagoLavel") valorTipoPagoLavel: ElementRef;
  @ViewChild("valorTipoPagoPV") valorTipoPagoPV: ElementRef;

  @ViewChild("continuaImpresionPV") continuaImpresionPV: ElementRef;


  @ViewChild("nuevaPV") nuevaPV: ElementRef;
  @ViewChild("imprimirPV") imprimirPV: ElementRef;
  @ViewChild("opcionPV") opcionPV: ElementRef;
  @ViewChild("finPV") finPV: ElementRef;
  @ViewChild("cuadreCajaModal") cuadreCajaModal: ElementRef;
  @ViewChild("buscarDocumentoXFecha") buscarDocumentoXFecha: ElementRef;

  //div botones de acciones
  @ViewChild("divSiguiente") divSiguiente: ElementRef;
  @ViewChild("divAnterior") divAnterior: ElementRef;
  @ViewChild("divPrimera") divPrimera: ElementRef;
  @ViewChild("divUltima") divUltima: ElementRef;
  @ViewChild("divBuscar") divBuscar: ElementRef;
  @ViewChild("divCartera") divCartera: ElementRef;
  @ViewChild("divCostoIva") divCostoIva: ElementRef;
  @ViewChild("divModificar") divModificar: ElementRef;
  @ViewChild("divNueva") divNueva: ElementRef;
  @ViewChild("divImprimir") divImprimir: ElementRef;
  @ViewChild("divOpciones") divOpciones: ElementRef;
  @ViewChild("divFin") divFin: ElementRef;
  @ViewChild("imprimirBtn") imprimirBtn: ElementRef;


  @ViewChild("divImprimirModal") divImprimirModal: ElementRef;
  @ViewChild("divCantidad") divCantidad: ElementRef; // div de donde se busca  la cantidad
  @ViewChild("divCodigo") divCodigo: ElementRef; // div de donde se busca el codigo del producto
  @ViewChild("divArticulo") divArticulo: ElementRef; // div de donde se busca el articulo
  @ViewChild("divUnitario") divUnitario: ElementRef; // div de donde se busca el articulo
  @ViewChild("divParcial") divParcial: ElementRef; // div de donde se busca el articulo
  @ViewChild("enPantallaPV") enPantallaPV: ElementRef; // div de donde se busca el articulo

  @ViewChild("CodigoBarrasPV") CodigoBarrasPV: ElementRef;
  @ViewChild("articuloPV") articuloPV: ElementRef;
  @ViewChild("codigoPV") codigoPV: ElementRef;
  @ViewChild("cantidadPV") cantidadPV: ElementRef;
  @ViewChild("precioPV") precioPV: ElementRef;
  @ViewChild("grameraPV") grameraPV: ElementRef;
  @ViewChild("unitarioPV") unitarioPV: ElementRef;
  @ViewChild("efectovoPV") efectovoPV: ElementRef;
  @ViewChild("unitarioVentaPV") unitarioVentaPV: ElementRef;
  @ViewChild("facturacionPV") facturacionPV: ElementRef;
  @ViewChild("nombreproductoNew") nombreproductoNew: ElementRef;
  
  


  readonly MULTIPLE_IMPRESORA: string = '4';
  readonly CODIGO_BARRAS: string = '7';
  readonly GUIA_TRANSPORTE: string = '8';
  readonly DESCUENTOS: string = '10';
  readonly CAMBIO_PRECIO: string = '15';
  readonly TIPOS_PAGOS: string = '20';

  readonly TIPO_DOCUMENTO_ENTRADA_ALMACEN: number = 2;
  readonly TIPO_DOCUMENTO_SALIDA_ALMACEN: number = 6;

  constructor(public documentoService: DocumentoService,
    public usuarioService: UsuarioService,
    public calculosService: CalculosService,
    public documentoDetalleService: DocumentoDetalleService,
    public productoService: ProductoService,
    private router: Router,
    public socketService: SocketService,
    public clienteService: ClienteService,
    public empresaService: EmpresaService,
    public impresionService: ImpresionService,
    public proveedorService: ProveedorService) { }

  ngOnInit() {
    this.empresaId = Number(localStorage.getItem("empresa_id"));
    this.usuarioId = Number(localStorage.getItem("usuario_id"));
    this.document = new DocumentoModel();
    this.CodigoBarrasPV.nativeElement.classList.add("d-none");
    this.getTiposDocumento();
    this.getProveedores(this.empresaId);
    this.getActivaciones(this.usuarioId);
    this.getProductosByEmpresa(this.empresaId);
    this.getConfiguracion(this.empresaId);
    this.getImpresorasEmpresa(this.empresaId);
    this.opcionesSubmenu();
    this.guiaTransporteActivo = false;
    this.documentosList = [];
    this.modificarFactura = false;
    this.siguientePV.nativeElement.focus();
    
  }

  ocultarPrecio() {
    this.precioPV.nativeElement.classList.remove("d-block");
    this.precioPV.nativeElement.classList.add("d-none");
  }

  cancelarImpresion() {
    console.log("presiona cancelar impresion");
    this.divImprimirModal.nativeElement.classList.remove("d-block");
    this.divImprimirModal.nativeElement.classList.add("d-none");
    this.scapeTecla(null);
  }
  

  articuloSelect(element) {
    console.log("articulo select:" + element.value);
    let productoNombre: string = element.value;
    this.productoIdSelect = this.productosAll.find(product => product.nombre === productoNombre);
    console.log(this.productoIdSelect);
    if (this.productoIdSelect != undefined) {
      this.codigoPV.nativeElement.value = this.productoIdSelect.producto_id;
      this.findByProducto();
    }

  }

  nuevafactura() {
    console.log("nueva factura");
    this.limpiar();
    this.estadoDivBotones("d-none");
    this.estadoDivProducto("d-block") // se muestra el div de producto
    this.proveedorPV.nativeElement.focus();
  }

  imprimirModal() {
    if (this.document.documento_id == "") {
      alert("debe crear primero una factura");
      return;
    }
    this.divImprimirModal.nativeElement.classList.remove("d-none");
    this.divImprimirModal.nativeElement.classList.add("d-block");
    let contador = 0;

    if (this.descuentosActivo) {
      this.descuentoLavel.nativeElement.classList.remove("d-none");
      this.descuentoLavel.nativeElement.classList.add("d-block");
      this.descuentoPV.nativeElement.classList.remove("d-none");
      this.descuentoPV.nativeElement.classList.add("d-block");
    }
    if (this.multipleImpresoraActivo) {
      this.impresoraLavel.nativeElement.classList.remove("d-none");
      this.impresoraLavel.nativeElement.classList.add("d-block");
      this.impresoraPV.nativeElement.classList.remove("d-none");
      this.impresoraPV.nativeElement.classList.add("d-block");
    }
    if (this.TipoPagosActivo) {
      this.valorTipoPagoLavel.nativeElement.classList.remove("d-none");
      this.valorTipoPagoLavel.nativeElement.classList.add("d-block");

      this.tipoPagoLavel.nativeElement.classList.remove("d-none");
      this.tipoPagoLavel.nativeElement.classList.add("d-block");

      this.tipoPagoPV.nativeElement.classList.remove("d-none");
      this.tipoPagoPV.nativeElement.classList.add("d-block");

      this.valorTipoPagoPV.nativeElement.classList.remove("d-none");
      this.valorTipoPagoPV.nativeElement.classList.add("d-block");
    }


    this.descuentoPV.nativeElement.focus();

  }

  limpiar() {
    this.estadoDivBotones("d-block");
    this.siguientePV.nativeElement.focus();
    this.estadoDivProducto("d-none") // se muestra el div de producto
    this.CodigoBarrasPV.nativeElement.value = "";
    this.CodigoBarrasPV.nativeElement.classList.add("d-none");
    this.proveedorSelect = null;
    this.productoIdSelect = null;
    this.document = new DocumentoModel();
    this.proveedorPV.nativeElement.value = "";
    this.tipoDocumentoPV.nativeElement.value = "";
    this.detalleEntrada.nativeElement.value = "";
    this.articuloPV.nativeElement.value = "";
    this.codigoPV.nativeElement.value = "";
    this.cantidadPV.nativeElement.value = "";
    this.precioPV.nativeElement.value = "";
    this.productos = [];
    this.efectovoPV.nativeElement.value = "";
    this.tituloFactura = "";
    this.factura = new FacturaModel();
    this.indexSelect = 0;
    this.documentosList = [];
    this.modificarFactura = false;
  }

  controlTeclas(event, element) {
    if (event.keyCode == 39) { //cuando se presiona la tacla derecha 				
      if (element.id == 'siguientePV') {
        this.anteriorPV.nativeElement.focus();
        return;
      }
      if (element.id == 'anteriorPV') {
        this.primeraPV.nativeElement.focus();
        return;
      }
      if (element.id == 'primeraPV') {
        this.ultimaPV.nativeElement.focus();
        return;
      }
      if (element.id == 'ultimaPV') {
        this.buscarPV.nativeElement.focus();
        return;
      }
      if (element.id == 'buscarPV') {
        this.carteraPV.nativeElement.focus();
        return;
      }
      if (element.id == 'carteraPV') {
        this.modificarPV.nativeElement.focus();
        return;
      }

      if (element.id == 'modificarPV') {
        this.nuevaPV.nativeElement.focus();
        return;
      }

      if (element.id == 'nuevaPV') {
        this.imprimirPV.nativeElement.focus();
        return;
      }
      if (element.id == 'imprimirPV') {
        this.opcionPV.nativeElement.focus();
        return;
      }
      if (element.id == 'opcionPV') {
        this.costoIvaPV.nativeElement.focus();
        return;
      }
      if (element.id == 'costoIvaPV') {
        this.finPV.nativeElement.focus();
        return;
      }

    }
    if (event.keyCode == 37) { //cuando se presiona la tacla izq 				
      if (element.id == 'anteriorPV') {
        this.siguientePV.nativeElement.focus();
        return;
      }
      if (element.id == 'primeraPV') {
        this.anteriorPV.nativeElement.focus();
        return;
      }
      if (element.id == 'ultimaPV') {
        this.primeraPV.nativeElement.focus();
        return;
      }
      if (element.id == 'buscarPV') {
        this.ultimaPV.nativeElement.focus();
        return;
      }
      if (element.id == 'carteraPV') {
        this.buscarPV.nativeElement.focus();
        return;
      }

      if (element.id == 'modificarPV') {
        this.carteraPV.nativeElement.focus();
        return;
      }
      if (element.id == 'nuevaPV') {
        this.modificarPV.nativeElement.focus();
        return;
      }
      if (element.id == 'imprimirPV') {
        this.nuevaPV.nativeElement.focus();
        return;
      }
      if (element.id == 'opcionPV') {
        this.imprimirPV.nativeElement.focus();
        return;
      }
      if (element.id == 'costoIvaPV') {
        this.imprimirPV.nativeElement.focus();
        return;
      }

      if (element.id == 'finPV') {
        this.costoIvaPV.nativeElement.focus();
        return;
      }
    }
    if (event.keyCode == 40) { //cuando se presiona la tacla abajo
      if (element.id.substr(0, 2) == 'c_') {
        if (this.productos.length > (this.indexModificarSelect + 1)) {
          this.indexModificarSelect = this.indexModificarSelect + 1;
          let idModificarSelect = "c_" + this.productos[this.indexModificarSelect].documento_detalle_id;
          $("#" + idModificarSelect).focus();
          $("#" + idModificarSelect).select();
          return;
        }
      }
      if (element.id.substr(0, 2) == 'p_') {
        if (this.productos.length > (this.indexModificarSelect + 1)) {
          this.indexModificarSelect = this.indexModificarSelect + 1;
          let idModificarSelect = "p_" + this.productos[this.indexModificarSelect].documento_detalle_id;
          $("#" + idModificarSelect).focus();
          $("#" + idModificarSelect).select();
          return;
        }
      }
      if (element.id.substr(0, 2) == 'b_') {
        if (this.productos.length > (this.indexModificarSelect + 1)) {
          this.indexModificarSelect = this.indexModificarSelect + 1;
          let idModificarSelect = "b_" + this.productos[this.indexModificarSelect].documento_detalle_id;
          $("#" + idModificarSelect).focus();
          $("#" + idModificarSelect).select();
          return;
        }
      }
    }
    if (event.keyCode == 38) { //cuando se presiona la tacla arriba
      if (element.id.substr(0, 2) == 'c_') {
        if (0 < this.indexModificarSelect) {
          this.indexModificarSelect = this.indexModificarSelect - 1;
          let idModificarSelect = "c_" + this.productos[this.indexModificarSelect].documento_detalle_id;
          $("#" + idModificarSelect).focus();
          $("#" + idModificarSelect).select();
          return;
        }
      }
      if (element.id.substr(0, 2) == 'p_') {
        if (0 < this.indexModificarSelect) {
          this.indexModificarSelect = this.indexModificarSelect - 1;
          let idModificarSelect = "p_" + this.productos[this.indexModificarSelect].documento_detalle_id;
          $("#" + idModificarSelect).focus();
          $("#" + idModificarSelect).select();
          return;
        }
      }
      if (element.id.substr(0, 2) == 'b_') {
        if (0 < this.indexModificarSelect) {
          this.indexModificarSelect = this.indexModificarSelect - 1;
          let idModificarSelect = "b_" + this.productos[this.indexModificarSelect].documento_detalle_id;
          $("#" + idModificarSelect).focus();
          $("#" + idModificarSelect).select();
          return;
        }
      }
    }
    if (event.keyCode == 78) { //cuando se presiona la tacla N 		 
      this.nuevafactura();
    }
    if (event.keyCode == 70) { //cuando se presiona la tacla f
      this.router.navigate(['/login']);
    }
    if (event.keyCode == 73 && !this.modificarFactura) { //cuando se presiona la tacla i 		 
      this.imprimirModal();
    }
    if (event.keyCode == 73 && this.modificarFactura) { //cuando se presiona la tacla i 		 
      this.insertarModificar();
    }

    if (event.keyCode == 79) { //cuando se presiona la tacla f
      //alert("presiona la tecla o");
      this.opcionPV.nativeElement.click();
    }
   
    if (event.keyCode == 83) { //cuando se presiona la tacla s
      this.teclaAnteriorSiguiente('s');
    }
    if (event.keyCode == 65) { //cuando se presiona la tacla a
      this.teclaAnteriorSiguiente('a');
    }
    if (event.keyCode == 80) { //cuando se presiona la tacla p
      this.teclaAnteriorSiguiente('p');
    }
    if (event.keyCode == 85 && !this.modificarFactura) { //cuando se presiona la tacla u
      this.teclaAnteriorSiguiente('u');
    } 
    if (event.keyCode == 77) { //cuando se presiona la tacla m
      this.modificarEnter();
    }
    if (event.keyCode == 67) { //cuando se presiona la tacla c
      this.cambiarPrecio("cambiarPrecioPV");
    }
    if (event.keyCode == 66) { //cuando se presiona la tacla b
      this.asigarEliminar();
    }
    if (event.keyCode == 85 && this.cambioPrecioActivo && this.modificarFactura) { //cuando se presiona la tacla p
      this.cambiarPrecio("modificarUnitarioPV");
    }

  }

  cambioPrecioLista(detalle: DocumentoDetalleModel, element) {
    if (isNaN(element.value)) {
      console.log("no es numérico:" + element.value);
      return;
    }
    if (element.value == null || element.value <= 0) {
      return;
    }

    let anterior: DocumentoDetalleModel = detalle;
    this.productoIdSelect = this.productosAll.find(product => product.producto_id === anterior.producto_id);
    for (var i = 0; i < this.productos.length; i++) {
      if (this.productos[i].documento_detalle_id == anterior.documento_detalle_id) {
        this.productos.splice(i, 1);
        anterior.estado = 0;
        break;
      }
    }
    let cantidad: number;
    let precio: number;
    switch (element.id.substr(0, 2)) {
      case "c_":
        cantidad = element.value;
        precio = anterior.unitario;
        break;
      case "p_":
        cantidad = anterior.cantidad;
        precio = element.value;
        break;
      default:
        break;
    }
    this.documentoDetalleService.updateDocumentoDetalle(anterior).subscribe(res => {
      if (res.code == 200) {
        this.asignarDocumentoDetalle(cantidad, precio);
        this.siguientePV.nativeElement.focus();
        this.modificarFactura = false;
      }
    });
  }

  async borrarLista(detalle: DocumentoDetalleModel, element) {
      this.borradoPosClave(detalle);
  }

  borradoPosClave(detalle: DocumentoDetalleModel) {
    let anterior: DocumentoDetalleModel = detalle;
    this.productoIdSelect = this.productosAll.find(product => product.producto_id === anterior.producto_id);
    for (var i = 0; i < this.productos.length; i++) {
      if (this.productos[i].documento_detalle_id == anterior.documento_detalle_id) {
        this.productos.splice(i, 1);
        anterior.estado = 0;
        break;
      }
    }
    this.documentoDetalleService.updateDocumentoDetalle(anterior).subscribe(res => {
      if (res.code == 200) {
        this.document = this.calculosService.calcularExcento(this.document, this.productos);
        this.documentoService.updateDocumento(this.document).subscribe(res => {
          if (res.code != 200) {
            alert("error creando documento, por favor inicie nuevamente la creación del documento");
            return;
          }
        });

        let newCantidad: number = this.productoIdSelect.cantidad;
        this.productoIdSelect.cantidad = newCantidad - anterior.cantidad;
        this.restarCantidadesSubProducto(anterior);
        this.productoService.updateCantidad(this.productoIdSelect).subscribe(res => {
          if (res.code == 200) {
            //buscar la poscicion del producto y restarle la cantidad en el arreglo de productos
          } else {
            alert("error actualizando la cantidad del producto en el inventario, pero el documento es correcto");
            return;
          }
        });


        this.siguientePV.nativeElement.focus();
        this.modificarFactura = false;
      }
    });
  }

  asigarEliminar() {
    if (this.productos.length == 0) {
      alert("Debe seleccionar un documento con productos para poder editarlo");
      return;
    }
    let idModificarSelect = "b_" + this.productos[0].documento_detalle_id;
    this.indexModificarSelect = 0;
    $("#" + idModificarSelect).focus();
  }

  cambiarPrecio(element: string) {
    if (this.productos.length == 0) {
      alert("Debe seleccionar un documento con productos para poder editarlo");
      return;
    }
    let idModificarSelect;
    if (element == "cambiarPrecioPV") {
      idModificarSelect = "c_" + this.productos[0].documento_detalle_id;
    }
    if (element == "modificarUnitarioPV") {
      idModificarSelect = "p_" + this.productos[0].documento_detalle_id;
    }
    this.indexModificarSelect = 0;
    $("#" + idModificarSelect).focus();
    $("#" + idModificarSelect).select();
  }

  teclaAnteriorSiguiente(apcion: string) {
    if (this.documentosList.length == 0) {
      let tipoDocumentoId: Array<number> = [1, 2, 6];//se buscan facturas de venta
      let impreso = '0';
      this.documentoService.getDocumentoByTipo(tipoDocumentoId, this.empresaId.toString(), this.usuarioId.toString(), '', impreso).subscribe(res => {
        this.documentosList = res;
        console.log("lista de docuemntos cargados: " + this.documentosList.length);
        if (this.documentosList.length == 0) {
          alert("No existen documentos");
          return;
        }
        console.log(apcion + ":" + this.documentosList.length);
        this.document = this.documentosList[this.documentosList.length - 1];
        this.indexSelect = this.documentosList.length - 1;
        this.asignarValores(this.document.documento_id);
        return;
      });
    } else {
      if ('a' == apcion && this.indexSelect != 0) {
        this.indexSelect = this.indexSelect - 1;
        this.document = this.documentosList[this.indexSelect];
      }
      if ('s' == apcion && this.indexSelect != this.documentosList.length - 1) {
        this.indexSelect = this.indexSelect + 1;
        this.document = this.documentosList[this.indexSelect];
      }
      if ('p' == apcion) {
        this.indexSelect = 0;
        this.document = this.documentosList[this.indexSelect];
      }
      if ('u' == apcion) {
        this.indexSelect = this.documentosList.length - 1;
        this.document = this.documentosList[this.indexSelect];
      }
    }
    console.log("actual:" + this.document.documento_id);
    this.asignarValores(this.document.documento_id);
  }

  asignarValores(documento_id: string) {
    if (documento_id != '') {

      let proveedor = this.proveedores.find(cliente => cliente.proveedor_id == this.document.proveedor_id);
      let nombre = "";
      if (proveedor != undefined) {
        nombre = proveedor.nombre;
      }
      this.proveedorPV.nativeElement.value = nombre;
      let ids: string[] = [];
      ids.unshift(this.document.documento_id);
      this.documentoDetalleService.getDocumentoDetalleByDocumentoList(ids).subscribe(res => {
        this.productos = res;
        console.log("detalles encontrados:" + res.length);
      });
    }
  }

  insertarModificar() {
    if (this.productos.length == 0) {
      alert("Debe seleccionar un documento con productos para poder editarlo");
      return;
    }
    this.estadoDivBotones("d-none");
    this.estadoDivProducto("d-block") // se muestra el div de producto

    if (this.codigoBarrasActivo) {
      this.CodigoBarrasPV.nativeElement.classList.add("d-block");
      this.CodigoBarrasPV.nativeElement.focus();
    } else {
      this.articuloPV.nativeElement.focus();
    }
    this.modificarFactura = false;

  }

  getActivaciones(user: number) {
    this.usuarioService.getActivacionByUsuario(user.toString()).subscribe(res => {
      this.activaciones = res;
      for (var e = 0; e < this.activaciones.length; e++) {
        if (this.activaciones[e].activacion_id == this.GUIA_TRANSPORTE) {
          console.log("guia de trasporte activa");
          this.guiaTransporteActivo = true;
        }
        if (this.activaciones[e].activacion_id == this.CODIGO_BARRAS) {
          console.log("codigo barras activado");
          this.codigoBarrasActivo = true;
        }
        if (this.activaciones[e].activacion_id == this.DESCUENTOS) {
          console.log("descuentos activos ");
          this.descuentosActivo = true;
        }
        if (this.activaciones[e].activacion_id == this.MULTIPLE_IMPRESORA) {
          console.log("multiple impresora activos ");
          this.multipleImpresoraActivo = true;
        }
        if (this.activaciones[e].activacion_id == this.TIPOS_PAGOS) {
          console.log("tipos pagos activos ");
          this.TipoPagosActivo = true;
        }
        if (this.activaciones[e].activacion_id == this.CAMBIO_PRECIO) {
          console.log("cambio de precio activos ");
          this.cambioPrecioActivo = true;
        }
      }
    });
  }

  scapeTecla(element) {
    this.estadoDivBotones("d-block");
    this.estadoDivProducto("d-none") // se muestra el div de producto
    this.divImprimirModal.nativeElement.classList.remove("d-block");
    this.divImprimirModal.nativeElement.classList.add("d-none");
    this.siguientePV.nativeElement.focus();
    this.modificarFactura = false;


  }

  enterTecla(element) {
    //await this.delay(550);
    console.log(element.id);
    if (element.id == "proveedorPV") {
      this.proveedorSelectFun(element);
    }
    if (element.id == "tipoDocumentoPV") {
      this.tipoDocumentoSelect(element);
    }
    if (element.id == "detalleEntrada") {
      this.detalleEntradaEnter(element);
    }
    if (element.id == "CodigoBarrasPV") {
      this.codigoBarrasSelect(element);
    }
    if (element.id == "articuloPV") {
      this.productoEnter(element);
    }
    if (element.id == "codigoPV") {
      this.codigoProductoSelect(element);
      console.log("enter en producto");
    }
    if (element.id == "cantidadPV") {
      this.cantidadEnter(element);
    }
    if (element.id == "precioPV") {
      this.precioEnter(element);
    }
    if (element.id == "unitarioPV") {
      this.unitarioEnter(element);
    }
    if (element.id == "unitarioVentaPV") {
      this.unitarioVentaEnter(element);
    }
    if (element.id == "descuentoPV") {
      this.descuentoEnter();
    }
    if (element.id == "impresoraPV") {
      this.impresoraEnter();
    }
    if (element.id == "tipoPagoPV") {
      this.valorTipoPagoPV.nativeElement.focus();

    }
    if (element.id == "valorTipoPagoPV") {
      this.efectovoPV.nativeElement.focus();
    }
    if (element.id == "efectovoPV") {
      this.efectivoEnter(element);
    }
    if (element.id == "enPantallaPV") {
      this.continuaImpresionPV.nativeElement.focus();
    }

    if (element.id == "continuaImpresionPV") {
      this.enterContinuarImpresion(element);

    }
    if (element.id == "modificarPV") {
      this.modificarEnter();
    }
    if (element.id == "cuadreCajaPV") { 
      this.cuadreCajaModal.nativeElement.click();   
    }

    if (element.id == "documentosXFechaPV") { 
      console.log("aquientra");
      this.buscarDocumentoXFecha.nativeElement.click();   
    }

    if (element.id == "finPV") { 
      console.log("fin");
      this.facturacionPV.nativeElement.focus();   
    }

    

  }

  modificarEnter() {
    this.modificarFactura = true;
  }

  enterContinuarImpresion(element) {
    if (this.document.documento_id == "") {
      alert("El documento esta corructo, por favor vuelva a crearlo");
      return;
    }
    console.log(this.configuracion);
    let numImpresiones = this.configuracion.numero_impresion;
    let impresora: string = this.impresoraPV.nativeElement.value;
    if (impresora == "") {
      impresora = '1';
    }
    this.document.impresora = Number(impresora);
    if (this.document.tipo_documento_id == null) {
      this.document.tipo_documento_id = this.TIPO_DOCUMENTO_ENTRADA_ALMACEN;
    }
    if (this.document.cliente_id == null) {
      //si el cliente es nulo se asigna el varios por defecto
      this.document.cliente_id = 1;
    }
    //this.document.mac= Calculos.conseguirMAC2()); ver como se hace la mag desde el cliente..
    this.document.impreso = 1;
    this.verificarDescuento();

    //this.calcularInfoDiario(); queda en duda el informe diario
    this.asignarTipoPago();
    this.asignarConsecutivo(numImpresiones);
  }

  asignarTipoPago() {
    let des1 = this.descuentoPV.nativeElement.value;
    let tiposPagosList: TipoPagoModel[] = [];
    if (des1 == "") {
      //si no se agrega un tipo de pago se agrega efectivo por defecto efectivo 
      let tipoPagoDocumento: TipoPagoDocumentoModel = new TipoPagoDocumentoModel();
      tipoPagoDocumento.documento_id = this.document.documento_id;
      tipoPagoDocumento.fecha_registro = new Date;
      tipoPagoDocumento.tipo_pago_id = 1;//efectivo por defecto
      tipoPagoDocumento.valor = this.document.total;
      this.documentoService.saveTipoPagoDocumento(tipoPagoDocumento).subscribe(res => {

      });
    } else {

    }
  }

  asignarConsecutivo(numImpresiones: number) {
    let consecutivo: string;
    this.document.consecutivo_dian = this.document.documento_id// es necesario asignar el
    this.empresaService.getEmpresaById(this.empresaId.toString()).subscribe(res => {
      let empr = res;
    switch (this.document.tipo_documento_id) {
      case 1:
        this.tituloFactura = "ENTRADA POR GUIA";
        break;
      case 2:
        this.tituloFactura = "ENTRADA DE ALMACEN";
        break;
      case 3:
        this.tituloFactura = "SALIDA DE ALMACEN";
        break;
      default:
        break;
    }
    this.documentoService.updateDocumento(this.document).subscribe(res => {
      if (res.code != 200) {
        alert("error creando documento, por favor inicie nuevamente la creación del documento");
        return;
      }
      this.imprimirFactura(numImpresiones, empr[0]);
      this.limpiar();
      this.scapeTecla(null);
    });
  });
  }

  imprimirFactura(numeroImpresiones: number, empresa: EmpresaModel) {
    console.log("entra a imprimir factura");
    let tituloDocumento: string = "";
   
    let pantalla = this.enPantallaPV.nativeElement.value;
    if (pantalla == "") {
      pantalla = "false";
    }
    if (numeroImpresiones == undefined) {
      numeroImpresiones = 1;
    }
    let tipoImpresion = "";

    let impresora = this.document.impresora;
    for (var i = 0; i < this.impresoraEmpresa.length; i++) {
      console.log(numeroImpresiones);
      if (impresora == this.impresoraEmpresa[i].numero_impresora) {
        tipoImpresion = this.impresoraEmpresa[i].tipo_impresion;
      }
    }
    console.log(tipoImpresion);
    tituloDocumento = this.tituloFactura + "_" + this.document.consecutivo_dian + "_" + impresora + "_" + pantalla + "_" + numeroImpresiones + "_" + tipoImpresion;

    this.factura.documento = this.document;
    this.factura.detalle = this.productos
    this.factura.titulo = tituloDocumento;
    this.factura.empresa = empresa;
    this.factura.nombreUsuario = localStorage.getItem("nombreUsuario");
    for (var i = 0; i < numeroImpresiones; i++) {
      switch (tipoImpresion) {
        case "TXT80MM":
          this.descargarArchivo(this.impresionService.imprimirFacturaTxt80(this.factura, this.configuracion), tituloDocumento + '.txt');
          break;
        case "TXT50MM":
          this.descargarArchivo(this.impresionService.imprimirFacturaTxt50(this.factura, this.configuracion), tituloDocumento + '.txt');
          break;
        default:
          alert("no tiene un tipo impresion");
          //Impresion.imprimirPDF(getDocumento(), getProductos(), usuario(), configuracion, impresora,
          //    enPantalla, e);
          break;
      }
    }
  }

  descargarArchivo(contenidoEnBlob, nombreArchivo) {
    const url = window.URL.createObjectURL(contenidoEnBlob);
    const link = this.downloadZipLink.nativeElement;
    link.href = url;
    link.download = nombreArchivo;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  verificarDescuento() {
    let des1 = this.descuentoPV.nativeElement.value;
    if (des1 != 0.0 && des1 != "") {
      let desTemp = 0.0; // si el descuento es mayor o menor que 100 entonces se calcula el
      // descuento en %
      desTemp = 0.0;
      if (des1 < -100.0 || des1 > 100.0) {
        this.document.descuento = des1;
        desTemp = (des1 * 100) / this.document.total;
        console.log("% descuento:" + desTemp);
      } else {
        this.document.descuento = (this.document.total * des1) / 100;
        desTemp = des1;
        console.log("% descuento:" + desTemp);
      }
      if (desTemp < -50 || desTemp > 50) {
        return;
      }
      let des = desTemp / 100;
      let temp: DocumentoDetalleModel[];
      for (var i = 0; i < this.productos.length; i++) {
        let parcialDescuento = this.productos[i].parcial + (this.productos[i].parcial * des);
        let unitarioDescuento = this.productos[i].unitario + (this.productos[i].unitario * des);
        this.productos[i].parcial = parcialDescuento;
        this.productos[i].unitario = unitarioDescuento;
        temp.unshift(this.productos[i]);
      }
      let totalTemp = this.document.total;
      let ivaTemp = this.document.iva + (this.document.iva * des);
      let excentoTemp = this.document.excento + (this.document.excento * des);
      let gravadoTemp = this.document.gravado + (this.document.gravado * des);
      this.document.total = totalTemp;
      this.document.saldo = totalTemp;
      this.document.iva = ivaTemp;
      this.document.excento = excentoTemp;
      this.document.gravado = gravadoTemp;
      this.productos = temp;
      // se valida si el descuento es mayor o menor a 1.5
      /*if (desTemp >= 1.5 || desTemp <= -1.5) {
        Evento evento = new Evento();
        TipoEvento tipoEvento = new TipoEvento();
        tipoEvento.setTipoEventoId(2l); // se asigna tipo evento igual a
                        // descuento mayor al 1.5
        evento.setFechaRegistro(new Date());
        evento.setTipoEventoId(tipoEvento);
        evento.setUsuarioId(usuario());
        evento.setCampo("" + getDocumento().getDocumentoId());
        evento.setValorActual("" + totalTemp);
        evento.setValorAnterior("" + getDescuento());
        eventoService.save(evento);
      }*/

      if (des1 < -100.0 || des1 > 100.0) {
        this.document.descuento = des1;
        desTemp = (des1 * 100) / this.document.total;
        console.log("% descuento:" + desTemp);
      } else {
        this.document.descuento = (this.document.total * des1) / 100;
        desTemp = des1;
        console.log("% descuento:" + desTemp);
      }
      if (desTemp < -50 || desTemp > 50) {
        alert("El descuento no puede ser mayor o menor al 50%");
        return;
      }
    }
  }

  efectivoEnter(element) {
    let efectivo: number = element.value;
    if (!isNaN(efectivo) && element.value != '') {

      this.document.cambio = efectivo - this.document.total;
    }
    this.enPantallaPV.nativeElement.focus();
  }

  impresoraEnter() {
    if (this.TipoPagosActivo) {
      this.tipoPagoPV.nativeElement.focus();
    } else {
      this.efectovoPV.nativeElement.focus();
    }
  }

  descuentoEnter() {
    if (this.multipleImpresoraActivo) {
      this.impresoraPV.nativeElement.focus();
    } else {
      if (this.TipoPagosActivo) {
        this.tipoPagoPV.nativeElement.focus();
      } else {
        this.efectovoPV.nativeElement.focus();
      }
    }
  }

  unitarioVentaEnter(element) {
    if (this.codigoBarrasActivo) {
      this.CodigoBarrasPV.nativeElement.classList.add("d-block");
      this.CodigoBarrasPV.nativeElement.focus();
    } else {
      this.articuloPV.nativeElement.focus();
    }
    if (isNaN(element.value)) {
      console.log("no es numérico:" + element.value);
      return;
    }
    if (element.value == null || element.value <= 0) {
      return;
    }
    let anterior: DocumentoDetalleModel = this.productos[0];
    if (anterior.unitario == element.value) {
      return;
    }
    this.productoIdSelect.costo_publico = element.value;
    this.productoService.updateProducto(this.productoIdSelect).subscribe(res => {
      if (res.code == 200) {
        //alert("Se actualiza el precio de venta a: "+element.value);
      } else {
        alert("error actualizando la cantidad del producto en el inventario, pero el documento es correcto");
        return;
      }
    });

  }

  unitarioEnter(element) {
    this.unitarioVentaPV.nativeElement.focus();
    this.unitarioVentaPV.nativeElement.select();
    if (isNaN(element.value)) {
      console.log("no es numérico:" + element.value);
      return;
    }
    if (element.value == null || element.value <= 0) {
      return;
    }
    let anterior: DocumentoDetalleModel = this.productos[0];
    if (anterior.unitario == element.value) {
      return;
    }

    this.productos.splice(0, 1);
    anterior.estado = 0;
    this.documentoDetalleService.updateDocumentoDetalle(anterior).subscribe(res => {
      if (res.code == 200) {
        this.asignarDocumentoDetalle(anterior.cantidad, element.value);
        console.log("cambio de precio:" + element.value);
      }
    });

  }

  cantidadEnter(element) {
    let cantidad: number = this.cantidadPV.nativeElement.value;
    if (cantidad > 1500) {
      alert("La cantidad no puede ser mayor a 1500");
      return;
    }
    if (this.cambioPrecioActivo) {
      this.unitarioPV.nativeElement.focus();
      this.unitarioPV.nativeElement.select();
    } else {
      if (this.codigoBarrasActivo) {
        this.CodigoBarrasPV.nativeElement.classList.add("d-block");
        this.CodigoBarrasPV.nativeElement.focus();
      } else {
        this.articuloPV.nativeElement.focus();
      }
    }

    this.articuloPV.nativeElement.value = "";
    this.CodigoBarrasPV.nativeElement.value = "";
    this.cantidadPV.nativeElement.value = "";
    console.log("cantidad enter:" + cantidad);
    if (isNaN(cantidad)) {
      console.log("no es numérico:" + cantidad);
      return;
    }
    if (cantidad == null || cantidad <= 0) {
      return;
    }

    console.log("//TODO aqui hacer la validacion de stock min");
    console.log("//TODO aqui hacer la validacion de que el producto se agotó");

    this.asignarDocumento(cantidad);
  }

  private asignarDocumento(cantidad) {
    if (this.document.documento_id == "") {
      this.document.fecha_registro = this.calculosService.fechaActual();
      this.document.usuario_id = this.usuarioId;
      this.document.empresa_id = this.empresaId;
      this.document.invoice = 1; // se envia invoice por enviar
      this.documentoService.saveDocumento(this.document).subscribe(res => {
        if (res.code == 200) {
          this.document.documento_id = res.documento_id;
          this.asignarDocumentoDetalle(cantidad, this.productoIdSelect.costo);
        } else {
          alert("error creando documento, por favor inicie nuevamente la creación del documento");
          return;
        }
      });
    } else {
      this.asignarDocumentoDetalle(cantidad, this.productoIdSelect.costo);
      console.log(this.document);

    }
  }

  private asignarDocumentoDetalle(cantidad: number, costo_publico: number) {
    let docDetalle = new DocumentoDetalleModel();
    docDetalle.cantidad = cantidad;
    docDetalle.impuesto_producto = Number(this.productoIdSelect.impuesto);
    docDetalle.peso_producto = Number(this.productoIdSelect.peso);
    docDetalle.producto_id = this.productoIdSelect.producto_id;
    docDetalle.documento_id = this.document.documento_id;
    docDetalle.descripcion = this.productoIdSelect.nombre;
    docDetalle.costo_producto = this.productoIdSelect.costo;
    docDetalle.fecha_registro = this.calculosService.fechaActual();
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
        if (this.productoIdSelect.varios) {
          let precio: number = this.precioPV.nativeElement.value;
          console.log("precio");
          console.log(precio);
          docDetalle.parcial = precio;
          docDetalle.unitario = precio;
          this.precioPV.nativeElement.value = "";
        } else {
          docDetalle.parcial = cantidad * costo_publico;
          docDetalle.unitario = costo_publico;
        }
      } else {
        docDetalle.parcial = 0;
        docDetalle.unitario = 0;
      }
    }
    console.log(docDetalle);
    this.documentoDetalleService.saveDocumentoDetalle(docDetalle).subscribe(res => {
      if (res.code == 200) {
        docDetalle.documento_detalle_id = res.documento_detalle_id;
        this.productos.unshift(docDetalle);
      } else {
        alert("Error agregando producto: " + res.error);
      }
      this.document = this.calculosService.calcularExcento(this.document, this.productos);
      this.documentoService.updateDocumento(this.document).subscribe(res => {
        if (res.code != 200) {
          alert("error creando documento, por favor inicie nuevamente la creación del documento");
          return;
        }
      });
      let newCantidad: number = this.productoIdSelect.cantidad;
      if(this.document.tipo_documento_id==this.TIPO_DOCUMENTO_SALIDA_ALMACEN){//si es salida de almacen se restan las cantidades
        this.productoIdSelect.cantidad = Number(newCantidad) - Number(docDetalle.cantidad);
      }else{
        this.productoIdSelect.cantidad = Number(newCantidad) + Number(docDetalle.cantidad);
      }
      this.restarCantidadesSubProducto(docDetalle);
      this.productoService.updateCantidad(this.productoIdSelect).subscribe(res => {
        if (res.code == 200) {
          //buscar la poscicion del producto y restarle la cantidad en el arreglo de productos
        } else {
          alert("error actualizando la cantidad del producto en el inventario, pero el documento es correcto");
          return;
        }
      });

    });
  }

  private restarCantidadesSubProducto(productoSelect3: DocumentoDetalleModel) {
    console.log("TODO hacer (copiar)la logica de restar cantidades subproducto");
  }

  precioEnter(element) {
    if (this.codigoBarrasActivo) {
      this.CodigoBarrasPV.nativeElement.classList.add("d-block");
      this.CodigoBarrasPV.nativeElement.focus();
    } else {
      this.articuloPV.nativeElement.focus();
    }
    let precio = this.precioPV.nativeElement.value;
    this.articuloPV.nativeElement.value = "";
    this.CodigoBarrasPV.nativeElement.value = "";

    console.log("precio enter:" + precio);
    if (isNaN(precio)) {
      console.log("no es numérico:" + precio);
      return;
    }
    if (precio == null || precio == '' || precio <= 0) {
      return;
    }
    this.asignarDocumento(1); //se asigna cantidad 1 en x01
  }

  codigoProductoSelect(element) {
    if (element.value == '') {
      if (this.codigoBarrasActivo) {
        this.CodigoBarrasPV.nativeElement.classList.remove("d-none");
        this.CodigoBarrasPV.nativeElement.classList.add("d-block");
        this.CodigoBarrasPV.nativeElement.value = "";
        this.CodigoBarrasPV.nativeElement.focus();
      } else {
        this.articuloPV.nativeElement.focus();
      }
    } else {
      if(element.value ==99999){

         $('#crearProductoModal').modal('show');
         this.delay(150);
         this.nombreproductoNew.nativeElement.focus();
         
      }
      console.log("articulo select:" + element.value);
      let productoCodigo: string = element.value;
      this.productoIdSelect = this.productosAll.find(product => product.producto_id.toString() === productoCodigo);
      console.log(this.productoIdSelect);
      if (this.productoIdSelect != undefined) {
        this.articuloPV.nativeElement.value = this.productoIdSelect.nombre;
        this.codigoPV.nativeElement.value = this.productoIdSelect.producto_id;
        this.findByProducto();
      }
    }
  }

  CrearProducto() {
    console.log(this.productoNew);
   let valido: boolean = true;
   let mensageError: string = "Son obligatorios:\n ";
   if (this.productoNew.nombre == "") {
     mensageError += "nombre\n";
     valido = false;
   }
   if (valido == false) {
     alert(mensageError);
     return;
   }

   this.productoNew.empresa_id = this.empresaId;
   this.productoService.saveProducto(this.productoNew).subscribe(res => {
     if (res.code == 200) {
      
       $('#crearProductoModal').modal('hide');
       this.productoService.getProductosByEmpresa(this.empresaId.toString()).subscribe( res => {
         this.productosAll = res;
         this.productoIdSelect = this.productosAll.find(product => product.nombre === this.productoNew.nombre);
         this.articuloPV.nativeElement.value = this.productoIdSelect.nombre;
         this.codigoPV.nativeElement.value = this.productoIdSelect.producto_id;
         this.productoNew = new ProductoModel();
         this.findByProducto();
       });
     } else {
       alert("error creando producto, por favor inicie nuevamente la creación del producto, si persiste consulte a su proveedor");
       return;
     }
   });

 }


  productoEnter(element) {
    if (element.value == '') {
      this.codigoPV.nativeElement.value = "";
      this.codigoPV.nativeElement.focus();
    }
  }

  codigoBarrasSelect(element) {
    if (element.value == '') {
      this.articuloPV.nativeElement.focus();
    } else {
      console.log("articulo select:" + element.value);
      let productoCBarras: string = element.value;
      this.productoIdSelect = this.productosAll.find(product => product.codigo_barras === productoCBarras);
      console.log(this.productoIdSelect);
      if (this.productoIdSelect != undefined) {
        this.articuloPV.nativeElement.value = this.productoIdSelect.nombre;
        this.codigoPV.nativeElement.value = this.productoIdSelect.producto_id;
        this.findByProducto();
      }

    }
  }

  async findByProducto() {
    this.unitarioPV.nativeElement.value = this.productoIdSelect.costo;
    this.unitarioVentaPV.nativeElement.value = this.productoIdSelect.costo_publico;
    if (this.productoIdSelect.varios) {
      this.precioPV.nativeElement.classList.add("d-block");
      this.precioPV.nativeElement.classList.remove("d-none");
      this.precioPV.nativeElement.focus();
    } else {
      if (this.productoIdSelect.balanza == 1) {
        this.getGramera();// este metodo

        this.divGramera = true;
        await this.delay(100);
        this.grameraPV.nativeElement.value = "S";
        this.grameraPV.nativeElement.focus();
        this.grameraPV.nativeElement.select();
      } else {
        this.cantidadPV.nativeElement.value = 1;
        this.cantidadPV.nativeElement.focus();
        this.cantidadPV.nativeElement.select();
      }
    }
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getGramera() {
    console.log(this.configuracion);
    this.socketService.getPesoGramera(this.configuracion).subscribe(res => {
      if (res == undefined) {
        alert("Error tratando de conectar con la gramera");
        return;
      } else {
        console.log(res.peso);
        if (isNaN(res.peso)) {
          alert("Error obteniendo peso, por favor vuelva a intentarlo: " + res.peso);
          return;
        }
        this.pesoGramera = res.peso;
      }
    });
  }

  ocultarCodigoBarras() {
    this.CodigoBarrasPV.nativeElement.classList.remove("d-block");
    this.CodigoBarrasPV.nativeElement.classList.add("d-none");
  }

  detalleEntradaEnter(element) {
    this.document.detalle_entrada = element.value;
    if (this.codigoBarrasActivo) {
      this.CodigoBarrasPV.nativeElement.classList.add("d-block");
      this.CodigoBarrasPV.nativeElement.focus();
    } else {
      this.articuloPV.nativeElement.focus();
    }
  }

  tipoDocumentoSelect(element) {
    switch (element.value) {
      case '': {
        console.log("entrada de almacen por defecto");
        this.document.tipo_documento_id = 2;
        this.factura.nombreTipoDocumento = "ENTRADA DE ALMACEN";
        break;
      }
      case 's':
      case 'S': {
        this.document.tipo_documento_id = 6;
        console.log("salida de almacen");
        this.factura.nombreTipoDocumento = "SALIDA DE ALMACEN";
        break;
      }
      case 'r':
      case 'R': {
        this.document.tipo_documento_id = 1;
        console.log("entrada por guía");
        this.factura.nombreTipoDocumento = "ENTRADA POR GUIA.";
        break;
      }
      case 'e':
      case 'E': {
        this.document.tipo_documento_id = 2;
        this.factura.nombreTipoDocumento = "FACTURA DE VENTA";
        console.log("Factura");
        break;
      }
      default: {
        console.log("incorrecto");
        alert("Tipo de documento invalido");
        element.value = '';
        return;
      }
    }
    this.detalleEntrada.nativeElement.focus();

  }

  proveedorSelectFun(element) {
    console.log(this.proveedores);
    let proveedor = this.proveedores.find(proveedor => proveedor.nombre == element.value);
    if (proveedor == undefined) {
      this.clienteNew.nombre = element.value;
      alert("popup de creacion de proveedor");
      //$('#crearClienteModal').modal('show');
      //this.nombreCliente.nativeElement.focus();
      //this.nombreCliente.nativeElement.select();
    } else {
      console.log(proveedor);
      this.proveedorSelect = proveedor.proveedor_id;
      this.document.proveedor_id = this.proveedorSelect;
      this.factura.proveedor = proveedor;
    }
    console.log("proveedor select:" + this.proveedorSelect);
    if (this.guiaTransporteActivo) {
      this.tipoDocumentoPV.nativeElement.focus();
    } else {
      this.detalleEntrada.nativeElement.focus();
    }
  }

  tipoDocumentoFac() {
    if (this.tiposDocumento == undefined) {
      return "";
    }
    let tipoDocu: TipoDocumentoModel = this.tiposDocumento.find(tipoDocumento => tipoDocumento.tipo_documento_id === this.document.tipo_documento_id);
    return tipoDocu == undefined ? "" : tipoDocu.nombre
  }

  getTiposDocumento() {
    this.documentoService.getTiposDocumento().subscribe(res => {
      this.tiposDocumento = res;
    });
  }

  public opcionesSubmenu() {
    let usuario_id = localStorage.getItem('usuario_id');
    this.usuarioService.opcionPuntoVentaByUsuario(usuario_id).subscribe((res) => {
      this.opciones = res;
      console.log(this.opciones);
    });
  }

  getConfiguracion(empresaId: number) {
    this.clienteService.getConfiguracionByEmpresa(empresaId.toString()).subscribe(res => {
      this.configuracion = res[0];
    });
  }

  getProveedores(empresaId: number) {
    this.proveedorService.getProveedoresByEmpresa(empresaId.toString()).subscribe(res => {
      this.proveedores = res;
      console.log("lista de proveedores cargados: " + this.proveedores.length);
    });
  }

  getImpresorasEmpresa(empresaId: number) {
    this.clienteService.getImpresorasEmpresa(empresaId.toString()).subscribe(res => {
      this.impresoraEmpresa = res;
    });
  }

  getProductosByEmpresa(empresaId: number) {
    this.productoService.getProductosByEmpresa(empresaId.toString()).subscribe(res => {
      this.productosAll = res;
    });
  }

  estadoDivBotones(visible: string) {
    if (visible == "d-block") {
      this.divSiguiente.nativeElement.classList.add("d-block");
      this.divAnterior.nativeElement.classList.add("d-block");
      this.divPrimera.nativeElement.classList.add("d-block");
      this.divUltima.nativeElement.classList.add("d-block");
      this.divBuscar.nativeElement.classList.add("d-block");
      this.divCartera.nativeElement.classList.add("d-block");
      this.divCostoIva.nativeElement.classList.add("d-block");
      this.divModificar.nativeElement.classList.add("d-block");
      this.divNueva.nativeElement.classList.add("d-block");
      this.divImprimir.nativeElement.classList.add("d-block");
      this.divOpciones.nativeElement.classList.add("d-block");
      this.divFin.nativeElement.classList.add("d-block");
    } else {
      this.divSiguiente.nativeElement.classList.add("d-none");
      this.divAnterior.nativeElement.classList.add("d-none");
      this.divPrimera.nativeElement.classList.add("d-none");
      this.divUltima.nativeElement.classList.add("d-none");
      this.divBuscar.nativeElement.classList.add("d-none");
      this.divModificar.nativeElement.classList.add("d-none");
      this.divNueva.nativeElement.classList.add("d-none");
      this.divImprimir.nativeElement.classList.add("d-none");
      this.divOpciones.nativeElement.classList.add("d-none");
      this.divFin.nativeElement.classList.add("d-none");
      this.divCostoIva.nativeElement.classList.add("d-none");
      this.divCartera.nativeElement.classList.add("d-none");

      this.divSiguiente.nativeElement.classList.remove("d-block");
      this.divAnterior.nativeElement.classList.remove("d-block");
      this.divPrimera.nativeElement.classList.remove("d-block");
      this.divUltima.nativeElement.classList.remove("d-block");
      this.divBuscar.nativeElement.classList.remove("d-block");
      this.divModificar.nativeElement.classList.remove("d-block");
      this.divNueva.nativeElement.classList.remove("d-block");
      this.divImprimir.nativeElement.classList.remove("d-block");
      this.divOpciones.nativeElement.classList.remove("d-block");
      this.divFin.nativeElement.classList.remove("d-block");
      this.divCostoIva.nativeElement.classList.remove("d-block");
      this.divCartera.nativeElement.classList.remove("d-block");
    }
  }

  estadoDivProducto(visible: string) {
    if (visible == "d-block") {
      this.divCantidad.nativeElement.classList.add("d-block");
      this.divCodigo.nativeElement.classList.add("d-block");
      this.divArticulo.nativeElement.classList.add("d-block");
      this.divUnitario.nativeElement.classList.add("d-block");
      this.divParcial.nativeElement.classList.add("d-block");
      this.divCantidad.nativeElement.classList.remove("d-none");
      this.divCodigo.nativeElement.classList.remove("d-none");
      this.divArticulo.nativeElement.classList.remove("d-none");
      this.divUnitario.nativeElement.classList.remove("d-none");
      this.divParcial.nativeElement.classList.remove("d-none");

    } else {
      this.divCantidad.nativeElement.classList.add("d-none");
      this.divCodigo.nativeElement.classList.add("d-none");
      this.divArticulo.nativeElement.classList.add("d-none");
      this.divUnitario.nativeElement.classList.add("d-none");
      this.divParcial.nativeElement.classList.add("d-none");
      this.divCantidad.nativeElement.classList.remove("d-block");
      this.divCodigo.nativeElement.classList.remove("d-block");
      this.divArticulo.nativeElement.classList.remove("d-block");
      this.divUnitario.nativeElement.classList.remove("d-block");
      this.divParcial.nativeElement.classList.remove("d-block");
    }
  }

  formatearNumber(number: number) {
    let formato: string = "";
    formato = new Intl.NumberFormat().format(number);
    return formato;
  }

}
