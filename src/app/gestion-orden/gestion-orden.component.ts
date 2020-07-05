import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DocumentoModel } from '../model/documento.model';
import { CalculosService } from '../services/calculos.service';
import { DocumentoService } from '../services/documento.service';
import { DocumentoDetalleModel } from '../model/documentoDetalle.model';
import { UsuarioModel } from '../model/usuario.model';
import { UsuarioService } from '../services/usuario.service';
import { ClienteModel } from '../model/cliente.model';
import { ClienteService } from '../services/cliente.service';
import { Observable } from 'rxjs';
import { ParametrosModel } from '../model/parametros.model';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { DocumentoDetalleService } from '../services/documento-detalle.service';
import { MarcaVehiculoModel } from '../model/marcaVehiculo.model';
import { MarcasService } from '../services/marcas.service';
import { ModeloMarcaModel } from '../model/modeloMarca.model';
import { ProductoService } from '../services/producto.service';
import { ProductoModel } from '../model/producto.model';
import { ActivacionModel } from '../model/activacion';
import { ImpresoraEmpresaModel } from '../model/impresoraEmpresa.model';
import { EmpresaService } from '../services/empresa.service';
import { FacturaModel } from '../vo/factura.model';
import { ImpresionService } from '../services/impresion.service';
import { DocumentoOrdenModel } from '../model/documentoOrden.model';
import { ConfiguracionModel } from '../model/configuracion.model';
import { TipoPagoModel } from '../model/tipoPago.model';
import { TipoPagoDocumentoModel } from '../model/tipoPagoDocumento.model';
import { EmpresaModel } from '../model/empresa.model';
import { EmpleadoModel } from '../model/empleado.model';
import { EmpleadoService } from '../services/empleado.service';
import { TipoIdentificacionModel } from '../model/tipoIdentificacion.model';
import { DocumentoInvoiceModel } from '../model/documentoInvoice.model';
import { CierreService } from '../services/cierre.service';
import { InformeDiarioModel } from '../model/informeDiario.model';
import { ResolucionEmpresaModel } from '../model/resolucionEmpresa.model';


declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-gestion-orden',
  templateUrl: './gestion-orden.component.html',
  styleUrls: ['./gestion-orden.component.css']
})
export class GestionOrdenComponent implements OnInit {

  readonly PRODUCTOS_FIJOS: string = '21';
  readonly CLIENTE_OBLIGATORIO: string = '14';
  readonly ACTIVAR_EMPLEADOS_ORDEN: string = '18';
  readonly TIPO_DOCUMENTO_FACTURA: number = 10;
  readonly TIPO_DOCUMENTO_COTIZACION: number = 4;
  readonly TIPO_DOCUMENTO_ORDEN_TRABAJO: number = 11;
  readonly TIPO_PAGO_EFECTIVO: number = 1;
  readonly TIPO_IMPRESION_TXT80MM: number = 1;
  readonly TIPO_IMPRESION_TXT50MM: number = 2;
  readonly TIPO_IMPRESION_PDFCARTA: number = 3;
  readonly TIPO_IMPRESION_PDF50MM: number = 5;

  readonly INVOICE_SIN_ENVIAR: number = 1;

  public documento: DocumentoModel = new DocumentoModel();
  public usuarioId: number;
  public empresaId: number;
  public detallesList: Array<DocumentoDetalleModel> = [];
  public usuarioList: Array<UsuarioModel> = [];
  public indexSelect: number = 0;
  public clientes: Array<ClienteModel>;
  public ref: AngularFireStorageReference;
  public task: AngularFireUploadTask;
  public downloadURL: Observable<string>;
  public downloadURLLocal: any;
  public downloadURL2: Observable<string>;
  public detalleSelect: DocumentoDetalleModel = new DocumentoDetalleModel();
  public valorTotal: number = 0;
  public ordenesBuscarList: Array<DocumentoModel> = [];
  public ordenesList: Array<DocumentoModel> = [];
  public clienteNew: ClienteModel = new ClienteModel();
  public marcaList: Array<MarcaVehiculoModel> = [];
  public modeloList: Array<ModeloMarcaModel> = [];
  public tipoIdentificacionList: Array<TipoIdentificacionModel> = [];
  public productosAll: Array<ProductoModel>;
  public activaciones: Array<ActivacionModel> = [];
  public productoFijoActivo: boolean = false;
  public clienteObligatorioActivo: boolean = false;
  public articuloPV: string = "";
  public productoIdSelect: ProductoModel = null;
  public impresoraEmpresa: Array<ImpresoraEmpresaModel>;
  public factura: FacturaModel;
  public empleados: Array<EmpleadoModel>;
  public empleadoOrdenActivo: boolean = false;

  //factura
  public ordenesFactura: Array<DocumentoModel> = [];
  public itemsFactura: Array<DocumentoDetalleModel> = [];
  public ordenesBuscarListFactura: Array<DocumentoModel> = [];
  public facturasBuscarList: Array<DocumentoModel> = [];
  public ordenesBuscarListFacturaSelect: Array<DocumentoModel> = [];
  public facturasList: Array<DocumentoModel> = [];
  public indexFacturaSelect: number = 0;
  public configuracion: ConfiguracionModel;
  public documentoFactura: DocumentoModel = new DocumentoModel();
  public tipoPagosAll: Array<TipoPagoModel>;
  public resolucionAll: Array<ResolucionEmpresaModel>;
  public tituloFactura: string = "";
  public informeDiario: InformeDiarioModel;


  @ViewChild("clientePV") clientePV: ElementRef;
  @ViewChild("placa") placa: ElementRef;
  @ViewChild("descripcionCliente") descripcionCliente: ElementRef;
  @ViewChild("observacion") observacion: ElementRef;
  @ViewChild("item") item: ElementRef;
  @ViewChild("modelo") modelo: ElementRef;
  @ViewChild("marca") marca: ElementRef;
  @ViewChild("linea") linea: ElementRef;
  @ViewChild("cantidad") cantidad: ElementRef;
  @ViewChild("pCompra") pCompra: ElementRef;
  @ViewChild("pVenta") pVenta: ElementRef;
  @ViewChild("downloadZipLink") downloadZipLink: ElementRef;
  @ViewChild("empleadoPV") empleadoPV: ElementRef;

  //campos de factura
  @ViewChild("clienteFactura") clienteFactura: ElementRef;
  @ViewChild("observacionFact") observacionFact: ElementRef;
  @ViewChild("tipoPago") tipoPago: ElementRef;
  @ViewChild("resolucionEmpresa") resolucionEmpresa: ElementRef;
  @ViewChild("impresora") impresora: ElementRef;



