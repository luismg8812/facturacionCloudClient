import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DocumentoModel } from '../model/documento.model';
import { UsuarioService } from '../services/usuario.service';
import { ActivacionModel } from '../model/activacion';
import { ClienteService } from '../services/cliente.service';
import { ClienteModel } from '../model/cliente.model';
import { ProductoService } from '../services/producto.service';
import { ProductoModel } from '../model/producto.model';
import { DocumentoDetalleModel } from '../model/documentoDetalle.model';
import { DocumentoService } from '../services/documento.service';
import { CalculosService } from '../services/calculos.service';
import { DocumentoDetalleService } from '../services/documento-detalle.service';
import { Router } from '@angular/router';
import { ConfiguracionModel } from '../model/configuracion.model';
import { TipoPagoModel } from '../model/tipoPago.model';
import { TipoPagoDocumentoModel } from '../model/tipoPagoDocumento.model';
import { EmpresaService } from '../services/empresa.service';
import { ImpresoraEmpresaModel } from '../model/impresoraEmpresa.model';
import { ImpresionService } from '../services/impresion.service';
import { FacturaModel } from '../vo/factura.model';
import { EmpresaModel } from '../model/empresa.model';
import { SubMenuModel } from '../model/submenu.model';
import { EmpleadoModel } from '../model/empleado.model';
import { EmpleadoService } from '../services/empleado.service';
import { TipoIdentificacionModel } from '../model/tipoIdentificacion.model';
import { TipoDocumentoModel } from '../model/tipoDocumento.model';
import { UsuarioModel } from '../model/usuario.model';
import { RolModel } from '../model/rol.model';
import { RolUsuarioModel } from '../model/rolUsuario.model';
import { SocketService } from '../services/socket.service';
import { CierreService } from '../services/cierre.service';
import { InformeDiarioModel } from '../model/informeDiario.model';
import { DocumentoInvoiceModel } from '../model/documentoInvoice.model';
import { FactTipoEmpresaModel } from '../model/factTipoEmpresa.model';
import { ProporcionModel } from '../model/proporcion.model';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-ventas-dia',
  templateUrl: './ventas-dia.component.html',
  styleUrls: ['./ventas-dia.component.css']
})
export class VentasDiaComponent implements OnInit {


  readonly IMPRESION_PANTALLA: string = '2';
  readonly PROPORCION: string = '3';
  readonly MULTIPLE_IMPRESORA: string = '4';
  readonly CODIGO_BARRAS: string = '7';
  readonly GUIA_TRANSPORTE: string = '8';
  readonly CLAVE_BORRADO: string = '9';
  readonly DESCUENTOS: string = '10';
  readonly CLIENTE_OBLIGATORIO: string = '14';
  readonly CAMBIO_PRECIO: string = '15';
  readonly EMPLEADOS: string = '18';
  readonly CLIENTE_FACTURACION: string = '19';
  readonly TIPOS_PAGOS: string = '20';
  readonly TIPO_DOCUMENTO_FACTURA: number = 10;
  readonly TIPO_DOCUMENTO_REMISION: number = 9;
  readonly ROL_ADMIN: number = 1;

  readonly TIPO_IMPRESION_TXT80MM: number = 1;
  readonly TIPO_IMPRESION_TXT50MM: number = 2;
  readonly TIPO_IMPRESION_PDF80MM: number = 4;
  readonly TIPO_IMPRESION_PDF50MM: number = 5;

  readonly INVOICE_SIN_ENVIAR: number = 1;




  @ViewChild("clientePV") clientePV: ElementRef;
  @ViewChild("tipoDocumentoPV") tipoDocumentoPV: ElementRef;
  @ViewChild("empleadoPV") empleadoPV: ElementRef;

  constructor(public usuarioService: UsuarioService,
    public clienteService: ClienteService,
    public productoService: ProductoService,
    public empleadoService: EmpleadoService,
    public socketService: SocketService,
    public cierreService: CierreService,
    public documentoService: DocumentoService, public calculosService: CalculosService, public documentoDetalleService: DocumentoDetalleService,
    private router: Router, public empresaService: EmpresaService, public impresionService: ImpresionService) { }

  public document: DocumentoModel;
  public tiposDocumento: Array<TipoDocumentoModel>;
  public tituloFactura: string;
  public activaciones: Array<ActivacionModel>;
  public clientes: Array<ClienteModel>;
  public impresoraEmpresa: Array<ImpresoraEmpresaModel>;
  public configuracion: ConfiguracionModel;
  public productosAll: Array<ProductoModel>;
  public usuarios: Array<UsuarioModel>;
  public tipoPagosAll: Array<TipoPagoModel>;
  public clienteActivo: boolean = false;
  public crearClienteVisible: boolean = false;
  public guiaTransporteActivo: boolean = false;
  public clienteObligatorioActivo: boolean = false;
  public empreadoActivo: boolean = false;
  public codigoBarrasActivo: boolean = false;
  public descuentosActivo: boolean = false;
  public cambioPrecioActivo: boolean = false;
  public claveBorradoActivo: boolean = false;
  public proporcionActivo: boolean = false;
  public impresionPantallaActivo: boolean = false;
  public multipleImpresoraActivo: boolean = false;
  public TipoPagosActivo: boolean = false;
  public clienteSelect: number;
  public empresaId: number;
  public usuarioId: number;
  public tipoDocumentSelect: number;
  public empleadoSelect: string;
  public productoIdSelect: ProductoModel;
  public imp: string;
  public productos: Array<DocumentoDetalleModel>;
  public detalleBorrado: DocumentoDetalleModel;
  public factura: FacturaModel;
  public opciones: Array<SubMenuModel>;
  public empleados: Array<EmpleadoModel>;
  public documentosList: Array<DocumentoModel> = [];
  public indexSelect: number = 0;
  public indexModificarSelect: number = 0;
  public clienteNew: ClienteModel = new ClienteModel();
  public tipoIdentificacionList: Array<TipoIdentificacionModel> = [];
  public tipoEmpresaList: Array<FactTipoEmpresaModel> = [];
  public proporcion: ProporcionModel;
  public tiposPagosDocumento: TipoPagoDocumentoModel[] = [];



  public modificarFactura: boolean = false;
  public claveBorrado: boolean = false;
  public divGramera: boolean = false;
  public pesoGramera: number = 0.0;
  public informeDiario: InformeDiarioModel;

  @ViewChild("CodigoBarrasPV") CodigoBarrasPV: ElementRef;
  @ViewChild("articuloPV") articuloPV: ElementRef;
  @ViewChild("codigoPV") codigoPV: ElementRef;
  @ViewChild("cantidadPV") cantidadPV: ElementRef;
  @ViewChild("precioPV") precioPV: ElementRef;
  @ViewChild("grameraPV") grameraPV: ElementRef;
  @ViewChild("unitarioPV") unitarioPV: ElementRef;


