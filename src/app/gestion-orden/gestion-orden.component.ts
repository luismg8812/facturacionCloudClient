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

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-gestion-orden',
  templateUrl: './gestion-orden.component.html',
  styleUrls: ['./gestion-orden.component.css']
})
export class GestionOrdenComponent implements OnInit {

  readonly PRODUCTOS_FIJOS: string = '21';

  public documento: DocumentoModel = new DocumentoModel();
  public documentoFactura: DocumentoModel = new DocumentoModel();
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
  public productosAll: Array<ProductoModel>;
  public activaciones: Array<ActivacionModel> = [];
  public productoFijoActivo: boolean = false;
  public articuloPV: string = "";
  public productoIdSelect: ProductoModel = null;
  public impresoraEmpresa: Array<ImpresoraEmpresaModel>;
  public factura: FacturaModel;

  //factura
  public ordenesFactura: Array<DocumentoModel> = [];
  public itemsFactura: Array<DocumentoDetalleModel> = [];
  public ordenesBuscarListFactura: Array<DocumentoModel> = [];
  public facturasBuscarList: Array<DocumentoModel> = [];
  public ordenesBuscarListFacturaSelect: Array<DocumentoModel> = [];
  public facturasList: Array<DocumentoModel> = [];
  public indexFacturaSelect: number = 0;


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

  //campos de factura
  @ViewChild("clienteFactura") clienteFactura: ElementRef;
  @ViewChild("observacionFact") observacionFact: ElementRef;


  constructor(public productoService: ProductoService,
    public empresaService: EmpresaService,
    public impresionService: ImpresionService,
    public marcasService: MarcasService, public documentoDetalleService: DocumentoDetalleService, public afStorage: AngularFireStorage, public calculosService: CalculosService, public documentoService: DocumentoService, public usuarioService: UsuarioService, public clienteService: ClienteService) { }