  constructor(public productoService: ProductoService,
    public empresaService: EmpresaService,
    public impresionService: ImpresionService,
    public marcasService: MarcasService,
    public cierreService: CierreService,
    public documentoDetalleService: DocumentoDetalleService,
    public afStorage: AngularFireStorage,
    public calculosService: CalculosService,
    public documentoService: DocumentoService,
    public usuarioService: UsuarioService,
    public clienteService: ClienteService,
    public empleadoService: EmpleadoService) { }

  ngOnInit() {
    this.usuarioId = Number(localStorage.getItem("usuario_id"));
    this.empresaId = Number(localStorage.getItem("empresa_id"));
    this.buscarUsuarios();
    this.getclientes(this.empresaId);
    this.marcas();
    this.getActivaciones(this.usuarioId);
    this.getProductosByEmpresa(this.empresaId);
    this.getImpresorasEmpresa(this.empresaId);
    this.getConfiguracion(this.empresaId);
    this.getTipoPago();
    this.getResolucion();
    this.getEmpleados();
    this.getTipoIdentificacion();
    this.factura = new FacturaModel();
  }

  getProductosByEmpresa(empresaId: number) {
    this.productoService.getProductosByEmpresa(empresaId.toString()).subscribe(res => {
      this.productosAll = res;
    });
  }

  guardarModelo(modelo) {
    let modeloId = this.modeloList.find(mo => mo.nombre == modelo.value);
    this.documento.modelo_marca_id = modeloId.modelo_marca_id;
    this.documentoService.updateDocumento(this.documento).subscribe(res => {
      if (res.code != 200) {
        alert("error actualizando el documento, por favor inicie nuevamente la creación del documento");
        return;
      }
    });
  }

  asignarLinea(linea) {
    if ("Seleccione Linea" != linea.value && this.documento.documento_id != "") {
      this.documento.linea_vehiculo = linea.value;
      this.documentoService.updateDocumento(this.documento).subscribe(res => {
        if (res.code != 200) {
          alert("error actualizando el documento, por favor inicie nuevamente la creación del documento");
          return;
        }
      });
    }
  }

  marcas() {
    this.marcasService.getMarcas().subscribe(res => {
      this.marcaList = res;
    });
  }

  nuevaOrden() {
    console.log("nueva orden");
    this.limpiar();
    this.documento.tipo_documento_id = this.TIPO_DOCUMENTO_ORDEN_TRABAJO;// SE AGREGA tipo documento =11 orden de trabajo
    this.documento.fecha_registro = this.calculosService.fechaActual();
    this.documento.fecha_entrega = null;
    this.documento.usuario_id = this.usuarioId;
    this.documento.empresa_id = this.empresaId;
    this.clientePV.nativeElement.focus();
    this.documentoService.saveDocumento(this.documento).subscribe(res => {
      if (res.code == 200) {
        this.documento.documento_id = res.documento_id;
      } else {
        alert("error creando documento, por favor inicie nuevamente la creación del documento, si persiste consulte a su proveedor");
        return;
      }
    });
  }

  nuvaCotizacion() {
    console.log("nueva factura");
    this.limpiarFactura();
    this.documentoFactura.tipo_documento_id = this.TIPO_DOCUMENTO_COTIZACION;// SE AGREGA tipo documento =4 CONTIZACION
    this.documentoFactura.fecha_registro = this.calculosService.fechaActual();
    this.documentoFactura.usuario_id = this.usuarioId;
    this.documentoFactura.empresa_id = this.empresaId;
    this.clienteFactura.nativeElement.focus();
    this.documentoService.saveDocumento(this.documentoFactura).subscribe(res => {
      if (res.code == 200) {
        this.documentoFactura.documento_id = res.documento_id;
      } else {
        alert("error creando documento, por favor inicie nuevamente la creación del documento, si persiste consulte a su proveedor");
        return;
      }
    });
  }

  nuevaFactura() {
    console.log("nueva factura");
    this.limpiarFactura();
    this.documentoFactura.tipo_documento_id = this.TIPO_DOCUMENTO_FACTURA;// SE AGREGA tipo documento =10 factura de venta
    this.documentoFactura.fecha_registro = this.calculosService.fechaActual();
    this.documentoFactura.usuario_id = this.usuarioId;
    this.documentoFactura.empresa_id = this.empresaId;
    this.clienteFactura.nativeElement.focus();
    this.documentoService.saveDocumento(this.documentoFactura).subscribe(res => {
      if (res.code == 200) {
        this.documentoFactura.documento_id = res.documento_id;
        let documentoInvoice: DocumentoInvoiceModel = new DocumentoInvoiceModel()
        documentoInvoice.documento_id = res.documento_id;
        documentoInvoice.fecha_registro = new Date();
        documentoInvoice.invoice_id = this.INVOICE_SIN_ENVIAR;
        this.documentoService.saveInvoice(documentoInvoice).subscribe(res2 => {
          if (res2.code == 200) {
            //this.documentoFactura.documento_id = res2.documento_id;
          } else {
            alert("error creando documento, por favor inicie nuevamente la creación del documento, si persiste consulte a su proveedor");
            return;
          }
        });
      } else {
        alert("error creando documento, por favor inicie nuevamente la creación del documento, si persiste consulte a su proveedor");
        return;
      }
    });
  }

  clienteSelectFun(element) {
    console.log(this.clientes);
    if (this.documento.documento_id == "") {
      alert("Debe pulsar el boton nuevo documento");
      return;
    }
    let cliente = this.clientes.find(cliente => cliente.nombre == element.value);
    if (cliente == undefined) {
      this.clienteNew.nombre = element.value;
      $('#crearClienteModal').modal('show');
      return;
    } else {
      console.log(cliente);
      this.documento.cliente_id = cliente.cliente_id;

      this.documentoService.updateDocumento(this.documento).subscribe(res => {
        if (res.code != 200) {
          alert("error actualizando el documento, por favor inicie nuevamente la creación del documento");
          return;
        }
      });
    }
  }

  clienteSelectFactura(element) {
    if (this.documentoFactura.documento_id == "") {
      alert("Debe pulsar el boton nueva Factura");
      return;
    }
    let cliente = this.clientes.find(cliente => cliente.nombre == element.value);
    if (cliente == undefined) {
      this.clienteNew.nombre = element.value;
      $('#crearClienteModal').modal('show');
      return;
    } else {
      console.log(cliente);
      this.documentoFactura.cliente_id = cliente.cliente_id;
      this.documentoService.updateDocumento(this.documentoFactura).subscribe(res => {
        if (res.code != 200) {
          alert("error actualizando el documento, por favor inicie nuevamente la creación del documento");
          return;
        }
      });
    }
  }