  //botones de acciones
  @ViewChild("siguientePV") siguientePV: ElementRef;
  @ViewChild("anteriorPV") anteriorPV: ElementRef;
  @ViewChild("primeraPV") primeraPV: ElementRef;
  @ViewChild("ultimaPV") ultimaPV: ElementRef;
  @ViewChild("buscarPV") buscarPV: ElementRef;
  @ViewChild("modificarPV") modificarPV: ElementRef;

  @ViewChild("nuevaPV") nuevaPV: ElementRef;
  @ViewChild("imprimirPV") imprimirPV: ElementRef;
  @ViewChild("opcionPV") opcionPV: ElementRef;
  @ViewChild("finPV") finPV: ElementRef;
  @ViewChild("cambiarPrecioPV") cambiarPrecioPV: ElementRef;
  @ViewChild("insertarPV") insertarPV: ElementRef;
  @ViewChild("borrarPV") borrarPV: ElementRef;
  @ViewChild("modificarUnitarioPV") modificarUnitarioPV: ElementRef;
  @ViewChild("claveBorradoPV") claveBorradoPV: ElementRef;



  //div botones de acciones
  @ViewChild("divSiguiente") divSiguiente: ElementRef;
  @ViewChild("divAnterior") divAnterior: ElementRef;
  @ViewChild("divPrimera") divPrimera: ElementRef;
  @ViewChild("divUltima") divUltima: ElementRef;
  @ViewChild("divBuscar") divBuscar: ElementRef;
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
  @ViewChild("enPantallaLavel") enPantallaLavel: ElementRef; // div de donde se busca el articulo



  //impresion

  @ViewChild("downloadZipLink") downloadZipLink: ElementRef;
  @ViewChild("impresoraLavel") impresoraLavel: ElementRef;
  @ViewChild("impresoraPV") impresoraPV: ElementRef; // controla la impresora que se desea imprimir
  @ViewChild("descuentoPV") descuentoPV: ElementRef;
  @ViewChild("descuentoLavel") descuentoLavel: ElementRef;
  @ViewChild("tipoPagoLavel") tipoPagoLavel: ElementRef;
  @ViewChild("tipoPagoPV") tipoPagoPV: ElementRef;
  @ViewChild("valorTipoPagoLavel") valorTipoPagoLavel: ElementRef;
  @ViewChild("valorTipoPagoPV") valorTipoPagoPV: ElementRef;
  @ViewChild("efectovoPV") efectovoPV: ElementRef;
  @ViewChild("continuaImpresionPV") continuaImpresionPV: ElementRef;
  @ViewChild("cuadreCajaModal") cuadreCajaModal: ElementRef;
  @ViewChild("buscarDocumentoXFecha") buscarDocumentoXFecha: ElementRef;
  @ViewChild("editarProducto") editarProducto: ElementRef;


  //cliente
  @ViewChild("nombreCliente") nombreCliente: ElementRef;



  ngOnInit() {
    this.empresaId = Number(localStorage.getItem("empresa_id"));
    this.estadoDivBotones("d-block");
    this.siguientePV.nativeElement.focus();
    this.estadoDivProducto("d-none") // se muestra el div de producto
    this.CodigoBarrasPV.nativeElement.classList.add("d-none");
    this.usuarioId = Number(localStorage.getItem("usuario_id"));
    this.factura = new FacturaModel();
    localStorage.removeItem("documentoIdSelect");
    localStorage.removeItem("productoIdSelect");
    this.getProductosByEmpresa(this.empresaId);
    this.clienteActivo = false;
    this.guiaTransporteActivo = false;
    this.clienteObligatorioActivo = false;
    this.empreadoActivo = false;
    this.codigoBarrasActivo = false;
    this.clienteSelect = null;
    this.tipoDocumentSelect = null;
    this.empleadoSelect = "";
    this.document = new DocumentoModel();
    this.productos = [];
    this.getActivaciones(this.usuarioId);
    this.tipoPagoPV.nativeElement.title = '1.Efectivo 2.Credito 3.Cheque 4.Consignación 5.Tarjeta 6.Vale.';
    this.getclientes(this.empresaId);
    this.getEmpleados(this.empresaId);
    this.getUsuarios(this.empresaId);
    this.getConfiguracion(this.empresaId);

    this.getImpresorasEmpresa(this.empresaId);
    this.opcionesSubmenu();
    this.getTipoIdentificacion();
    this.getTiposDocumento();
    this.getTipoEmpresa();
    this.getTipoPago();
  }


  clienteSelectFun(element) {
    console.log(element.value);
    if (this.clienteObligatorioActivo && element.value == '') {
      alert("El cliente es obligatorio");
      return;
    }
    let cliente = this.clientes.find(cliente => (cliente.nombre + " " + cliente.apellidos + " - " + cliente.documento) == element.value);
    if (this.clienteObligatorioActivo && cliente == undefined) {
      alert("El cliente " + element.value + " no existe, presione la tecla lado derecho para crearlo");
      return;
    }
    if (!this.clienteObligatorioActivo && element.value == '') {
      cliente = this.clientes.find(cliente => cliente.cliente_id == 1);//trae cliente varios por defecto
    }
    console.log(cliente);
    this.clienteSelect = cliente.cliente_id;
    this.document.cliente_id = this.clienteSelect;
    this.factura.cliente = cliente;
    //this.clientePV.nativeElement.value=cliente.nombre+" "+cliente.apellidos+" - "+cliente.documento ; 
    //console.log(cliente.nombre+" "+cliente.apellidos+" - "+cliente.documento );
    console.log("cliente select:" + this.clienteSelect);
    if (this.guiaTransporteActivo) {
      this.tipoDocumentoPV.nativeElement.focus();
    } else {
      if (this.empreadoActivo) {
        this.empleadoPV.nativeElement.focus();
      } else {
        if (this.codigoBarrasActivo) {
          this.CodigoBarrasPV.nativeElement.classList.add("d-block");
          this.CodigoBarrasPV.nativeElement.focus();
        } else {
          this.articuloPV.nativeElement.focus();
        }
      }
    }

  }