  ngOnInit() {
    this.usuarioId = Number(sessionStorage.getItem("usuario_id"));
    this.empresaId = Number(sessionStorage.getItem("empresa_id"));
    this.buscarUsuarios();
    this.getclientes(this.empresaId);
    this.marcas();
    this.getActivaciones(this.usuarioId);
    this.getProductosByEmpresa(this.empresaId);
    this.getImpresorasEmpresa(this.empresaId);
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
    this.documento.tipo_documento_id = 11;// SE AGREGA tipo documento =11 orden de trabajo
    this.documento.fecha_registro = this.calculosService.fechaActual();
    this.documento.fecha_entrega = null;
    this.documento.usuario_id = this.usuarioId;
    this.documento.empresa_id = this.empresaId;
    this.documento.invoice = null;
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

  nuevaFactura() {
    console.log("nueva factura");
    this.limpiarFactura();
    this.documentoFactura.tipo_documento_id = 10;// SE AGREGA tipo documento =10 factura de venta
    this.documentoFactura.fecha_registro = this.calculosService.fechaActual();
    this.documentoFactura.usuario_id = this.usuarioId;
    this.documentoFactura.empresa_id = this.empresaId;
    this.documentoFactura.invoice = 1; // invoice 1 sin enviar a la DIAN
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
    if (valido == false) {
      alert(mensageError);
      return;
    }
    this.clienteNew.empresa_id = this.empresaId;
    this.clienteService.saveCliente(this.clienteNew).subscribe(res => {
      if (res.code == 200) {
        this.getclientes(this.empresaId);
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
      let tipoDocumentoId: Array<number> = [11];
      this.documentoService.getDocumentoByTipo(tipoDocumentoId, this.empresaId.toString(), "", '').subscribe(res => {
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
      let tipoDocumentoId: Array<number> = [10];
      this.documentoService.getDocumentoByTipo(tipoDocumentoId, this.empresaId.toString(), "", '').subscribe(res => {
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
          this.calcularTOtal();
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
      this.detalleSelect.parcial = this.detalleSelect.cantidad * this.detalleSelect.unitario;
      if ($('#fotoRepuesto')[0].files[0] != undefined) {
        this.detalleSelect.url_foto = this.cargarFotoRepuesto(this.detalleSelect);
      }
      this.documentoDetalleService.updateDocumentoDetalle(this.detalleSelect).subscribe(res => {
        if (res.code != 200) {
          alert("Error agregando repuesto: " + res.error);
        }
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
    if (impresora.value == "") {
      impresora.value = 1;
    }
    if (this.documento.cliente_id == null) {
      //si el cliente es nulo se asigna el varios por defecto
      this.documento.cliente_id = 1;
    }
    let tipoImpresion = "";

    for (var i = 0; i < this.impresoraEmpresa.length; i++) {
      console.log(this.impresoraEmpresa[i].numero_impresora+":"+impresora.value);
      if (impresora.value == this.impresoraEmpresa[i].numero_impresora) {
        tipoImpresion = this.impresoraEmpresa[i].tipo_impresion;
        console.log(this.impresoraEmpresa[i]);
        break;
      }
    }
    if (tipoImpresion == "") {
      alert("No existen impresoras configuradas para la empresa");
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
      this.factura.nombreUsuario = sessionStorage.getItem("nombreUsuario");
      this.factura.cliente = this.clientes.find(cliente => cliente.cliente_id == this.documento.cliente_id);
      switch (tipoImpresion) {
        case "TXT80MM":
          this.descargarArchivo(this.impresionService.imprimirOrdenTxt80(this.factura), tituloDocumento + '.txt');
          break;
          case "TXT50MM":
            this.descargarArchivo(this.impresionService.imprimirOrdenTxt50(this.factura), tituloDocumento + '.txt');
            break;
        default:
          alert("no tiene un tipo impresion");
          //Impresion.imprimirPDF(getDocumento(), getProductos(), usuario(), configuracion, impresora,
          //    enPantalla, e);
          break;
      }
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
        });
      } else {
        alert("Error agregando repuesto: " + res.error);
      }
    });
    $('#eliminarModal').modal('hide');
  }

  buscarOrdenes(placa, clien, fechaInicial, fechaFinal) {
    let idCliente = "";
    let tipoDocumentoId = 11;
    if (clien.value != "") {
      let cliente = this.clientes.find(cliente => cliente.nombre == clien.value);
      idCliente = cliente.cliente_id.toString();
    }
    this.documentoService.getOrdenesTrabajo(this.empresaId.toString(), placa.value, idCliente, fechaInicial.value, fechaFinal.value, tipoDocumentoId).subscribe(res => {
      this.ordenesBuscarList = res;
    });
  }

  buscarFacturas(placa, clien, fechaInicial, fechaFinal) {
    let idCliente = "";
    let tipoDocumentoId = 10; // se buscan facturas
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
    let tipoDocumentoId = 11;// se buscan ordenes de trabajo
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
  }

  marcaSelect(marca) {
    console.log(marca.value);
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
        let documentoOrden: DocumentoOrdenModel = new DocumentoOrdenModel();
        documentoOrden.documento_id = this.documentoFactura.documento_id;
        documentoOrden.orden_id = d.documento_id;
        this.documentoService.saveDocumentoOrden(documentoOrden).subscribe(res => {
          if (res.code != 200) {
            alert("error creando documentoOrden, por favor inicie nuevamente la creación del documento, si persiste consulte a su proveedor");
          }
        });
      }
      console.log(ids);
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



  calcularIva(detalle: DocumentoDetalleModel, impuesto) {
    console.log(impuesto.value);
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
      let parametros: ParametrosModel = new ParametrosModel;
      if (parametros.ambiente == 'cloud') {
        this.downloadURL = (this.documento.mac == '' ? null : this.afStorage.ref(this.documento.mac).getDownloadURL());
      } else {
        if (this.documento.mac != '') {
          this.usuarioService.getFile(this.documento.mac == '' ? null : this.documento.mac).subscribe(res => {
            console.log(res);
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
        if(ids.length>0){
          this.documentoDetalleService.getDocumentoDetalleByDocumentoList(ids).subscribe(res => {
            this.itemsFactura = res;
            console.log("detalles encontrados:" + res.length);
          });
        }else{
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

  getActivaciones(user: number) {
    this.usuarioService.getActivacionByUsuario(user.toString()).subscribe(res => {
      this.activaciones = res;
      for (var e = 0; e < this.activaciones.length; e++) {
        if (this.activaciones[e].activacion_id == this.PRODUCTOS_FIJOS) {
          console.log("productos fijos activo");
          this.productoFijoActivo = true;
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
    let empresaId: string = sessionStorage.getItem('empresa_id');
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

  formatearNumber(number: number) {
    let formato: string = "";
    formato = new Intl.NumberFormat().format(number);
    return formato;
  }

}