  CrearCliente() {
    // console.log(this.clienteNew);
    let valido: boolean = true;
    let mensageError: string = "Son obligatorios:\n ";
    if (this.clienteNew.nombre == "") {
      mensageError += "nombre\n";
      valido = false;
    }
    if (this.clienteNew.documento == "") {
      mensageError += "documento\n";
      valido = false;
    }
    if (this.clienteNew.tipo_identificacion_id == null) {
      mensageError += "tipo documento\n";
      valido = false;
    }
    if (valido == false) {
      alert(mensageError);
      return;
    }
    this.clienteNew.empresa_id = this.empresaId;
    this.clienteService.saveCliente(this.clienteNew).subscribe(res => {
      if (res.code == 200) {
        this.getclientes(this.empresaId);
        this.documento.cliente_id = res.cliente_id;
        this.clienteNew = new ClienteModel();
        $('#crearClienteModal').modal('hide');
      } else {
        alert("error creando cliente, por favor inicie nuevamente la creación del cliente, si persiste consulte a su proveedor");
        return;
      }
    });

  }

  agregarDescripcionCliente(element) {
    if (this.documento.documento_id == "") {
      alert("Debe pulsar el boton nuevo documento");
      return;
    }
    this.documento.descripcion_cliente = element.value;
    this.documentoService.updateDocumento(this.documento).subscribe(res => {
      if (res.code != 200) {
        alert("error actualizando el documento, por favor inicie nuevamente la creación del documento");
        return;
      }
    });
  }

  agregarPlaca(element) {
    if (this.documento.documento_id == "") {
      alert("Debe pulsar el boton nuevo documento");
      return;
    }
    console.log(element.value);
    this.documento.detalle_entrada = element.value;
    this.documento.detalle_entrada = this.documento.detalle_entrada.toUpperCase();
    element.value = this.documento.detalle_entrada.toUpperCase();
    this.documentoService.updateDocumento(this.documento).subscribe(res => {
      if (res.code != 200) {
        alert("error actualizando el documento, por favor inicie nuevamente la creación del documento");
        return;
      }
    });
  }

  agregarObservacion(element) {
    if (this.documento.documento_id == "") {
      alert("Debe pulsar el boton nuevo documento");
      return;
    }
    this.documento.descripcion_trabajador = element.value;
    this.documentoService.updateDocumento(this.documento).subscribe(res => {
      if (res.code != 200) {
        alert("error actualizando el documento, por favor inicie nuevamente la creación del documento");
        return;
      }
    });
  }

  entregar() {
    if (this.documento.documento_id == '') {
      alert("Debe pulsar el boton nuevo documento");
      return;
    }
    this.documento.fecha_entrega = this.calculosService.fechaActual();
    this.documento.impreso = 1;
    this.documentoService.updateDocumento(this.documento).subscribe(res => {
      if (res.code != 200) {
        alert("error actualizando el documento, por favor inicie nuevamente la creación del documento");
        return;
      }
    });
    $('#entregarModal').modal('hide');
  }

  teclaAnteriorSiguiente(apcion: string) {
    if (this.ordenesList.length == 0) {
      let tipoDocumentoId: Array<number> = [this.TIPO_DOCUMENTO_ORDEN_TRABAJO];
      this.documentoService.getDocumentoByTipo(tipoDocumentoId, this.empresaId.toString(), "", '', '').subscribe(res => {
        this.ordenesList = res;
        console.log("lista de docuemntos cargados: " + this.ordenesList.length);
        if (this.ordenesList.length == 0) {
          alert("No existen Ordenes de trabajo");
          return;
        }
        console.log(apcion + ":" + this.ordenesList.length);
        this.documento = this.ordenesList[this.ordenesList.length - 1];
        this.indexSelect = this.ordenesList.length - 1;
        this.asignarValores(this.documento.documento_id);
        return;
      });
    } else {
      if ('anterior' == apcion && this.indexSelect != 0) {
        this.indexSelect = this.indexSelect - 1;
        this.documento = this.ordenesList[this.indexSelect];
      }
      if ('siguiente' == apcion && this.indexSelect != this.ordenesList.length - 1) {
        this.indexSelect = this.indexSelect + 1;
        this.documento = this.ordenesList[this.indexSelect];
      }
    }

    console.log("actual:" + this.documento.documento_id);
    this.asignarValores(this.documento.documento_id);
  }

  teclaAnteriorSiguienteFactura(apcion: string) {
    if (this.facturasList.length == 0) {
      let tipoDocumentoId: Array<number> = [this.TIPO_DOCUMENTO_FACTURA];
      this.documentoService.getDocumentoByTipo(tipoDocumentoId, this.empresaId.toString(), "", '', '').subscribe(res => {
        this.facturasList = res;
        console.log("lista de facturas cargados: " + this.facturasList.length);
        if (this.facturasList.length == 0) {
          alert("No existen facturas");
          return;
        }
        console.log(apcion + ":" + this.facturasList.length);
        this.documentoFactura = this.facturasList[this.facturasList.length - 1];
        this.indexFacturaSelect = this.facturasList.length - 1;
        this.asignarValoresFactura(this.documentoFactura.documento_id);
        return;
      });
    } else {
      if ('anterior' == apcion && this.indexFacturaSelect != 0) {
        this.indexFacturaSelect = this.indexFacturaSelect - 1;
        this.documentoFactura = this.facturasList[this.indexFacturaSelect];
      }
      if ('siguiente' == apcion && this.indexFacturaSelect != this.facturasList.length - 1) {
        this.indexFacturaSelect = this.indexFacturaSelect + 1;
        this.documentoFactura = this.facturasList[this.indexFacturaSelect];
      }
    }

    console.log("actual:" + this.documentoFactura.documento_id);
    this.asignarValoresFactura(this.documentoFactura.documento_id);
  }

  articuloSelect(element) {
    console.log("articulo select:" + element.value);
    let productoNombre: string = element.value;
    this.productoIdSelect = this.productosAll.find(product => product.nombre === productoNombre);
    console.log(this.productoIdSelect);
  }