  async CrearCliente(element) {
    // console.log(this.clienteNew);

    if (element.value != 'S') {
      $('#crearClienteModal').modal('hide');
      await this.delay(100);
      this.clientePV.nativeElement.focus();
      this.crearClienteVisible = false;
      return;
    }
    this.crearClienteVisible = false;
    let valido: boolean = true;
    let mensageError: string = "Son obligatorios:\n ";
    if (this.clienteNew.nombre == "") {
      mensageError += "nombre\n";
      valido = false;
    }
    if (this.clienteNew.documento == "") {
      mensageError += "Identificación\n";
      valido = false;
    }
    if (this.clienteNew.tipo_identificacion_id == null) {
      mensageError += "tipo documento\n";
      valido = false;
    }
    if (this.clienteNew.fact_tipo_empresa_id == null) {
      mensageError += "tipo empresa\n";
      valido = false;
    }
    if (this.clienteNew.fijo == "" && this.clienteNew.celular == "") {
      mensageError += "telefono fijo o Celular\n";
      valido = false;
    }
    if (this.clienteNew.direccion == "") {
      mensageError += "Dirección\n";
      valido = false;
    }
    if (this.clienteNew.mail == "") {
      mensageError += "Mail\n";
      valido = false;
    }

    if (valido == false) {
      alert(mensageError);
      return;
    } else {

    }
    let cliente = this.clientes.find(cliente => (cliente.documento) == this.clienteNew.documento);
    if (cliente != undefined) {
      alert("El cliente que está intentando crear ya se incuentra registrado bajo el \nnombre: " + cliente.nombre + " " + cliente.apellidos + "\n" + "NIT: " + cliente.documento);
      return;
    }

    this.clienteNew.empresa_id = this.empresaId;
    this.clienteService.saveCliente(this.clienteNew).subscribe(async res => {
      if (res.code == 200) {
        this.clienteSelect = this.clienteNew.cliente_id;
        this.document.cliente_id = this.clienteSelect;
        this.factura.cliente = this.clienteNew;
        //this.clienteNew = new ClienteModel();
        $('#crearClienteModal').modal('hide');
        await this.delay(100);

        if (this.guiaTransporteActivo) {
          this.tipoDocumentoPV.nativeElement.focus();
        } else {
          if (this.empreadoActivo) {
            this.empleadoPV.nativeElement.focus();
          } else {
            if (this.codigoBarrasActivo) {
              this.CodigoBarrasPV.nativeElement.classList.add("d-block");
              this.CodigoBarrasPV.nativeElement.focus();
            } else {
              this.articuloPV.nativeElement.focus();
            }
          }
        }
        this.clientePV.nativeElement.value = this.clienteNew.nombre + " " + this.clienteNew.apellidos + " - " + this.clienteNew.documento;


        this.clientes.unshift(this.clienteNew);
        this.clienteNew = new ClienteModel();
      } else {
        alert("error creando cliente, por favor inicie nuevamente la creación del cliente, si persiste consulte a su proveedor");
        return;
      }
    });
  }