  agregardetalle() {

    if (this.documento.documento_id == '') {
      alert("Debe pulsar el boton nuevo documento");
      return;
    }
    if (!this.productoFijoActivo) {
      if (this.item.nativeElement == undefined || this.item.nativeElement.value == '') {
        alert("El nombre del repuesto es obligatorio");
        return;
      }

    } else {
      if ((this.productoIdSelect == null || this.productoIdSelect == undefined) && this.productoFijoActivo) {
        alert("El nombre del repuesto es obligatorio");
        return;
      }
    }
    if (this.cantidad.nativeElement.value == '') {
      alert("La cantidad del repuesto es obligatorio");
      return;
    }
    if (this.pCompra.nativeElement.value == '') {
      alert("El valor compra del repuesto es obligatorio");
      return;
    }
    if (this.pVenta.nativeElement.value == '') {
      alert("El valor venta del repuesto es obligatorio");
      return;
    }

    if (this.detalleSelect.documento_detalle_id == null) {
      let docDetalle: DocumentoDetalleModel = new DocumentoDetalleModel();
      docDetalle.descripcion = (this.productoFijoActivo ? this.productoIdSelect.nombre : this.item.nativeElement.value);
      docDetalle.estado = 1;
      docDetalle.cantidad = this.cantidad.nativeElement.value;
      docDetalle.unitario = this.pVenta.nativeElement.value;
      docDetalle.parcial = docDetalle.cantidad * docDetalle.unitario;
      docDetalle.impreso_comanda = this.pCompra.nativeElement.value;
      docDetalle.documento_id = this.documento.documento_id;
      if (this.productoFijoActivo) {
        this.detalleSelect.producto_id = this.productoIdSelect.producto_id;
      }
      if ($('#fotoRepuesto')[0].files[0] != undefined) {
        docDetalle.url_foto = this.cargarFotoRepuesto(docDetalle);
      }
      this.documentoDetalleService.saveDocumentoDetalle(docDetalle).subscribe(res => {
        if (res.code == 200) {
          docDetalle.documento_detalle_id = res.documento_detalle_id;
          this.detallesList.unshift(docDetalle);
          this.documento = this.calculosService.calcularExcento(this.documento,this.detallesList);
          //this.calcularTOtal();
        } else {
          alert("Error agregando repuesto: " + res.error);
        }
      });
    } else {
      this.detalleSelect.descripcion = this.productoFijoActivo ? this.productoIdSelect.nombre : this.item.nativeElement.value;
      this.detalleSelect.cantidad = this.cantidad.nativeElement.value;
      this.detalleSelect.unitario = this.pVenta.nativeElement.value;
      this.detalleSelect.impreso_comanda = this.pCompra.nativeElement.value;
      if (this.productoFijoActivo) {
        this.detalleSelect.producto_id = this.productoIdSelect.producto_id;
      }
      this.detalleSelect.parcial = this.detalleSelect.cantidad * Number(this.detalleSelect.unitario);
      if ($('#fotoRepuesto')[0].files[0] != undefined) {
        this.detalleSelect.url_foto = this.cargarFotoRepuesto(this.detalleSelect);
      }
      this.documentoDetalleService.updateDocumentoDetalle(this.detalleSelect).subscribe(res => {
        if (res.code != 200) {
          alert("Error agregando repuesto: " + res.error);
        }
        for (var i = 0; i < this.detallesList.length; i++) {
          if (this.detallesList[i].documento_detalle_id == this.detalleSelect.documento_detalle_id) {
            this.detallesList.splice(i, 1);
            this.detallesList.splice(i, 0, this.detalleSelect);
            break;
          }
        }
        this.documento = this.calculosService.calcularExcento(this.documento,this.detallesList);
        console.log(this.detallesList);
        this.documentoService.updateDocumento(this.documento).subscribe(res => {
          if (res.code != 200) {
            alert("error actualizando el documento, por favor inicie nuevamente la creación del documento");
            return;
          }
        });
      });
      this.detalleSelect = new DocumentoDetalleModel();
    }
    this.productoIdSelect = null;
    this.articuloPV = "";
    if (!this.productoFijoActivo) {
      this.item.nativeElement.value = "";
    }
    this.articuloPV = "";
    this.cantidad.nativeElement.value = "";
    this.pVenta.nativeElement.value = "";
    this.pCompra.nativeElement.value = "";
    this.downloadURL2 = null;
    this.detalleSelect = new DocumentoDetalleModel();
    $('#exampleModal').modal('hide');
  }

  editarItem(articulo) {
    this.cantidad.nativeElement.value = articulo.cantidad;
    if (this.productoFijoActivo) {
      let productoNombre: string = articulo.descripcion;
      this.productoIdSelect = this.productosAll.find(product => product.nombre === productoNombre);
      this.articuloPV = articulo.descripcion;
    } else {
      this.item.nativeElement.value = articulo.descripcion;
    }
    this.pVenta.nativeElement.value = articulo.unitario;
    this.pCompra.nativeElement.value = articulo.impreso_comanda;
    this.detalleSelect = articulo;
    this.calcularTOtal();
    $('#exampleModal').modal('show');
  }

  imprimirOrden(impresora) {
    if (this.documento.documento_id == "") {
      alert("Debe pulsar el boton nuevo documento");
      return;
    }
    if (this.impresoraEmpresa.length == 0) {
      alert("No existen impresoras configuradas para la empresa");
      return;
    }
    if (impresora.value == "") {
      impresora.value = 1;
    }
    if (this.documento.cliente_id == null) {
      //si el cliente es nulo se asigna el varios por defecto
      this.documento.cliente_id = 1;
    }
    let tipoImpresion = 0;

    for (var i = 0; i < this.impresoraEmpresa.length; i++) {
      console.log(this.impresoraEmpresa[i].tipo_impresion_id + ":" + impresora.value);
      if (impresora.value == this.impresoraEmpresa[i].numero_impresora) {
        tipoImpresion = this.impresoraEmpresa[i].tipo_impresion_id;
        console.log(this.impresoraEmpresa[i]);
        break;
      }
    }
    if (tipoImpresion == 0) {
      alert("La impresora seleccionada no esta configurada para la empresa");
      return;
    }
    console.log(tipoImpresion);
    let tituloDocumento: string = "";
    tituloDocumento = "OrdenTrabajo" + "_" + this.documento.documento_id + "_" + impresora.value + "_" + tipoImpresion;
    this.empresaService.getEmpresaById(this.empresaId.toString()).subscribe(res => {
      let empr = res;
      this.factura.documento = this.documento;
      this.factura.detalle = this.detallesList;
      this.factura.titulo = tituloDocumento;
      this.factura.empresa = empr[0];
      this.factura.nombreTipoDocumento = tituloDocumento;
      this.factura.nombreUsuario = localStorage.getItem("nombreUsuario");
      this.factura.cliente = this.clientes.find(cliente => cliente.cliente_id == this.documento.cliente_id);
      switch (tipoImpresion) {
        case this.TIPO_IMPRESION_TXT80MM:
          this.descargarArchivo(this.impresionService.imprimirOrdenTxt80(this.factura), tituloDocumento + '.txt');
          break;
        case this.TIPO_IMPRESION_TXT50MM:
          this.descargarArchivo(this.impresionService.imprimirOrdenTxt50(this.factura), tituloDocumento + '.txt');
          break;
          case this.TIPO_IMPRESION_PDF50MM:
            this.impresionService.imprimirOrdenPDF50(this.factura, false);
            break;
        default:
          alert("El tipo de impresion seleccionado no se encuetra configurado para su empresa");
          return;
          //Impresion.imprimirPDF(getDocumento(), getProductos(), usuario(), configuracion, impresora,
          //    enPantalla, e);
          break;
      }
      $('#imprimirModal').modal('hide');
    });

  }

  enterContinuarImpresion(impresora1: string) {
    if (this.documentoFactura.documento_id == "") {
      alert("El documento esta corructo, por favor vuelva a crearlo");
      return;
    }
    if (this.documentoFactura.cliente_id == null && this.clienteObligatorioActivo) {
      alert("El Cliente es obligatorio para generar el documento");
      return;
    }
    console.log(this.configuracion);
    let numImpresiones = this.configuracion.numero_impresion;

    if (this.documentoFactura.tipo_documento_id == null) {
      this.documentoFactura.tipo_documento_id = this.TIPO_DOCUMENTO_FACTURA;
    }
    //this.document.mac= Calculos.conseguirMAC2()); ver como se hace la mag desde el cliente..
    this.documentoFactura.impreso = 1;
    let impresora = this.impresora.nativeElement.value;
    if (impresora == "") {
      impresora = 1;
    }
    let tipoImpresion = 0;
    for (var i = 0; i < this.impresoraEmpresa.length; i++) {
      if (impresora == this.impresoraEmpresa[i].numero_impresora) {
        tipoImpresion = this.impresoraEmpresa[i].tipo_impresion_id;
      }
    }
    this.documentoFactura.impresora = impresora;
    if (this.documentoFactura.tipo_documento_id == this.TIPO_DOCUMENTO_FACTURA) {
      this.actualizarOrdenes();
      this.calcularInfoDiario(false);
      this.asignarTipoPago();
    }
    this.asignarConsecutivo(numImpresiones, tipoImpresion);
    $('#imprimirModalFactura').modal('hide');
  }