  tipoDocumentoSelect(element) {
    switch (element.value) {
      case '': {
        console.log("factura de venta por defecto");
        this.tipoDocumentSelect = 10;
        this.factura.nombreTipoDocumento = "FACTURA DE VENTA";
        break;
      }
      case 'c':
      case 'C': {
        this.tipoDocumentSelect = 4;
        console.log("cotizacion");
        this.factura.nombreTipoDocumento = "COTIZACIÓN";
        break;
      }
      case 'r':
      case 'R': {
        this.tipoDocumentSelect = 9;
        console.log("remision");
        this.factura.nombreTipoDocumento = "FACTURA DE VENTA.";
        break;
      }
      case 'f':
      case 'F': {
        this.tipoDocumentSelect = 10;
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
    this.document.tipo_documento_id = this.tipoDocumentSelect;
    if (this.empreadoActivo) {
      this.empleadoPV.nativeElement.focus();
    } else {
      if (this.codigoBarrasActivo) {
        this.CodigoBarrasPV.nativeElement.classList.add("d-block");
        this.CodigoBarrasPV.nativeElement.focus();
      } else {
        this.articuloPV.nativeElement.focus();
      }
    }
  }

  tipoDocumentoFac() {
    if (this.tiposDocumento == undefined) {
      return "";
    }
    let tipoDocu: TipoDocumentoModel = this.tiposDocumento.find(tipoDocumento => tipoDocumento.tipo_documento_id === this.document.tipo_documento_id);
    return tipoDocu == undefined ? "" : tipoDocu.nombre
  }

  empleadoSelectFunt(element) {

    if (this.codigoBarrasActivo) {
      this.CodigoBarrasPV.nativeElement.classList.add("d-block");
      this.CodigoBarrasPV.nativeElement.focus();
    } else {
      this.articuloPV.nativeElement.focus();
    }
    let empleado = this.empleados.find(empleado => empleado.nombre == element.value);

    if (empleado == undefined) {
      // return;
    } else {
      console.log(empleado);
      this.empleadoSelect = element.value;
      this.document.empleado_id = empleado.empleado_id;
      this.factura.nombreEmpleado = empleado.nombre + " " + empleado.apellido;
      console.log(empleado.nombre + " " + empleado.apellido);
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

  ocultarCodigoBarras() {
    this.CodigoBarrasPV.nativeElement.classList.remove("d-block");
    this.CodigoBarrasPV.nativeElement.classList.add("d-none");
  }

  productoEnter(element) {
    if (element.value == '') {
      this.codigoPV.nativeElement.value = "";
      this.codigoPV.nativeElement.focus();
    }
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

  async findByProducto() {
    this.unitarioPV.nativeElement.value = this.productoIdSelect.costo_publico;
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

  getGramera() {
    console.log(this.configuracion);
    this.socketService.getPesoGramera(this.configuracion).subscribe(res => {
      if (res == undefined) {
        alert("Error tratando de conectar con la gramera");
        return;
      } else {
        // console.log(res);
        if (isNaN(res)) {
          alert("Error obteniendo peso, por favor vuelva a intentarlo: " + res);
          return;
        }
        this.pesoGramera = res;
      }
    });
  }

  getImprimirFisico(fileName: string) {
    if (localStorage.getItem("socket") == 'true') {
      this.socketService.getImprimirFisico(fileName).subscribe(res => {
      });
    } else {
      console.error("no se detecta socket instalado para impresion automatica");
    }

  }



  enterTecla(element) {
    //await this.delay(550);
    console.log(element.id);
    if (element.id == "nuevaPV") {
      this.nuevafactura();
    }
    if (element.id == 'clientePV') {
      this.clienteSelectFun(element);
    }
    if (element.id == "tipoDocumentoPV") {
      this.tipoDocumentoSelect(element);
    }
    if (element.id == "empleadoPV") {
      this.empleadoSelectFunt(element);
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

    if (element.id == "grameraPV") {
      this.precioGrameraEnter(element);
    }


    if (element.id == "descuentoPV") {
      this.descuentoEnter();
    }
    if (element.id == "impresoraPV") {
      this.impresoraEnter();
    }
    if (element.id == "tipoPagoPV") {
      this.tipoPagoEnter(element);

    }
    if (element.id == "valorTipoPagoPV") {
      this.calcularTiposPagos(element);

    }
    if (element.id == "enPantallaPV") {
      this.continuaImpresionPV.nativeElement.focus();
    }

    if (element.id == "continuaImpresionPV") {
      this.enterContinuarImpresion(element);

    }
    if (element.id == "unitarioPV") {
      this.unitarioEnter(element);
    }

    if (element.id == "siguientePV") {
      this.teclaAnteriorSiguiente('s');
    }
    if (element.id == "anteriorPV") {
      this.teclaAnteriorSiguiente('a');
    }
    if (element.id == "primeraPV") {
      this.teclaAnteriorSiguiente('p');
    }
    if (element.id == "ultimaPV") {
      this.teclaAnteriorSiguiente('u');
    }
    if (element.id == "modificarPV") {
      this.modificarEnter();
    }
    if (element.id == "cambiarPrecioPV") {
      this.cambiarPrecio(element);
    }
    if (element.id == "modificarUnitarioPV") {
      this.cambiarPrecio(element);
    }
    if (element.id == "claveBorradoPV") {
      this.verificarClaveBorrado(element);
    }


    if (element.id == "cuadreCajaPV") {
      this.cuadreCajaModal.nativeElement.click();
    }

    if (element.id == "documentosXFechaPV") {
      this.buscarDocumentoXFecha.nativeElement.click();
    }
    if (element.id == "EditarProductos") {
      this.editarProducto.nativeElement.click();
    }


  }

  tipoPagoEnter(element) {
    if (element.value != "") {
      let tipoPago = this.tipoPagosAll.find(usua => usua.tipo_pago_id == element.value);
      if (tipoPago == undefined) {
        alert("Tipo de pago no valido")
        return;
      }
    }
    this.valorTipoPagoPV.nativeElement.focus();
    this.valorTipoPagoPV.nativeElement.select();
  }

  calcularTiposPagos(element) {
    // aqui voy toca verificar si el tipo de pago esta en la lista sino retorna con un mensaje  y va agregando tipos de pago hasta que se concrete el finally, hacer validaciones de topes maximos y minimos
    let tipoId = this.tipoPagoPV.nativeElement.value;
    let tipoPagoDocumento: TipoPagoDocumentoModel = new TipoPagoDocumentoModel();
    if (tipoId != "") {
      if (element.value <= 0 || element.value == "" || isNaN(element.value)) {
        alert("cantidad invalida");
        return;
      }
      tipoPagoDocumento.tipo_pago_id = tipoId;
    } else {
      tipoPagoDocumento.tipo_pago_id = 1;//efectivo por defecto
    }
    //si no se agrega un tipo de pago se agrega efectivo por defecto efectivo 
    tipoPagoDocumento.documento_id = this.document.documento_id;
    tipoPagoDocumento.fecha_registro = new Date;
    tipoPagoDocumento.valor = element.value;
    this.tiposPagosDocumento.unshift(tipoPagoDocumento);
    let suma: number = 0;
    for (let sum of this.tiposPagosDocumento) {
      suma = suma + Number(sum.valor);
    }
    this.document.cambio = Number(suma) - Number(this.document.total);
    if (suma < Number(this.document.total) && tipoId != "") {
      this.tipoPagoPV.nativeElement.focus();
      this.tipoPagoPV.nativeElement.select();
    } else {
      if (this.impresionPantallaActivo) {
        this.enPantallaPV.nativeElement.focus();
      } else {
        this.continuaImpresionPV.nativeElement.focus();
      }

    }
  }

  verificarClaveBorrado(element) {
    let usuario = this.usuarios.find(usua => usua.clave === element.value);
    console.log(usuario);
    if (usuario == undefined) {
      alert("Clave incorrecta!!");
      this.claveBorradoPV.nativeElement.focus();
      return;
    }
    this.usuarioService.getRolByUsuario(usuario.usuario_id).subscribe(res => {
      let rolusurio: RolUsuarioModel[] = res;
      console.log(rolusurio[0]);
      let admin = rolusurio.find(rol => rol.rol_id === this.ROL_ADMIN); //se compara con el id del rol admin
      if (admin == undefined) {
        alert("La clave no pertenece a un usuario administrador!!");
        this.claveBorradoPV.nativeElement.focus();
        return;
      } else {
        this.borradoPosClave(this.detalleBorrado);
      }
    });
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

  asigarEliminar() {
    if (this.productos.length == 0) {
      alert("Debe seleccionar un documento con productos para poder editarlo");
      return;
    }
    let idModificarSelect = "b_" + this.productos[0].documento_detalle_id;
    this.indexModificarSelect = 0;
    $("#" + idModificarSelect).focus();
  }

  modificarEnter() {
    this.modificarFactura = true;
  }

  unitarioEnter(element) {
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
    this.productos.splice(0, 1);
    anterior.estado = 0;
    this.documentoDetalleService.updateDocumentoDetalle(anterior).subscribe(res => {
      if (res.code == 200) {
        this.asignarDocumentoDetalle(anterior.cantidad, element.value);
        console.log("cambio de precio:" + element.value);
      }
    });

  }


  enterContinuarImpresion(element) {
    if (this.document.documento_id == "") {
      alert("El documento esta corructo, por favor vuelva a crearlo");
      return;
    }
    $('#imprimirModal').modal('hide');
    //$("#imprimirModal").on('shown.bs.modal', () => {

    //});
    this.calcularProporcion();
    console.log(this.configuracion);
    let numImpresiones = this.configuracion.numero_impresion;
    let impresora: string = this.impresoraPV.nativeElement.value;
    if (impresora == "") {
      impresora = '1';
    }
    this.document.impresora = Number(impresora);
    if (this.document.cliente_id == null) {
      //si el cliente es nulo se asigna el varios por defecto
      this.document.cliente_id = 1;
      let cliente = this.clientes.find(cliente => cliente.cliente_id == this.document.cliente_id);
      this.factura.cliente = cliente;
    }
    //this.document.mac= Calculos.conseguirMAC2()); ver como se hace la mag desde el cliente..
    this.document.impreso = 1;
    let cancelado: boolean = false; //se sabe si el documento es para cancelacion o no 
    this.verificarDescuento();
    this.asignarTipoPago();
    this.asignarConsecutivo(numImpresiones, cancelado);



  }

  calcularInfoDiario(anulado: boolean) {
    console.log("entra a calcular info diario");
    this.cierreService.getInfoDiarioByDate(this.empresaId, this.calculosService.formatDate(this.document.fecha_registro, false), this.calculosService.formatDate(this.document.fecha_registro, false)).subscribe(res => {

      if (res.length == 0) {
        this.informeDiario = new InformeDiarioModel();
      } else {
        this.informeDiario = res[0];
        console.log(this.informeDiario);
      }
      this.informeDiario = this.calculosService.calcularInfoDiario(this.document, this.informeDiario, anulado);
      this.informeDiario.fecha_ingreso = this.document.fecha_registro;
      this.informeDiario.fecha_informe = this.calculosService.formatDate(this.document.fecha_registro, false);
      if (this.informeDiario.informe_diario_id == null) {
        this.informeDiario.empresa_id = this.empresaId;
        console.log(this.informeDiario.fecha_ingreso);
        this.cierreService.saveInformeDiario(this.informeDiario).subscribe(res => {
          if (res.code != 200) {
            alert("error creando informe diario");
            return;
          }
        });
      } else {
        this.cierreService.updateInformeDiario(this.informeDiario).subscribe(res => {
          if (res.code != 200) {
            alert("error actualizando informe diario");
            return;
          }
        });
      }
    });
  }

  asignarTipoPago() {
    let des1 = this.descuentoPV.nativeElement.value;
    let tiposPagosList: TipoPagoModel[] = [];
    if (des1 == "") { //no se por que tiene que ver con el descuento... validar esta parte
      //si no se agrega un tipo de pago se agrega efectivo por defecto efectivo 
      for (let tipo of this.tiposPagosDocumento) {
        this.documentoService.saveTipoPagoDocumento(tipo).subscribe();
      }
    } else {

    }
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

  imprimirFactura(numeroImpresiones: number, empresa: EmpresaModel) {
    console.log("entra a imprimir factura");
    let tituloDocumento: string = "";

    let pantalla = this.enPantallaPV.nativeElement.value;
    if (pantalla == 'S' || pantalla == 's') {
      pantalla = "pantalla";
    }
    if (numeroImpresiones == undefined) {
      numeroImpresiones = 1;
    }
    let tipoImpresion = 0;

    let impresora = this.document.impresora;
    for (var i = 0; i < this.impresoraEmpresa.length; i++) {
      console.log(numeroImpresiones);
      if (impresora == Number(this.impresoraEmpresa[i].numero_impresora)) {
        tipoImpresion = this.impresoraEmpresa[i].tipo_impresion_id;
      }
    }
    console.log(tipoImpresion);
    tituloDocumento = this.tituloFactura + "_" + this.document.consecutivo_dian + "_" + impresora + "_" + pantalla + "_" + numeroImpresiones + "_" + tipoImpresion;
    let formato = "";
    this.factura.documento = this.document;
    this.factura.detalle = this.productos
    this.factura.titulo = tituloDocumento;
    this.factura.empresa = empresa;
    this.factura.nombreUsuario = localStorage.getItem("nombreUsuario");
    for (var i = 0; i < numeroImpresiones; i++) {
      switch (tipoImpresion) {
        case this.TIPO_IMPRESION_TXT80MM:
          formato = ".txt";
          this.descargarArchivo(this.impresionService.imprimirFacturaTxt80(this.factura, this.configuracion), tituloDocumento + formato);
          break;
        case this.TIPO_IMPRESION_TXT50MM:
          formato = ".txt";
          this.descargarArchivo(this.impresionService.imprimirFacturaTxt50(this.factura, this.configuracion), tituloDocumento + formato);
          break;
        case this.TIPO_IMPRESION_PDF80MM:
          formato = ".pdf";
          this.impresionService.imprimirFacturaPdf80(this.factura, this.configuracion, false);
          break;
        case this.TIPO_IMPRESION_PDF50MM:
          formato = ".pdf";
          this.impresionService.imprimirFacturaPdf50(this.factura, this.configuracion, false);
          break;
        default:
          alert("no tiene un tipo impresion");
          //return;
          //Impresion.imprimirPDF(getDocumento(), getProductos(), usuario(), configuracion, impresora,
          //    enPantalla, e);
          break;
      }
      this.getImprimirFisico(tituloDocumento + formato);
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

  asignarConsecutivo(numImpresiones: number, cancelado: boolean) {
    this.empresaService.getEmpresaById(this.empresaId.toString()).subscribe(res => {
      let empr = res;
      console.log(empr);
      let con: number;
      let consecutivo: string;
      switch (this.document.tipo_documento_id) {
        case 9:
          con = empr[0].consecutivo;
          consecutivo = res[0].letra_consecutivo + con;
          this.document.consecutivo_dian = consecutivo;
          console.log("consecutivo documentoId: " + consecutivo);
          this.tituloFactura = "FACTURA DE VENTA.";
          break;
        case 4:
          this.document.consecutivo_dian = this.document.documento_id// es necesario asignar el
          // consecutivo dian
          console.log("consecutivo Cotizacion: " + this.document.consecutivo_dian);
          this.tituloFactura = "No. DE COTIZACIÓN";
          break;
        default:
          console.log(empr[0].consecutivo);
          con = empr[0].consecutivo + 1;

          let topeConsecutivo = res[0].autorizacion_hasta;
          let consegutivo = con;
          if (consegutivo + 500 > topeConsecutivo) {
            alert(" se esta agotando el consegutivo DIAN");
          }
          if (consegutivo > topeConsecutivo) {
            alert("Se agotó el consecutivo DIAN");
            return;
          }
          consecutivo = con.toString();
          console.log("consecutivo Dian: " + consecutivo);
          this.document.consecutivo_dian = consecutivo;
          this.tituloFactura = "FACTURA DE VENTA";
          res[0].consecutivo = con;
          break;
      }
      this.calcularInfoDiario(cancelado);
      this.empresaService.updateConsecutivoEmpresa(empr[0]).subscribe(emp => {
        console.log("consecutivo actualizado");
        console.log(this.document);
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



    });
  }


  calcularProporcion() {
    // console.log(this.proporcionActivo);
    // console.log(this.document.tipo_documento_id == this.TIPO_DOCUMENTO_FACTURA);
    if (this.proporcionActivo && (this.document.tipo_documento_id == this.TIPO_DOCUMENTO_FACTURA
      || this.document.tipo_documento_id == this.TIPO_DOCUMENTO_REMISION)) {

      console.log("Entra al calculo de proporción");
      if (this.proporcion == undefined) {
        console.error("proporcion no hallada para la empresa");
        return;
      }
      let numero: number = this.proporcion.variable / this.proporcion.base;
      console.log("numero para proporcion : " + numero);
      let contaRemision = this.proporcion.contador_remision;
      let contaFactura = this.proporcion.contador_factura;
      let numeroProporcion = contaRemision / contaFactura;
      console.log("numero proporcion: " + numeroProporcion);
      let fecha = new Date();
      let dia = fecha.getDate();
      let rangoA: number;
      let rangoB: number;
      if (dia % 2 == 0) {
        rangoA = this.proporcion.rango_par_a;
        rangoB = this.proporcion.rango_par_b;
      } else {
        rangoA = this.proporcion.rango_inpar_a;
        rangoB = this.proporcion.rango_inpar_b;
      }
      let totaldocu = this.document.total;
      if (this.document.cliente_id != 1) {
        if (this.document.tipo_documento_id == this.TIPO_DOCUMENTO_FACTURA) {
          this.proporcion.contador_factura = (Number(contaFactura) + 1);
          this.factura.nombreTipoDocumento = "FACTURA DE VENTA";
        }
      } else {
        if ((totaldocu >= rangoA && totaldocu <= rangoB) || numero > numeroProporcion) {
          this.proporcion.contador_remision = (Number(contaRemision) + 1);
          this.document.tipo_documento_id = this.TIPO_DOCUMENTO_REMISION;
          this.factura.nombreTipoDocumento = "FACTURA DE VENTA.";
        } else {
          this.document.tipo_documento_id = this.TIPO_DOCUMENTO_FACTURA;
          this.proporcion.contador_factura = (Number(contaFactura) + 1);
          this.factura.nombreTipoDocumento = "FACTURA DE VENTA";
        }
      }
      this.usuarioService.updateProporcion(this.proporcion).subscribe(up => { });

    }
  }

  cancelarImpresion() {
    console.log("presiona cancelar impresion");
    this.divImprimirModal.nativeElement.classList.remove("d-block");
    this.divImprimirModal.nativeElement.classList.add("d-none");
    this.scapeTecla(null);
  }



  impresoraEnter() {
    if (this.TipoPagosActivo) {
      this.tipoPagoPV.nativeElement.focus();
    } else {
      this.enPantallaPV.nativeElement.focus();
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

  precioGrameraEnter(element) {

    if (this.codigoBarrasActivo) {
      this.CodigoBarrasPV.nativeElement.classList.add("d-block");
      this.CodigoBarrasPV.nativeElement.focus();
    } else {
      this.articuloPV.nativeElement.focus();
    }

    let facturar = element.value;
    this.articuloPV.nativeElement.value = "";
    this.CodigoBarrasPV.nativeElement.value = "";

    console.log("precio enter:" + facturar);
    if (facturar != "S") {
      return;
    }
    this.asignarDocumento(this.pesoGramera);
    this.pesoGramera = 0.0;
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
        this.productoIdSelect.cantidad = newCantidad + anterior.cantidad;
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

  async borrarLista(detalle: DocumentoDetalleModel, element) {
    if (this.claveBorradoActivo) {
      this.claveBorrado = true;
      await this.delay(100);
      this.claveBorradoPV.nativeElement.focus();
      this.detalleBorrado = detalle;
    } else {
      this.borradoPosClave(detalle);
    }

  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
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

  private asignarDocumento(cantidad) {
    if (this.document.documento_id == "") {
      this.document.fecha_registro = this.calculosService.fechaActual();
      this.document.usuario_id = this.usuarioId;
      this.document.empresa_id = this.empresaId;
      this.document.invoice_id = this.INVOICE_SIN_ENVIAR;
      this.documentoService.saveDocumento(this.document).subscribe(res => {
        if (res.code == 200) {
          this.document.documento_id = res.documento_id;
          this.document.fecha_registro = res.fecha_registro;
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
          this.asignarDocumentoDetalle(cantidad, this.productoIdSelect.costo_publico);
        } else {
          alert("error creando documento, por favor inicie nuevamente la creación del documento");
          return;
        }
      });
    } else {
      this.asignarDocumentoDetalle(cantidad, this.productoIdSelect.costo_publico);
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
    if (this.document.tipo_documento_id == null) {//si es nulo se asigna factura por defecto
      this.document.tipo_documento_id = this.TIPO_DOCUMENTO_FACTURA;
    }
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
      this.productoIdSelect.cantidad = newCantidad - docDetalle.cantidad;
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

  async scapeTecla(element) {
    if (element != null && element.id == 'nombreCliente') {
      this.crearClienteVisible = true;
      await this.delay(100);
      $('#confirmarCliente').val("S");
      $('#confirmarCliente').focus();
      $('#confirmarCliente').select();
      return;
    }
    if (element != null && (element.id == 'descuentoPV' ||
      element.id == 'impresoraPV' ||
      element.id == 'tipoPagoPV' ||
      element.id == 'efectovoPV' ||
      element.id == 'enPantallaPV' ||
      element.id == 'continuaImpresionPV'
    )) {
      $('#imprimirModal').modal('hide');
      this.siguientePV.nativeElement.focus();
      return;
    }

    this.estadoDivBotones("d-block");
    this.estadoDivProducto("d-none") // se muestra el div de producto
    this.divImprimirModal.nativeElement.classList.remove("d-block");
    this.divImprimirModal.nativeElement.classList.add("d-none");
    this.siguientePV.nativeElement.focus();
    this.modificarFactura = false;
    this.claveBorrado = false;

  }

  async controlTeclasCliente(event, element) {
    if (event.keyCode == 39) { //cuando se presiona la tacla derecha 			     	
      if (element.id == 'clientePV') {
        this.clienteNew.nombre = element.value;
        $('#crearClienteModal').modal('show');
        $("#crearClienteModal").on('shown.bs.modal', () => {
          this.nombreCliente.nativeElement.focus();
          this.nombreCliente.nativeElement.select();
        });
      }
    }
    if (event.keyCode == 13) { //cuando se presiona la tacla enter 			     	
      if (element.id == 'clientePV') {
        this.clienteSelectFun(element);
      }
    }

    if (event.keyCode == 40 || event.keyCode == 13) { //cuando se presiona la tacla abajo
      if (element.id == 'nombreCliente') {
        $('#segundoNombreCliente').focus();
        $('#segundoNombreCliente').select();
        return;
      }
      if (element.id == 'segundoNombreCliente') {
        $('#apellidoCliente').focus();
        $('#apellidoCliente').select();
        return;
      }
      if (element.id == 'apellidoCliente') {
        $('#segundoApellidoCliente').focus();
        $('#segundoApellidoCliente').select();
        return;
      }
      if (element.id == 'segundoApellidoCliente') {
        $('#tipoIdentificacion').focus();
        $('#tipoIdentificacion').select();
        return;
      }
      if (element.id == 'tipoIdentificacion') {
        $('#documentoCliente').focus();
        $('#documentoCliente').select();
        return;
      }
      if (element.id == 'documentoCliente') {
        let cliente = this.clientes.find(cliente => cliente.documento == element.value);

        if (cliente == undefined) {
          $('#direccionCliente').focus();
          $('#direccionCliente').select();
        } else {
          alert("El cliente que está intentando crear ya se incuentra registrado bajo el \nnombre: " + cliente.nombre + " " + cliente.apellidos + "\n" + "NIT: " + cliente.documento);
          $('#documentoCliente').focus();
          $('#documentoCliente').select();
        }

        return;
      }
      if (element.id == 'direccionCliente') {
        $('#fijoCliente').focus();
        $('#fijoCliente').select();
        return;
      }
      if (element.id == 'fijoCliente') {
        $('#celular').focus();
        $('#celular').select();
        return;
      }
      if (element.id == 'celular') {
        $('#mailCliente').focus();
        $('#mailCliente').select();
        return;
      }
      if (element.id == 'mailCliente') {
        $('#tipoEmpresa').focus();
        $('#tipoEmpresa').select();
        return;
      }
      if (element.id == 'tipoEmpresa') {
        $('#retencion').focus();
        $('#retencion').select();
        return;
      }
    }
    if (event.keyCode == 38) { //cuando se presiona la tacla arriba
      if (element.id == 'segundoNombreCliente') {
        $('#nombreCliente').focus();
        $('#nombreCliente').select();
        return;
      }
      if (element.id == 'apellidoCliente') {
        $('#segundoNombreCliente').focus();
        $('#segundoNombreCliente').select();
        return;
      }
      if (element.id == 'segundoApellidoCliente') {
        $('#apellidoCliente').focus();
        $('#apellidoCliente').select();
        return;
      }
      if (element.id == 'tipoIdentificacion') {
        $('#segundoApellidoCliente').focus();
        $('#segundoApellidoCliente').select();
        return;
      }
      if (element.id == 'documentoCliente') {
        $('#tipoIdentificacion').focus();
        $('#tipoIdentificacion').select();
        return;
      }
      if (element.id == 'direccionCliente') {
        $('#documentoCliente').focus();
        $('#documentoCliente').select();
        return;
      }
      if (element.id == 'fijoCliente') {
        $('#direccionCliente').focus();
        $('#direccionCliente').select();
        return;
      }
      if (element.id == 'celular') {
        $('#fijoCliente').focus();
        $('#fijoCliente').select();
        return;
      }
      if (element.id == 'mailCliente') {
        $('#celular').focus();
        $('#celular').select();
        return;
      }
      if (element.id == 'tipoEmpresa') {
        $('#mailCliente').focus();
        $('#mailCliente').select();
        return;
      }
      if (element.id == 'retencion') {
        $('#tipoEmpresa').focus();
        $('#tipoEmpresa').select();
        return;
      }
    }

  }

  controlTeclas(event, element) {
    if (event.keyCode == 39) { //cuando se presiona la tacla derecha 			     	
      if (element.id == 'clientePV') {
        this.clienteNew.nombre = element.value;
        $('#crearClienteModal').modal('show');
        this.nombreCliente.nativeElement.focus();
        this.nombreCliente.nativeElement.select();
      }
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
      if (element.id == 'modificarPV') {
        this.buscarPV.nativeElement.focus();
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
      if (element.id == 'finPV') {
        this.opcionPV.nativeElement.focus();
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



  limpiar() {
    this.estadoDivBotones("d-block");
    this.siguientePV.nativeElement.focus();
    this.estadoDivProducto("d-none") // se muestra el div de producto
    this.CodigoBarrasPV.nativeElement.value = "";
    this.CodigoBarrasPV.nativeElement.classList.add("d-none");
    this.clienteSelect = null;
    this.productoIdSelect = null;
    this.tipoDocumentSelect = null;
    this.empleadoSelect = "";
    this.document = new DocumentoModel();
    this.clientePV.nativeElement.value = "";
    this.tipoDocumentoPV.nativeElement.value = "";
    this.empleadoPV.nativeElement.value = "";
    this.articuloPV.nativeElement.value = "";
    this.codigoPV.nativeElement.value = "";
    this.cantidadPV.nativeElement.value = "";
    this.precioPV.nativeElement.value = "";
    this.productos = [];
    this.descuentoPV.nativeElement.value = "";
    this.tituloFactura = "";
    this.factura = new FacturaModel();
    this.indexSelect = 0;
    this.documentosList = [];
    this.modificarFactura = false;
  }

  teclaAnteriorSiguiente(apcion: string) {
    if (this.documentosList.length == 0) {
      let tipoDocumentoId: Array<number> = [10, 9, 4];//se buscan facturas de venta
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

      let cliente = this.clientes.find(cliente => cliente.cliente_id == this.document.cliente_id);
      let nombre = "";
      if (cliente != undefined) {
        nombre = cliente.nombre;
      }
      this.clientePV.nativeElement.value = nombre;
      let ids: string[] = [];
      ids.unshift(this.document.documento_id);
      this.documentoDetalleService.getDocumentoDetalleByDocumentoList(ids).subscribe(res => {
        this.productos = res;
        console.log("detalles encontrados:" + res.length);
      });
    }
  }


  nuevafactura() {
    console.log("nueva factura");
    this.limpiar();
    this.estadoDivBotones("d-none");
    this.estadoDivProducto("d-block") // se muestra el div de producto
    this.getproporcion();
    if (this.clienteActivo) {
      this.clientePV.nativeElement.focus();
    } else {
      if (this.guiaTransporteActivo) {
        this.tipoDocumentoPV.nativeElement.focus();
      } else {
        if (this.empreadoActivo) {
          this.empleadoPV.nativeElement.focus();
        } else {
          if (this.codigoBarrasActivo) {
            this.CodigoBarrasPV.nativeElement.classList.add("d-block");
            this.CodigoBarrasPV.nativeElement.focus();
          } else {
            this.articuloPV.nativeElement.focus();
          }
        }
      }
    }
  }

  imprimirModal() {
    if (this.document.documento_id == "") {
      alert("debe crear primero una factura");
      return;
    }
    $('#imprimirModal').modal('show');
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
    if (this.impresionPantallaActivo) {
      this.enPantallaLavel.nativeElement.classList.remove("d-none");
      this.enPantallaLavel.nativeElement.classList.add("d-block");
      this.enPantallaPV.nativeElement.classList.remove("d-none");
      this.enPantallaPV.nativeElement.classList.add("d-block");
    }
    if (this.imp) {
      this.impresoraLavel.nativeElement.classList.remove("d-none");
      this.impresoraLavel.nativeElement.classList.add("d-block");
      this.impresoraPV.nativeElement.classList.remove("d-none");
      this.impresoraPV.nativeElement.classList.add("d-block");
    }
    if (this.TipoPagosActivo) {
      this.tiposPagosDocumento = [];
      this.valorTipoPagoLavel.nativeElement.classList.remove("d-none");
      this.valorTipoPagoLavel.nativeElement.classList.add("d-block");

      this.tipoPagoLavel.nativeElement.classList.remove("d-none");
      this.tipoPagoLavel.nativeElement.classList.add("d-block");

      this.tipoPagoPV.nativeElement.classList.remove("d-none");
      this.tipoPagoPV.nativeElement.classList.add("d-block");

      this.valorTipoPagoPV.nativeElement.classList.remove("d-none");
      this.valorTipoPagoPV.nativeElement.classList.add("d-block");
    } else {
      this.valorTipoPagoLavel.nativeElement.classList.add("d-none");
      this.tipoPagoLavel.nativeElement.classList.add("d-none");
      this.valorTipoPagoPV.nativeElement.classList.add("d-none");
      this.tipoPagoPV.nativeElement.classList.add("d-none");
    }
    $("#imprimirModal").on('shown.bs.modal', () => {
      //alert("entra");
      if (this.descuentosActivo) {
        this.descuentoPV.nativeElement.focus();
      } else {
        if (this.multipleImpresoraActivo) {
          this.impresoraPV.nativeElement.focus();
        } else {
          if (this.TipoPagosActivo) {
            this.tipoPagoPV.nativeElement.focus();
          } else {
            if (this.impresionPantallaActivo) {
              this.enPantallaPV.nativeElement.focus();
            } else {
              this.continuaImpresionPV.nativeElement.focus();
            }
          }
        }
      }
    });
  }

  getActivaciones(user: number) {
    this.usuarioService.getActivacionByUsuario(user.toString()).subscribe(res => {
      this.activaciones = res;
      for (var e = 0; e < this.activaciones.length; e++) {
        if (this.activaciones[e].activacion_id == this.CLIENTE_FACTURACION) {
          console.log("cliente activo");
          this.clienteActivo = true;
        }
        if (this.activaciones[e].activacion_id == this.GUIA_TRANSPORTE) {
          console.log("guia de trasporte activa");
          this.guiaTransporteActivo = true;
        }
        if (this.activaciones[e].activacion_id == this.CLIENTE_OBLIGATORIO) {
          console.log("cliente obligatorio");
          this.clienteObligatorioActivo = true;
        }
        if (this.activaciones[e].activacion_id == this.EMPLEADOS) {
          console.log("empleado activado");
          this.empreadoActivo = true;
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
        if (this.activaciones[e].activacion_id == this.CLAVE_BORRADO) {
          console.log("clave borrado activos ");
          this.claveBorradoActivo = true;
        }
        if (this.activaciones[e].activacion_id == this.PROPORCION) {
          console.log("proporcion activo ");
          this.proporcionActivo = true;
        }
        if (this.activaciones[e].activacion_id == this.IMPRESION_PANTALLA) {
          console.log("impresion en pantalla activo ");
          this.impresionPantallaActivo = true;
        }
      }
    });
  }

  public opcionesSubmenu() {
    let usuario_id = localStorage.getItem('usuario_id');
    this.usuarioService.opcionPuntoVentaByUsuario(usuario_id).subscribe((res) => {
      this.opciones = res;
      console.log(this.opciones);
    });
  }


  getImpresorasEmpresa(empresaId: number) {
    this.clienteService.getImpresorasEmpresa(empresaId.toString()).subscribe(res => {
      this.impresoraEmpresa = res;
    });
  }

  getclientes(empresaId: number) {
    this.clienteService.getClientesByEmpresa(empresaId.toString()).subscribe(res => {
      this.clientes = res;
      console.log("lista de clientes cargados: " + this.clientes.length);
    });
  }

  getEmpleados(empresaId: number) {
    this.empleadoService.getEmpleadoAll(empresaId).subscribe(res => {
      this.empleados = res;
      console.log("lista de empleados cargados: " + this.empleados.length);
    });

  }



  getConfiguracion(empresaId: number) {
    this.clienteService.getConfiguracionByEmpresa(empresaId.toString()).subscribe(res => {
      this.configuracion = res[0];
    });
  }

  getUsuarios(empresaId: number) {
    this.usuarioService.getByUsuario(null, empresaId.toString(), null).subscribe(res => {
      this.usuarios = res;
    });
  }

  getProductosByEmpresa(empresaId: number) {
    this.productoService.getProductosByEmpresa(empresaId.toString()).subscribe(res => {
      this.productosAll = res;
    });
  }

  getTipoPago() {
    this.clienteService.getTipoPago().subscribe(res => {
      this.tipoPagosAll = res;
    });
  }





  getTipoIdentificacion() {
    this.clienteService.getTipoIdentificacionAll().subscribe(res => {
      this.tipoIdentificacionList = res;
    });
  }

  getTipoEmpresa() {
    this.clienteService.getTipoEmpresa().subscribe(res => {
      this.tipoEmpresaList = res;
    });
  }

  getproporcion() {
    this.usuarioService.getProporcion(this.empresaId).subscribe(res => {
      this.proporcion = res[0];
    });
  }


  getTiposDocumento() {
    this.documentoService.getTiposDocumento().subscribe(res => {
      this.tiposDocumento = res;
    });
  }

  estadoDivBotones(visible: string) {
    if (visible == "d-block") {
      this.divSiguiente.nativeElement.classList.add("d-block");
      this.divAnterior.nativeElement.classList.add("d-block");
      this.divPrimera.nativeElement.classList.add("d-block");
      this.divUltima.nativeElement.classList.add("d-block");
      this.divBuscar.nativeElement.classList.add("d-block");
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

  ocultarPrecio() {
    this.precioPV.nativeElement.classList.remove("d-block");
    this.precioPV.nativeElement.classList.add("d-none");
  }
  ocultarGramera() {
    this.divGramera = false;
  }

  formatearNumber(number: number) {
    let formato: string = "";
    formato = new Intl.NumberFormat().format(number);
    return formato;
  }

  nombreTipoPago(id) {
    let tipo = this.tipoPagosAll.find(tipos => tipos.tipo_pago_id == id);
    if (tipo == undefined) {
      return "";
    } else {
      return tipo.nombre;
    }
  }

}