  calcularInfoDiario(anulado: boolean) {
    console.log("entra a calcular info diario");
    this.cierreService.getInfoDiarioByDate(this.empresaId, this.calculosService.formatDate(new Date(), false), this.calculosService.formatDate(new Date(), false)).subscribe(res => {

      if (res.length == 0) {
        this.informeDiario = new InformeDiarioModel();
      } else {
        this.informeDiario = res[0];
        console.log(this.informeDiario);
      }
      this.informeDiario = this.calculosService.calcularInfoDiario(this.documentoFactura, this.informeDiario, anulado);
      this.informeDiario.fecha_ingreso = new Date();
      this.informeDiario.fecha_informe = this.calculosService.formatDate(new Date(), false);
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

  actualizarOrdenes() {
    for (let or of this.ordenesBuscarListFacturaSelect) {
      or.impreso = 1;
      this.documentoService.updateDocumento(or).subscribe(res => {
        if (res.code != 200) {
          alert("error creando documento, por favor inicie nuevamente la creación del documento");
          return;
        }
      });
    }
  }

  imprimirCopia() {
    let tipoImpresion = 0;
    for (var i = 0; i < this.impresoraEmpresa.length; i++) {
      if (this.documentoFactura.impresora == Number(this.impresoraEmpresa[i].numero_impresora)) {
        tipoImpresion = this.impresoraEmpresa[i].tipo_impresion_id;
      }
    }
    switch (this.documentoFactura.tipo_documento_id) {
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
      this.imprimirFactura(1, res[0], tipoImpresion);
    });

  }


  asignarTipoPago() {
    let tiposPagosList: TipoPagoModel[] = [];
    //si no se agrega un tipo de pago se agrega efectivo por defecto efectivo 
    let tipoPagoDocumento: TipoPagoDocumentoModel = new TipoPagoDocumentoModel();
    tipoPagoDocumento.documento_id = this.documentoFactura.documento_id;
    tipoPagoDocumento.fecha_registro = new Date;
    if (this.tipoPago.nativeElement.value != "") {
      let tipoPago = this.tipoPagosAll.find(tp => tp.nombre == this.tipoPago.nativeElement.value);
      tipoPagoDocumento.tipo_pago_id = tipoPago.tipo_pago_id;
      tipoPagoDocumento.valor = this.documentoFactura.total;
      this.documentoService.saveTipoPagoDocumento(tipoPagoDocumento).subscribe(res => {
      });
    } else {
      tipoPagoDocumento.tipo_pago_id = this.TIPO_PAGO_EFECTIVO;//efectivo por defecto
    }
  }

  asignarConsecutivo(numImpresiones: number, tipoImpresion: number) {
    this.empresaService.getEmpresaById(this.empresaId.toString()).subscribe(res => {
      let empr: EmpresaModel[] = res;
      let con: number;
      let consecutivo: string;
      let resolucion:ResolucionEmpresaModel;
      if (this.resolucionEmpresa.nativeElement.value != "") {
        resolucion = this.resolucionAll.find(cliente => cliente.nombre == this.resolucionEmpresa.nativeElement.value);
      }else {
        resolucion = this.resolucionAll[0];
      }
      this.factura.resolucionEmpresa=resolucion;
      switch (this.documentoFactura.tipo_documento_id) {
        case 9:
          con = resolucion.consecutivo;
          consecutivo = resolucion.letra_consecutivo + con;
          this.documentoFactura.consecutivo_dian = consecutivo;
          console.log("consecutivo documentoId: " + consecutivo);
          this.tituloFactura = "FACTURA DE VENTA.";
          break;
        case 4:
          this.documentoFactura.consecutivo_dian = this.documentoFactura.documento_id// es necesario asignar el
          // consecutivo dian
          console.log("consecutivo Cotizacion: " + this.documentoFactura.consecutivo_dian);
          this.tituloFactura = "No. DE COTIZACIÓN";
          this.documentoService.updateDocumento(this.documentoFactura).subscribe(res => {
            if (res.code != 200) {
              alert("error creando documento, por favor inicie nuevamente la creación del documento");
              return;
            }
            this.imprimirFactura(numImpresiones, empr[0], tipoImpresion);
            this.limpiarFactura();

          });
          break;
        default:
          // log
          console.log(resolucion.consecutivo);
          con = resolucion.consecutivo+ 1;
          // dentro de try se valida si faltan 500 facturas para
          // llegar hasta el tope

          let topeConsecutivo = resolucion.autorizacion_hasta;
          let consegutivo = con;
          if (consegutivo + 500 > topeConsecutivo) {
            alert(" se esta agotando el consegutivo DIAN");
          }
          if (consegutivo > topeConsecutivo) {
            alert("Se agotó el consecutivo DIAN");
            return;
          }

          consecutivo = resolucion.letra_consecutivo + con.toString();
          console.log("consecutivo Dian: " + consecutivo);
          this.documentoFactura.consecutivo_dian = consecutivo;
          this.tituloFactura = "FACTURA DE VENTA";
          resolucion.consecutivo = con;
          this.empresaService.updateConsecutivoEmpresa(empr[0]).subscribe(emp => {
            console.log("consecutivo actualizado");
            console.log(this.documentoFactura);

            this.documentoService.updateDocumento(this.documentoFactura).subscribe(res => {
              if (res.code != 200) {
                alert("error creando documento, por favor inicie nuevamente la creación del documento");
                return;
              }
              this.imprimirFactura(numImpresiones, empr[0], tipoImpresion);
              this.limpiarFactura();

            });
          });

          break;
      }
    });
  }

  imprimirFactura(numeroImpresiones: number, empresa: EmpresaModel, tipoImpresion: number) {
    console.log("entra a imprimir factura");
    let tituloDocumento: string = "";

    if (numeroImpresiones == undefined) {
      numeroImpresiones = 1;
    }

    tituloDocumento = this.tituloFactura + "_" + this.documentoFactura.consecutivo_dian + "_" + this.documentoFactura.impresora + "_false_" + numeroImpresiones + "_" + tipoImpresion;
    this.factura.documento = this.documentoFactura;
    this.factura.nombreTipoDocumento = this.tituloFactura;
    this.factura.detalle = this.itemsFactura
    this.factura.titulo = tituloDocumento;
    this.factura.empresa = empresa;
    this.factura.nombreUsuario = localStorage.getItem("nombreUsuario");
    this.factura.cliente = this.clientes.find(cliente => cliente.cliente_id == this.documentoFactura.cliente_id);
    for (var i = 0; i < numeroImpresiones; i++) {
      switch (tipoImpresion) {
        case this.TIPO_IMPRESION_TXT80MM:
          this.descargarArchivo(this.impresionService.imprimirFacturaTxt80(this.factura, this.configuracion), tituloDocumento + '.txt');
          break;
        case this.TIPO_IMPRESION_TXT50MM:
          this.descargarArchivo(this.impresionService.imprimirFacturaTxt50(this.factura, this.configuracion), tituloDocumento + '.txt');
          break;
        //case "TXTCARTA":
        //  this.descargarArchivo(this.impresionService.imprimirFacturaTxtCarta(this.factura, this.configuracion), tituloDocumento + '.txt');
        //  break;
        case this.TIPO_IMPRESION_PDFCARTA:
          this.impresionService.imprimirFacturaPDFCarta(this.factura, this.configuracion, false);
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

  getImpresorasEmpresa(empresaId: number) {
    this.clienteService.getImpresorasEmpresa(empresaId.toString()).subscribe(res => {
      this.impresoraEmpresa = res;
      console.log("impresoras configuradas en la empresa:" + res.length);
    });
  }

  calcularTOtal() {
    this.valorTotal = 0;
    for (let d of this.detallesList) {
      this.valorTotal = this.valorTotal + Number(d.parcial);
    }
  }

  cargarFotoRepuesto(detalle: DocumentoDetalleModel) {
    let parametros: ParametrosModel = new ParametrosModel;
    if (parametros.ambiente == 'cloud') {
      const id = detalle.url_foto == '' ? Math.random().toString(36).substring(2) : detalle.url_foto;
      this.ref = this.afStorage.ref(id);
      this.ref.put($('#fotoRepuesto')[0].files[0]).then(res => {
        this.downloadURL2 = this.ref.getDownloadURL();
      });
      return id;

    } else {
      console.log("local");
    }
  }

  eliminarItem(articulo) {
    this.detalleSelect = articulo;
  }

  eliminar() {
    this.detalleSelect.estado = 0;
    this.documentoDetalleService.updateDocumentoDetalle(this.detalleSelect).subscribe(res => {
      if (res.code == 200) {
        this.documentoDetalleService.getDocumentoDetalleByDocumento(this.documento.documento_id).subscribe(res => {
          this.detallesList = res;
          this.detalleSelect = new DocumentoDetalleModel();
          console.log("detalles encontrados:" + res.length);
          this.documento = this.calculosService.calcularExcento(this.documento,this.detallesList);
        });
      } else {
        alert("Error agregando repuesto: " + res.error);
      }
    });
    $('#eliminarModal').modal('hide');
  }

  buscarOrdenes(placa, clien, fechaInicial, fechaFinal) {
    let idCliente = "";
    let tipoDocumentoId = this.TIPO_DOCUMENTO_ORDEN_TRABAJO;
    if (clien.value != "") {
      let cliente = this.clientes.find(cliente => cliente.nombre == clien.value);
      idCliente = cliente.cliente_id.toString();
    }
    this.documentoService.getOrdenesTrabajo(this.empresaId.toString(), placa.value, idCliente, fechaInicial.value, fechaFinal.value, tipoDocumentoId).subscribe(res => {
      this.ordenesBuscarList = res;
    });
  }

  buscarOrdenesHoy(placa, clien) {
    let idCliente = "";
    let tipoDocumentoId = this.TIPO_DOCUMENTO_ORDEN_TRABAJO;
    if (clien.value != "") {
      let cliente = this.clientes.find(cliente => cliente.nombre == clien.value);
      idCliente = cliente.cliente_id.toString();
    }
    this.documentoService.getOrdenesTrabajo(this.empresaId.toString(), placa.value, idCliente, this.calculosService.fechaInicial(this.calculosService.fechaActual()).toLocaleString(), this.calculosService.fechaFinal(this.calculosService.fechaActual()).toLocaleString(), tipoDocumentoId).subscribe(res => {
      this.ordenesBuscarList = res;
    });
  }

  buscarFacturas(placa, clien, fechaInicial, fechaFinal, tipoDocu) {
    let idCliente = "";
    let tipoDocumentoId = tipoDocu.value; // se buscan facturas
    if (clien.value != "") {
      let cliente = this.clientes.find(cliente => cliente.nombre == clien.value);
      idCliente = cliente.cliente_id.toString();
    }
    this.documentoService.getOrdenesTrabajo(this.empresaId.toString(), placa.value, idCliente, fechaInicial.value, fechaFinal.value, tipoDocumentoId).subscribe(res => {
      this.facturasBuscarList = res;
    });
  }


  buscarOrdenesFactura(placa, clien, fechaInicial, fechaFinal) {
    let idCliente = "";
    let tipoDocumentoId = this.TIPO_DOCUMENTO_ORDEN_TRABAJO;// se buscan ordenes de trabajo
    if (clien.value != "") {
      let cliente = this.clientes.find(cliente => cliente.nombre == clien.value);
      idCliente = cliente.cliente_id.toString();
    }

    this.documentoService.getOrdenesTrabajo(this.empresaId.toString(), placa.value, idCliente, fechaInicial.value, fechaFinal.value, tipoDocumentoId).subscribe(res => {
      this.ordenesBuscarListFactura = res;
    });
  }

  limpiar() {
    this.documento = new DocumentoModel();
    this.detallesList = [];
    this.placa.nativeElement.value = "";
    this.clientePV.nativeElement.value = "";
    this.descripcionCliente.nativeElement.value = "";
    this.observacion.nativeElement.value = "";
    if (this.empleadoOrdenActivo) {
      this.empleadoPV.nativeElement.value = "";
    }

    if (!this.productoFijoActivo) {
      this.item.nativeElement.value = "";
    }
    this.indexSelect = 0;
    this.valorTotal = 0;
    this.articuloPV = "";
  }

  limpiarFactura() {
    this.documentoFactura = new DocumentoModel();
    this.clienteFactura.nativeElement.value = "";
    this.observacionFact.nativeElement.value = "";
    this.ordenesBuscarListFacturaSelect = [];
    this.itemsFactura = [];
    this.facturasList = [];

  }

  marcaSelect(marca) {
    let marcaId = this.marcaList.find(ma => ma.nombre == marca.value);
    this.marcasService.getModeloByMarca(marcaId.marca_vehiculo_id).subscribe(res => {
      this.modeloList = res;
      console.log(res);
    });
  }

  selectOrdenAll(e) {
    console.log(e.target.checked);
    // console.log($('#selectOdenAl').is(':checked'));

  }

  confirmarAgregarOrdenes(op) {
    if (op == 'n') {
      this.ordenesBuscarListFacturaSelect = [];
      this.ordenesBuscarList = [];
    } else {
      if (this.ordenesBuscarListFacturaSelect.length == 0) {
        alert("Debe seleccionar almenos una orden");
        return;
      }
      this.itemsFactura = [];
      let ids: string[] = [];
      for (let d of this.ordenesBuscarListFacturaSelect) {
        ids.unshift(d.documento_id);
        if (this.documentoFactura.tipo_documento_id == this.TIPO_DOCUMENTO_FACTURA) {
          let documentoOrden: DocumentoOrdenModel = new DocumentoOrdenModel();
          documentoOrden.documento_id = this.documentoFactura.documento_id;
          documentoOrden.orden_id = d.documento_id;
          this.documentoService.saveDocumentoOrden(documentoOrden).subscribe(res => {
            if (res.code != 200) {
              alert("error creando documentoOrden, por favor inicie nuevamente la creación del documento, si persiste consulte a su proveedor");
            }
          });
        }
      }
      this.documentoDetalleService.getDocumentoDetalleByDocumentoList(ids).subscribe(res => {
        this.itemsFactura = res;
        this.documentoFactura = this.calculosService.calcularExcento(this.documentoFactura, this.itemsFactura);
        this.documentoService.updateDocumento(this.documentoFactura).subscribe(res => {
          if (res.code != 200) {
            alert("error actualizando el documento, por favor inicie nuevamente la creación del documento");
            return;
          }
        });
        console.log("detalles encontrados:" + res.length);
      });
      //ver por que no suma el total...meter esto dentro del suscribe
      //tambien crear las tablas de guardar las ordenes y los documentos
    }
    $('#agregarOrdenModal').modal('hide');
  }





  calcularIvaAll(impuesto) {
    for (let detalle of this.itemsFactura) {
      const index = this.itemsFactura.indexOf(detalle, 0);
      if (index > -1) {
        detalle.impuesto_producto = impuesto.value;
        this.itemsFactura.splice(index, 1, detalle);
      }
      this.documentoDetalleService.updateDocumentoDetalle(detalle).subscribe(res => {
        if (res.code != 200) {
          alert("Error agregando repuesto: " + res.error);
        } else {
          this.documentoFactura = this.calculosService.calcularExcento(this.documentoFactura, this.itemsFactura);
          this.documentoService.updateDocumento(this.documentoFactura).subscribe(res => {
            if (res.code != 200) {
              alert("error actualizando el documento, por favor inicie nuevamente la creación del documento");
              return;
            }
          });
        }
      });
    }
  }

  calcularIva(detalle: DocumentoDetalleModel, impuesto) {
    const index = this.itemsFactura.indexOf(detalle, 0);
    if (index > -1) {
      detalle.impuesto_producto = impuesto.value;
      this.itemsFactura.splice(index, 1, detalle);
    }
    this.documentoDetalleService.updateDocumentoDetalle(detalle).subscribe(res => {
      if (res.code != 200) {
        alert("Error agregando repuesto: " + res.error);
      } else {
        this.documentoFactura = this.calculosService.calcularExcento(this.documentoFactura, this.itemsFactura);
        this.documentoService.updateDocumento(this.documentoFactura).subscribe(res => {
          if (res.code != 200) {
            alert("error actualizando el documento, por favor inicie nuevamente la creación del documento");
            return;
          }
        });
      }
    });
  }

  eliminarOrden(orden: DocumentoModel) {
    this.documentoService.deleteDocumentoOrdenByOrden(orden).subscribe(res => {
      if (res.code != 200) {
        alert("error eliminando el documentoOrden, por favor inicie nuevamente la creación del documento");
        return;
      } else {
        const index = this.ordenesBuscarListFacturaSelect.indexOf(orden, 0);
        if (index > -1) {
          this.ordenesBuscarListFacturaSelect.splice(index, 1);
          this.confirmarAgregarOrdenes('s')
        }

      }
    });
  }

  selectOrdenOne(or: DocumentoModel, event) {
    if (this.documentoFactura.documento_id == "") {
      alert("Debe crear un nuevo documento antes de realizar esta acción");
      event.target.checked = false;
      return "";
    }
    if (event.target.checked) {
      this.documentoService.getDocumentoOrdenById(or.documento_id).subscribe(res => {
        if (res.length > 0) {
          alert("La orden Seleccionada ya se encuentra asociada a la factura número: " + res[0].documento_id);
          event.target.checked = false;
          return;
        } else {
          this.ordenesBuscarListFacturaSelect.unshift(or);
        }
      });


    } else {
      const index = this.ordenesBuscarListFacturaSelect.indexOf(or, 0);
      if (index > -1) {
        this.ordenesBuscarListFacturaSelect.splice(index, 1);
      }
    }
    console.log(this.ordenesBuscarListFacturaSelect);
  }

  nombreClienteFun(id) {

    let cliente = this.clientes.find(cliente => cliente.cliente_id == id);
    if (cliente == undefined) {
      return "";
    } else {
      return cliente.nombre;
    }
  }

  nombreUsuarioFiltro(id) {
    let usuario = this.usuarioList.find(usuario => usuario.usuario_id == id);
    return usuario == undefined ? "" : usuario.nombre;
  }

  editarOrden(orden: DocumentoModel) {
    this.documento = orden;
    this.asignarValores(orden.documento_id);
    $('#buscarModal').modal('hide');
  }

  cargarFactura(orden: DocumentoModel) {
    this.documentoFactura = orden;
    this.asignarValoresFactura(orden.documento_id);
    $('#buscarFacturaModal').modal('hide');
  }

  observacionFactura() {
    if (this.documentoFactura.documento_id == "") {
      alert("Debe pulsar el boton nuevo documento");
      return;
    }
    this.documentoFactura.descripcion_trabajador = this.observacionFact.nativeElement.value;
    this.documentoService.updateDocumento(this.documentoFactura).subscribe(res => {
      if (res.code != 200) {
        alert("error actualizando el documento, por favor inicie nuevamente la creación del documento");
        return;
      }
    });
  }

  asignarValores(documento_id: string) {
    if (documento_id != '') {
      this.placa.nativeElement.value = this.documento.detalle_entrada;
      let cliente = this.clientes.find(cliente => cliente.cliente_id == this.documento.cliente_id);
      let nombre = "";
      if (cliente != undefined) {
        nombre = cliente.nombre;
      }
      let empleado = this.empleados.find(empleado => empleado.empleado_id == this.documento.empleado_id);
      let nombreEmpleado = "";
      if (empleado != undefined) {
        nombreEmpleado = empleado.nombre;
      }
      let parametros: ParametrosModel = new ParametrosModel;
      if (parametros.ambiente == 'cloud') {
        this.downloadURL = (this.documento.mac == '' ? null : this.afStorage.ref(this.documento.mac).getDownloadURL());
      } else {
        if (this.documento.mac != '') {
          this.usuarioService.getFile(this.documento.mac == '' ? null : this.documento.mac).subscribe(res => {

            const imageBlob = this.dataURItoBlob(res);
            var reader = new FileReader();
            reader.readAsDataURL(imageBlob);
            reader.onload = (_event) => {
              this.downloadURLLocal = reader.result;
            }
          });
        } else {
          this.downloadURLLocal = null;
        }
      }
      if (this.documento.linea_vehiculo != "") {
        this.linea.nativeElement.value = this.documento.linea_vehiculo;
      } else {
        this.linea.nativeElement.value = "Seleccione Linea";
      }
      this.clientePV.nativeElement.value = nombre;
      if (this.empleadoOrdenActivo) {
        this.empleadoPV.nativeElement.value = nombreEmpleado;
      }
      this.descripcionCliente.nativeElement.value = this.documento.descripcion_cliente;
      this.observacion.nativeElement.value = this.documento.descripcion_trabajador;
      if (this.documento.modelo_marca_id != null) {
        this.marcasService.getModeloById(this.documento.modelo_marca_id).subscribe(res => {
          let modelo = res[0];
          this.marcasService.getModeloByMarca(modelo.marca_vehiculo_id).subscribe(modRes => {
            this.modeloList = modRes;
            let marcaId = this.marcaList.find(ma => ma.marca_vehiculo_id == modelo.marca_vehiculo_id);
            this.marca.nativeElement.value = marcaId.nombre;
            this.modelo.nativeElement.value = modelo.nombre;

          });
        });
      } else {
        this.marca.nativeElement.value = "";
        this.modelo.nativeElement.value = "";
        this.modeloList = [];
      }
      this.documentoDetalleService.getDocumentoDetalleByDocumento(documento_id).subscribe(res => {
        this.detallesList = res;
        this.calcularTOtal();
        console.log("detalles encontrados:" + res.length);
      });
    }
  }

  asignarValoresFactura(documento_id: string) {
    if (documento_id != '') {

      let cliente = this.clientes.find(cliente => cliente.cliente_id == this.documentoFactura.cliente_id);
      let nombre = "";
      if (cliente != undefined) {
        nombre = cliente.nombre;
      }
      let parametros: ParametrosModel = new ParametrosModel;
      this.clienteFactura.nativeElement.value = nombre;
      this.observacionFact.nativeElement.value = this.documentoFactura.descripcion_trabajador;
      this.documentoService.getOrdenesByDocumentoId(documento_id).subscribe(res => {
        this.ordenesBuscarListFacturaSelect = res;
        let ids: string[] = [];
        for (let d of this.ordenesBuscarListFacturaSelect) {
          ids.unshift(d.documento_id);
        }
        if (ids.length > 0) {
          this.documentoDetalleService.getDocumentoDetalleByDocumentoList(ids).subscribe(res => {
            this.itemsFactura = res;
            console.log("detalles encontrados:" + res.length);
          });
        } else {
          this.itemsFactura = [];
        }

      });


    }
  }

  dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });
    return blob;
  }

  empleadoSelectFun(element) {
    console.log(this.empleados);
    let empleado = this.empleados.find(empleado => empleado.nombre == element.value);
    if (empleado == undefined) {
      alert("El Empleado no existe");
      return;
    } else {
      console.log(empleado);
      this.documento.empleado_id = empleado.empleado_id;
      if (this.documento.documento_id == "") {
        alert("Debe pulsar el boton nuevo documento");
        return;
      }
      this.documentoService.updateDocumento(this.documento).subscribe(res => {
        if (res.code != 200) {
          alert("error actualizando el documento, por favor inicie nuevamente la creación del documento");
          return;
        }
      });
    }
  }

  getActivaciones(user: number) {
    this.usuarioService.getActivacionByUsuario(user.toString()).subscribe(res => {
      this.activaciones = res;
      for (var e = 0; e < this.activaciones.length; e++) {
        if (this.activaciones[e].activacion_id == this.PRODUCTOS_FIJOS) {
          console.log("productos fijos activo");
          this.productoFijoActivo = true;
        }
        if (this.activaciones[e].activacion_id == this.CLIENTE_OBLIGATORIO) {
          console.log("cliente obligatorio");
          this.clienteObligatorioActivo = true;
        }
        if (this.activaciones[e].activacion_id == this.ACTIVAR_EMPLEADOS_ORDEN) {
          console.log("empleados en orden activo");
          this.empleadoOrdenActivo = true;
        }
      }
    });
  }

  nombreUsuario() {
    let id = this.documento.usuario_id;
    let usuario = this.usuarioList.find(usuario => usuario.usuario_id == id);
    return usuario == undefined ? "" : usuario.nombre;
  }

  buscarUsuarios() {
    let empresaId: string = localStorage.getItem('empresa_id');
    this.usuarioService.getByUsuario(null, empresaId, null).subscribe(res => {
      this.usuarioList = res;
    });
  }

  getclientes(empresaId: number) {
    this.clienteService.getClientesByEmpresa(empresaId.toString()).subscribe(res => {
      this.clientes = res;
      console.log("lista de clientes cargados: " + this.clientes.length);
    });
  }

  getConfiguracion(empresaId: number) {
    this.clienteService.getConfiguracionByEmpresa(empresaId.toString()).subscribe(res => {
      this.configuracion = res;
    });
  }

  getTipoPago() {
    this.clienteService.getTipoPago().subscribe(res => {
      this.tipoPagosAll = res;
      console.log("tipos de pago:" + this.tipoPagosAll.length);
    });
  }

  getResolucion() {
    this.clienteService.getResolucion(this.empresaId).subscribe(res => {
      this.resolucionAll = res;
    });
  }

  getEmpleados() {
    this.empleadoService.getEmpleadoAll(this.empresaId).subscribe(res => {
      this.empleados = res;
    });
  }

  getTipoIdentificacion() {
    this.clienteService.getTipoIdentificacionAll().subscribe(res => {
      this.tipoIdentificacionList = res;
    });
  }



  formatearNumber(number: number) {
    let formato: string = "";
    formato = new Intl.NumberFormat().format(number);
    return formato;
  }

}
