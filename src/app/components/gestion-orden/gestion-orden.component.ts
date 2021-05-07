import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { Observable } from 'rxjs';

import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { ActivacionModel } from 'src/app/model/activacion';
import { ClienteModel } from 'src/app/model/cliente.model';
import { ConfiguracionModel } from 'src/app/model/configuracion.model';
import { DocumentoModel } from 'src/app/model/documento.model';
import { DocumentoDetalleModel } from 'src/app/model/documentoDetalle.model';
import { DocumentoInvoiceModel } from 'src/app/model/documentoInvoice.model';
import { DocumentoNotaModel } from 'src/app/model/documentoNota.model';
import { DocumentoOrdenModel } from 'src/app/model/documentoOrden.model';
import { EmpleadoModel } from 'src/app/model/empleado.model';
import { EmpresaModel } from 'src/app/model/empresa.model';
import { FactTipoEmpresaModel } from 'src/app/model/factTipoEmpresa.model';
import { ImpresoraEmpresaModel } from 'src/app/model/impresoraEmpresa.model';
import { InformeDiarioModel } from 'src/app/model/informeDiario.model';
import { MarcaVehiculoModel } from 'src/app/model/marcaVehiculo.model';
import { ModeloMarcaModel } from 'src/app/model/modeloMarca.model';
import { ParametrosModel } from 'src/app/model/parametros.model';
import { ProductoModel } from 'src/app/model/producto.model';
import { ResolucionEmpresaModel } from 'src/app/model/resolucionEmpresa.model';
import { TipoIdentificacionModel } from 'src/app/model/tipoIdentificacion.model';
import { TipoPagoModel } from 'src/app/model/tipoPago.model';
import { TipoPagoDocumentoModel } from 'src/app/model/tipoPagoDocumento.model';
import { UsuarioModel } from 'src/app/model/usuario.model';
import { CalculosService } from 'src/app/services/calculos.service';
import { CierreService } from 'src/app/services/cierre.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { DocumentoDetalleService } from 'src/app/services/documento-detalle.service';
import { DocumentoService } from 'src/app/services/documento.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { ImpresionService } from 'src/app/services/impresion.service';
import { MarcasService } from 'src/app/services/marcas.service';
import { ProductoService } from 'src/app/services/producto.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { FacturaModel } from 'src/app/vo/factura.model';
import { VehiculoModel } from 'src/app/model/vehiculo.model';
import { SubMenuModel } from 'src/app/model/submenu.model';
import { BonoModel } from 'src/app/model/bono.model';
import { BonoService } from 'src/app/services/bono.service';


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
  readonly ACTIVAR_FACTURACION_ORDEN: string = '24';
  readonly ACTIVAR_REABRIR_ORDEN: string = '26';
  readonly TIPO_DOCUMENTO_FACTURA: number = 10;
  readonly TIPO_DOCUMENTO_COTIZACION: number = 4;
  readonly TIPO_DOCUMENTO_ORDEN_TRABAJO: number = 11;
  readonly TIPO_PAGO_EFECTIVO: number = 1;
  readonly TIPO_IMPRESION_TXT80MM: number = 1;
  readonly TIPO_IMPRESION_TXT50MM: number = 2;
  readonly TIPO_IMPRESION_PDFCARTA: number = 3;
  readonly TIPO_IMPRESION_PDF50MM: number = 5;

  readonly INVOICE_SIN_ENVIAR: number = 1;
  readonly NOTA_CREDITO: number = 12;
  readonly NOTA_DEBITO: number = 13;

  public documento: DocumentoModel = new DocumentoModel();
  public vehiculo: VehiculoModel = new VehiculoModel();
  public usuarioId: number;
  public empresaId: number;
  public detallesList: Array<DocumentoDetalleModel> = [];
  public usuarioList: Array<UsuarioModel> = [];
  public indexSelect: number = 0;
  public numeroCliente: string = "";
  public clientes: Array<ClienteModel>;
  public ref: AngularFireStorageReference;
  public task: AngularFireUploadTask;
  public downloadURL: Observable<string>;
  public downloadURLLocal: any;
  public downloadURL2: Observable<string>;
  public productoNew: ProductoModel = new ProductoModel();
  public detalleSelect: DocumentoDetalleModel = new DocumentoDetalleModel();
  public valorTotal: number = 0;
  public ordenesBuscarList: Array<DocumentoModel> = [];
  public ordenesList: Array<DocumentoModel> = [];
  public clienteNew: ClienteModel = new ClienteModel();
  public marcaList: Array<MarcaVehiculoModel> = [];
  public modeloList: Array<ModeloMarcaModel> = [];
  public tipoIdentificacionList: Array<TipoIdentificacionModel> = [];
  public tipoEmpresaList: Array<FactTipoEmpresaModel> = [];
  public productosAll: Array<ProductoModel>;
  public activaciones: Array<ActivacionModel> = [];
  public productoFijoActivo: boolean = false;
  public clienteObligatorioActivo: boolean = false;
  public articuloPV: string = "";
  public productoIdSelect: ProductoModel = null;
  public impresoraEmpresa: Array<ImpresoraEmpresaModel>;
  public vehiculosEmpresa: Array<VehiculoModel>;
  public factura: FacturaModel;
  public empleados: Array<EmpleadoModel>;
  public empleadoOrdenActivo: boolean = false;
  public facturaOrdenActivo: boolean = false;
  public reabirOrdenActivo: boolean = false;
  public numOrdenes:number=0;
  public empresa: EmpresaModel;

  //factura
  public ordenesFactura: Array<DocumentoModel> = [];
  public itemsFactura: Array<DocumentoDetalleModel> = [];
  public itemsFactura2: Array<DocumentoDetalleModel> = [];
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
  public fechaI: string = "";
  public fechaF: string = "";

  public documentoSelect: DocumentoModel = new DocumentoModel();

  public opciones: Array<SubMenuModel>;

  @ViewChild("clientePV") clientePV: ElementRef;
  @ViewChild("placa") placa: ElementRef;
  @ViewChild("descripcionCliente") descripcionCliente: ElementRef;
  @ViewChild("observacion") observacion: ElementRef;
  @ViewChild("item") item: ElementRef;
  @ViewChild("articuloC") articuloC: ElementRef;
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

  //opciones
  @ViewChild("abonoModal") abonoModal: ElementRef;


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
    this.getTipoEmpresa();
    this.factura = new FacturaModel();
    this.fechasBusqueda();
    this.vehiculos();
    this.opcionesSubmenu();
    this.getEmpresa();
  }

  fechasBusqueda() {
    let date: Date = new Date();
    let mes: string = "" + (date.getMonth() + 1);
    if (mes.length == 1) {
      mes = '0' + mes;
    }
    let ano = date.getFullYear();
    this.fechaI = ano + "-" + mes + "-" + '01';
    this.fechaF = ano + "-" + mes + "-" + '30';
    console.log(this.fechaI);
  }


  getProductosByEmpresa(empresaId: number) {
    this.productoService.getProductosByEmpresa(empresaId.toString()).subscribe(res => {
      this.productosAll = res;
    });
  }

  cambioCantidad(cantidad) {
    if (isNaN(cantidad.value)) {
      console.log("no es numérico:" + cantidad.value);
      return;
    }
    if (cantidad.value < 0) {
      console.log("la cantidad no puede ser negativa:" + cantidad.value);
      return;
    }
    let id = cantidad.id.toString().replace("c_", "");
    for (let i = 0; i < this.itemsFactura.length; i++) {
      if (this.itemsFactura[i].documento_detalle_id.toString() == id) {
        this.itemsFactura[i].cantidad = cantidad.value;
        this.itemsFactura[i].parcial = Number(cantidad.value) * this.itemsFactura[i].unitario;
        this.documentoSelect = this.calculosService.calcularExcento(this.documentoSelect, this.itemsFactura);
        break;
      }
    }
  }

  cambioUnitario(unitario) {
    if (isNaN(unitario.value)) {
      alert("no es numérico:" + unitario.value);
      return;
    }
    if (unitario.value < 0) {
      alert("el valor unitario no puede ser negativa:" + unitario.value);
      return;
    }
    let id = unitario.id.toString().replace("u_", "");
    for (let i = 0; i < this.itemsFactura.length; i++) {
      if (this.itemsFactura[i].documento_detalle_id.toString() == id) {
        this.itemsFactura[i].unitario = unitario.value;
        this.itemsFactura[i].parcial = Number(unitario.value) * this.itemsFactura[i].cantidad;
        this.documentoSelect = this.calculosService.calcularExcento(this.documentoSelect, this.itemsFactura);
        break;
      }
    }
  }

  cerrarNota() {
    $('#notaModal').modal('hide');
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
    if (this.vehiculo.vehiculo_id != null) {
      this.vehiculo.modelo_marca_id = modeloId.modelo_marca_id;
      this.clienteService.updateVehiculo(this.vehiculo).subscribe(res => {
        if (res.code != 200) {
          alert("error actualizando el documento, por favor inicie nuevamente la creación del documento");
          return;
        }
      });
    }
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
      if (this.vehiculo.vehiculo_id != null) {
        this.vehiculo.linea_vehiculo = linea.value;
        this.clienteService.updateVehiculo(this.vehiculo).subscribe(res => {
          if (res.code != 200) {
            alert("error actualizando el documento, por favor inicie nuevamente la creación del documento");
            return;
          }
        });
      }
    }
  }

  marcas() {
    this.marcasService.getMarcas().subscribe(res => {
      this.marcaList = res;
    });
  }

  confirmarNota(observacion) {
    let newDocu: DocumentoModel = new DocumentoModel();
    if (observacion.value == "") {
      alert("La descripción del error es obligatoria");
      return;
    }
    this.documentoService.getByDocumentoId(this.documentoSelect.documento_id).subscribe(factura => {
      newDocu.cliente_id=this.documentoSelect.cliente_id;
      newDocu.letra_consecutivo=this.documentoSelect.letra_consecutivo;
      newDocu.consecutivo_dian=this.documentoSelect.consecutivo_dian;
      newDocu.resolucion_empresa_id=this.documentoSelect.resolucion_empresa_id;
      newDocu.empresa_id=this.documentoSelect.empresa_id;
     newDocu.impreso=1;
      newDocu.descripcion_trabajador = observacion.value;
      newDocu.fecha_registro = new Date();
      newDocu.usuario_id = this.usuarioId;
      newDocu.invoice_id = this.INVOICE_SIN_ENVIAR;
      newDocu.cufe = "";
      if (newDocu.total < factura[0].total) {
        newDocu.tipo_documento_id = this.NOTA_CREDITO;
      } else {
        newDocu.tipo_documento_id = this.NOTA_DEBITO;
      }
      factura[0].anulado=1;//se anula el documento
      this.documentoService.saveDocumento(newDocu).subscribe(res => {
        if (res.code == 200) {
          newDocu.documento_id = res.documento_id;
          let documentoInvoice: DocumentoInvoiceModel = new DocumentoInvoiceModel()
          documentoInvoice.documento_id = res.documento_id;
          documentoInvoice.fecha_registro = new Date();
          documentoInvoice.invoice_id = this.INVOICE_SIN_ENVIAR;
          this.asignarDetalleDevolucion(newDocu);
          this.crearNotaDocumento(newDocu, factura[0]);
          this.documentoService.saveInvoice(documentoInvoice).subscribe(res => {
            if (res.code == 200) {
              console.log("Se agrega estado para facturación electrónica");
            } else {
              alert("error creando documento, por favor inicie nuevamente la creación del documento, si persiste consulte a su proveedor");
              return;
            }
          });
          this.documentoService.deleteDocumentoOrdenByDocumento(this.documentoSelect).subscribe(res => {
            if (res.code != 200) {
              alert("error eliminando el documentoOrden, por favor inicie nuevamente la creación del documento");
              return;
            } 
          });
        
          $('#notaModal').modal('hide');
        } else {
          alert("error creando documento, por favor inicie nuevamente la creación del documento");
          return;
        }
      });
    });
  }

  asignarDetalleDevolucion(d:DocumentoModel){
      let docDetalle: DocumentoDetalleModel = new DocumentoDetalleModel();
      docDetalle.descripcion = "Prodocto devolución";
      docDetalle.estado = 1;
      docDetalle.cantidad = 1;
      docDetalle.unitario = 0;
      docDetalle.parcial = 0;
      docDetalle.impreso_comanda = 0;
      docDetalle.documento_id = d.documento_id;
      let dd: Array<DocumentoDetalleModel>=[];
      this.documentoDetalleService.saveDocumentoDetalle(docDetalle).subscribe(res => {
        if (res.code == 200) {
          docDetalle.documento_detalle_id = res.documento_detalle_id;
          dd.push(docDetalle);
          d = this.calculosService.calcularExcento(d, dd);
          this.documentoService.updateDocumento(d).subscribe(res => {
            if (res.code != 200) {
              alert("error actualizando el documento, por favor inicie nuevamente la creación del documento");
              return;
            }
          });
        } else {
          alert("Error agregando repuesto: " + res.error);
        }
      });
  }



  crearNotaDocumento(nota1: DocumentoModel, factura: DocumentoModel) {
    this.documentoService.getDocumentoNotaByDocumento(factura.documento_id).subscribe(res => {
      for (let nota of res) {
        nota.estado = 0;
        this.documentoService.updateDocumentoNota(nota).subscribe(res => {
          if (res.code == 200) {
            console.log("se edita documento nota");
          } else {
            alert("error creando documento Nota, tener en cuenta el error");
            return;
          }
        });
      }
      let newDocuNota: DocumentoNotaModel = new DocumentoNotaModel();
      newDocuNota.estado = 1;
      newDocuNota.documento_id = factura.documento_id;
      newDocuNota.nota_id = Number(nota1.documento_id);
      this.documentoService.saveDocumentoNota(newDocuNota).subscribe(res => {
        if (res.code == 200) {
          console.log("se agrega documento nota");
          factura.nota_id = res.documento_nota_id;
          this.documentoService.updateDocumento(factura).subscribe(res => {
            if (res.code != 200) {
              alert("error creando documento, por favor inicie nuevamente la creación del documento");
              return;
            }
          });
        } else {
          alert("error creando documento NOta, tener en cuenta el error");
          return;
        }
      });
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
    this.placa.nativeElement.focus();
    this.clientePV.nativeElement.value = "";
    this.modelo.nativeElement.value = "";
    this.marca.nativeElement.value = "";
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
      } else {
        alert("error creando documento, por favor inicie nuevamente la creación del documento, si persiste consulte a su proveedor");
        return;
      }
    });
  }

  clienteSelectFun(element) {
    console.log(this.clientes);
    if (this.documento.documento_id == "") {
      alert("Debe pulsar el boton nueva orden");
      return;
    }
    let cliente = this.clientes.find(cliente => (cliente.nombre + ' ' + cliente.apellidos + ' ' + cliente.razon_social + ' - ' + cliente.documento) == element.value);
    if (cliente == undefined) {
      this.clienteNew.nombre = element.value;
      $('#crearClienteModal').modal('show');
      return;
    } else {
      console.log(cliente);
      this.documento.cliente_id = cliente.cliente_id;
      this.numeroCliente = cliente.celular + (cliente.fijo != "" ? "-" + cliente.fijo : "");
      this.documentoService.updateDocumento(this.documento).subscribe(res => {
        if (res.code != 200) {
          alert("error actualizando el documento, por favor inicie nuevamente la creación del documento");
          return;
        }
      });
      console.log(this.vehiculo);
      if (this.vehiculo.vehiculo_id != null) {
        this.vehiculo.cliente_id = cliente.cliente_id;
        this.clienteService.updateVehiculo(this.vehiculo).subscribe(res => {
          if (res.code != 200) {
            alert("error actualizando el documento, por favor inicie nuevamente la creación del documento");
            return;
          }
        });
      }

    }
  }

  clienteSelectFactura(element) {
    if (this.documentoFactura.documento_id == "") {
      alert("Debe pulsar el boton nueva Factura");
      return;
    }
    let cliente = this.clientes.find(cliente => cliente.nombre + ' ' + cliente.apellidos + ' - ' + cliente.documento == element.value);
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
    let cliente = this.clientes.find(cliente => (cliente.documento) == this.clienteNew.documento);
    if (cliente != undefined) {
      alert("El cliente que está intentando crear ya se incuentra registrado bajo el \nnombre: " + cliente.nombre + " " + cliente.apellidos + "\n" + "NIT: " + cliente.documento);
      return;
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
      alert("Debe pulsar el boton nueva orden");
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
      alert("Debe pulsar el boton nueva orden");
      return;
    }
    console.log(element.value);
    this.documento.detalle_entrada = element.value;
    this.documento.detalle_entrada = this.documento.detalle_entrada.toUpperCase();
    element.value = this.documento.detalle_entrada.toUpperCase();

    this.vehiculo = this.vehiculosEmpresa.find(product => product.placa === this.documento.detalle_entrada.toUpperCase().trim());
    if (this.vehiculo != undefined) {
      let cliente = this.clientes.find(client => client.cliente_id == this.vehiculo.cliente_id);
      if (cliente != undefined) {
        this.clientePV.nativeElement.value =(cliente.nombre + ' ' + cliente.apellidos + ' ' + cliente.razon_social + ' - ' + cliente.documento);
        this.numeroCliente = cliente.celular + (cliente.fijo != "" ? "-" + cliente.fijo : "");
        this.documento.cliente_id = cliente.cliente_id;
      }
      if (this.vehiculo.linea_vehiculo != "") {
        this.linea.nativeElement.value = this.vehiculo.linea_vehiculo;
        this.documento.linea_vehiculo = this.vehiculo.linea_vehiculo;
      } else {
        this.linea.nativeElement.value = "Seleccione Linea";
      }
      if (this.vehiculo.modelo_marca_id != null) {
        this.marcasService.getModeloById(this.vehiculo.modelo_marca_id).subscribe(res => {
          let modelo = res[0];
          this.documento.modelo_marca_id = modelo.modelo_marca_id;
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
    } else {
      this.vehiculo = new VehiculoModel();
      this.vehiculo.placa = this.documento.detalle_entrada.toUpperCase().trim();
      this.clienteService.saveVehiculo(this.vehiculo).subscribe(res => {
        this.vehiculo.vehiculo_id = res.vehiculo_id;
        this.vehiculosEmpresa.push(this.vehiculo);
        this.vehiculos();
      });
    }
    this.documentoService.updateDocumento(this.documento).subscribe(res => {
      if (res.code != 200) {
        alert("error actualizando el documento, por favor inicie nuevamente la creación del documento");
        return;
      }
    });
  }

  agregarObservacion(element) {
    if (this.documento.documento_id == "") {
      alert("Debe pulsar el boton nueva orden");
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
      alert("Debe pulsar el boton nueva orden");
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

  reabrir() {
    if (this.documento.documento_id == '') {
      alert("Debe pulsar el boton nueva orden");
      return;
    }
    if (this.reabirOrdenActivo) {
      this.documento.impreso = 0;
      this.documentoService.updateDocumento(this.documento).subscribe(res => {
        if (res.code != 200) {
          alert("error actualizando el documento, por favor inicie nuevamente la creación del documento");
          return;
        }
      });
    } else {
      alert("No tiene permisos para reapertura de ordenes");
    }
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

  adjuntarProducto(cantidad) {
    if (this.productoIdSelect == undefined) {
      alert("Debe seleccionar un articulo primero");
      return;
    }
    if (cantidad.value == "") {
      alert("Debe seleccionar la cantidad primero");
      return;
    }
    this.asignarDocumentoDetalle(cantidad.value, this.productoIdSelect.costo_publico);
  }

  private asignarDocumentoDetalle(cantidad: number, costo_publico: number,) {
    let docDetalle = new DocumentoDetalleModel();
    docDetalle.cantidad = cantidad;
    docDetalle.saldo = Number(this.productoIdSelect.cantidad)
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
    // this.itemsFactura2.unshift(docDetalle);
    this.documentoSelect = this.calculosService.calcularExcento(this.documentoSelect, this.itemsFactura);
    let newCantidad: number = this.productoIdSelect.cantidad;
    this.productoIdSelect.cantidad = newCantidad - docDetalle.cantidad;
    //this.restarCantidadesSubProducto(docDetalle); 
  }

  articuloSelect(element) {
    console.log("articulo select:" + element.value);
    let productoNombre: string = element.value;
    this.productoIdSelect = this.productosAll.find(product => product.nombre === productoNombre);
    if (this.productoIdSelect == undefined) {
      $('#crearProductoModal').modal('show');
      this.productoNew = new ProductoModel();
      this.productoNew.nombre = productoNombre;
    } else {
      console.log(this.productoIdSelect);
      this.cantidad.nativeElement.value = 1;
      this.cantidad.nativeElement.select();
      this.pCompra.nativeElement.value = this.productoIdSelect.costo;
      this.pVenta.nativeElement.value = this.productoIdSelect.costo_publico;
    }

  }

  cerrarCrearProducto() {
    $('#crearProductoModal').modal('hide');
  }

  crearProducto() {
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
        this.productoService.getProductosByEmpresa(this.empresaId.toString()).subscribe(res => {
          this.productosAll = res;
          this.productoIdSelect = this.productosAll.find(product => product.nombre === this.productoNew.nombre);
          console.log(this.productoIdSelect);
          this.cantidad.nativeElement.value = 1;
          this.cantidad.nativeElement.select();
          this.pCompra.nativeElement.value = this.productoIdSelect.costo;
          this.pVenta.nativeElement.value = this.productoIdSelect.costo_publico;
        });
      } else {
        alert("error creando producto, verifique que los valores de los precios y las cantidades no tengas ',/_' u otro caracter especial, si persiste consulte a su proveedor");
        return;
      }
    });
  }

  agregardetalle() {

    if (this.documento.documento_id == '') {
      alert("Debe pulsar el boton nueva orden");
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
          this.documento = this.calculosService.calcularExcento(this.documento, this.detallesList);
          this.documentoService.updateDocumento(this.documento).subscribe(res => {
            if (res.code != 200) {
              alert("error actualizando el documento, por favor inicie nuevamente la creación del documento");
              return;
            }
          });
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
        this.documento = this.calculosService.calcularExcento(this.documento, this.detallesList);
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
    } else {
      this.articuloC.nativeElement.value = "";

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
      alert("Debe pulsar el boton nueva orden");
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
      if (this.documento.empleado_id != null) {
        let empleado = this.empleados.find(empleado => empleado.empleado_id == this.documento.empleado_id);
        if (empleado != undefined) {
          this.factura.nombreEmpleado = empleado.apellido + " " + empleado.nombre;
        } else {
          this.factura.nombreEmpleado = "";
        }
      }
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
      this.asignarTipoPago();
    }
    this.asignarConsecutivo(numImpresiones, tipoImpresion);
    $('#imprimirModalFactura').modal('hide');
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
      case 12:
        this.tituloFactura = "NOTA CRÉDITO";
        break;
      case 13:
        this.tituloFactura = "NOTA DÉBITO";
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
      let con: number;
      let consecutivo: string;
      let resolucion: ResolucionEmpresaModel = new ResolucionEmpresaModel();
      if (this.resolucionEmpresa.nativeElement.value != "") {
        console.log(this.resolucionEmpresa.nativeElement.value);
        resolucion = this.resolucionAll.find(reso => reso.nombre.trim() == this.resolucionEmpresa.nativeElement.value.toString().trim());
        console.log(resolucion.nombre);
      } else {
        resolucion = this.resolucionAll[0];
      }
      if (this.documentoFactura.tipo_documento_id == this.TIPO_DOCUMENTO_FACTURA && resolucion.tipo_resolucion_id == 3) { //se alistan documentos para la dian cuando son facturas
        let documentoInvoice: DocumentoInvoiceModel = new DocumentoInvoiceModel()
        documentoInvoice.documento_id = Number(this.documentoFactura.documento_id);
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
        this.documentoFactura.invoice_id = this.INVOICE_SIN_ENVIAR;
      }
      console.log(resolucion);
      this.factura.resolucionEmpresa = resolucion;
      switch (this.documentoFactura.tipo_documento_id) {
        case 9:
          con = resolucion.consecutivo;
          consecutivo = resolucion.letra_consecutivo + con;
          this.documentoFactura.consecutivo_dian = consecutivo;
          console.log("consecutivo documentoId: " + consecutivo);
          this.tituloFactura = "FACTURA DE VENTA.";
          break;
        case 4:
          this.documentoFactura.impreso = 0;
          this.documentoFactura.consecutivo_dian = this.documentoFactura.documento_id// es necesario asignar el
          // consecutivo dian
          console.log("consecutivo Cotizacion: " + this.documentoFactura.consecutivo_dian);
          this.tituloFactura = "No. DE COTIZACIÓN";
          this.documentoService.updateDocumento(this.documentoFactura).subscribe(res => {
            if (res.code != 200) {
              alert("error creando documento, por favor inicie nuevamente la creación del documento");
              return;
            }
            this.imprimirFactura(numImpresiones,this.empresa, tipoImpresion);
            this.limpiarFactura();

          });
          break;
        case 12:

          this.documentoFactura.consecutivo_dian = this.documentoFactura.documento_id// es necesario asignar el
          // consecutivo dian
          console.log("consecutivo Cotizacion: " + this.documentoFactura.consecutivo_dian);
          this.tituloFactura = "NOTA CRÉDITO";
          this.documentoService.updateDocumento(this.documentoFactura).subscribe(res => {
            if (res.code != 200) {
              alert("error creando documento, por favor inicie nuevamente la creación del documento");
              return;
            }
            this.imprimirFactura(numImpresiones,this.empresa, tipoImpresion);
            this.limpiarFactura();

          });
          break;
        case 13:

          this.documentoFactura.consecutivo_dian = this.documentoFactura.documento_id// es necesario asignar el
          // consecutivo dian
          console.log("consecutivo Cotizacion: " + this.documentoFactura.consecutivo_dian);
          this.tituloFactura = "NOTA DÉBITO";
          this.documentoService.updateDocumento(this.documentoFactura).subscribe(res => {
            if (res.code != 200) {
              alert("error creando documento, por favor inicie nuevamente la creación del documento");
              return;
            }
            this.imprimirFactura(numImpresiones, this.empresa, tipoImpresion);
            this.limpiarFactura();

          });
          break;
        default:
          // log
          console.log(resolucion.consecutivo);
          con = Number(resolucion.consecutivo) + 1;
          // dentro de try se valida si faltan 500 facturas para
          // llegar hasta el tope
          this.documentoFactura.impreso = 1;
          let topeConsecutivo = resolucion.autorizacion_hasta;
          let consegutivo = con;
          if (consegutivo + 200 > topeConsecutivo) {
            alert(" se esta agotando el consegutivo DIAN");
          }
          if (consegutivo > topeConsecutivo) {
            alert("Se agotó el consecutivo DIAN");
            return;
          }
          consecutivo = ""+ con;
          this.documentoFactura.letra_consecutivo = resolucion.letra_consecutivo;
          console.log("consecutivo Dian: " + consecutivo);
          this.documentoFactura.consecutivo_dian = consecutivo;
          this.tituloFactura = "FACTURA DE VENTA";
          resolucion.consecutivo = con;
          this.empresaService.updateConsecutivoEmpresa(resolucion).subscribe(emp => {
            console.log("consecutivo actualizado");
            this.documentoService.updateDocumento(this.documentoFactura).subscribe(res => {
              if (res.code != 200) {
                alert("error creando documento, por favor inicie nuevamente la creación del documento");
                return;
              }
              this.imprimirFactura(numImpresiones, this.empresa, tipoImpresion);
              this.limpiarFactura();
            });
          });     
          break;
      }
 
  }


  detalleDocumento(documento: DocumentoModel) {
    this.documentoSelect = documento;
    this.documentoService.getOrdenesByDocumentoId(documento.documento_id).subscribe(res => {
      this.ordenesBuscarListFacturaSelect = res;
      let ids: string[] = [];
      for (let d of this.ordenesBuscarListFacturaSelect) {
        ids.unshift(d.documento_id);
      }
      if (ids.length > 0) {
        this.documentoDetalleService.getDocumentoDetalleByDocumentoList(ids).subscribe(res => {
          this.itemsFactura2 = res;
          console.log("detalles encontrados:" + res.length);
        });
      } else {
        this.itemsFactura2 = [];
      }

    });
  }

  borrarItem(borrar) {
    let id = borrar.id.toString().replace("d_", "");
    for (let i = 0; i < this.itemsFactura2.length; i++) {
      if (this.itemsFactura2[i].documento_detalle_id.toString() == id) {
        this.itemsFactura2.splice(i, 1);
        this.documentoSelect = this.calculosService.calcularExcento(this.documentoSelect, this.itemsFactura2);
        break;
      }
    }
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
    console.log(this.itemsFactura);
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
          this.documento = this.calculosService.calcularExcento(this.documento, this.detallesList);
        });
      } else {
        alert("Error agregando repuesto: " + res.error);
      }
    });
    $('#eliminarModal').modal('hide');
  }

  buscarOrdenes(placa, clien, fechaInicial, fechaFinal,usuario) {
    let idCliente = "";
    let idUsuario = "";
    let tipoDocumentoId = this.TIPO_DOCUMENTO_ORDEN_TRABAJO;
    let ini: string = fechaInicial.value;
    let fin: string = fechaFinal.value;
    console.log(fechaInicial.value);
    if (ini != '' && fin != '') {

      ini = this.calculosService.fechaIniBusqueda(fechaInicial.value);
      fin = this.calculosService.fechaFinBusqueda(fechaFinal.value);

    } else {
      let date: Date = new Date();
      date.setDate(1);
      ini = date.toLocaleString();
      date.setDate(30);
      fin = date.toLocaleString();
    }
    if (clien.value != "") {
      let cliente = this.clientes.find(cliente => (cliente.nombre + ' ' + cliente.apellidos + ' ' + cliente.razon_social + ' - ' + cliente.documento) == clien.value);
      idCliente = cliente.cliente_id.toString();
    }
   
    this.documentoService.getOrdenesTrabajo(this.empresaId.toString(), placa.value, idCliente, ini, fin, tipoDocumentoId,usuario.value).subscribe(res => {
      this.ordenesBuscarList = res;
      this.numOrdenes=res.length;
    });
  }

  buscarOrdenesHoy(placa, clien) {
    let idCliente = "";
    let tipoDocumentoId = this.TIPO_DOCUMENTO_ORDEN_TRABAJO;
    if (clien.value != "") {
      let cliente = this.clientes.find(cliente =>(cliente.nombre + ' ' + cliente.apellidos + ' ' + cliente.razon_social + ' - ' + cliente.documento) == clien.value);
      idCliente = cliente.cliente_id.toString();
    }
    this.documentoService.getOrdenesTrabajo(this.empresaId.toString(), placa.value, idCliente, this.calculosService.fechaInicial(this.calculosService.fechaActual()).toLocaleString(), this.calculosService.fechaFinal(this.calculosService.fechaActual()).toLocaleString(), tipoDocumentoId,"").subscribe(res => {
      this.ordenesBuscarList = res;
    });
  }

  buscarFacturas(placa, clien, fechaInicial, fechaFinal, tipoDocu) {
    let idCliente = "";
    let tipoDocumentoId = tipoDocu.value; // se buscan facturas
    if (clien.value != "") {
      let cliente = this.clientes.find(cliente => (cliente.nombre + ' ' + cliente.apellidos + ' ' + cliente.razon_social + ' - ' + cliente.documento) == clien.value);
      idCliente = cliente.cliente_id.toString();
    }
    this.documentoService.getOrdenesTrabajo(this.empresaId.toString(), placa.value, idCliente, fechaInicial.value, fechaFinal.value, tipoDocumentoId,"").subscribe(res => {
      this.facturasBuscarList = res;
    });
  }


  buscarOrdenesFactura(placa, clien, fechaInicial, fechaFinal) {
    let idCliente = "";
    let tipoDocumentoId = this.TIPO_DOCUMENTO_ORDEN_TRABAJO;// se buscan ordenes de trabajo
    if (clien.value != "") {
      let cliente = this.clientes.find(cliente => (cliente.nombre + ' ' + cliente.apellidos + ' ' + cliente.razon_social + ' - ' + cliente.documento)== clien.value);
      idCliente = cliente.cliente_id.toString();
    }

    this.documentoService.getOrdenesTrabajo(this.empresaId.toString(), placa.value, idCliente, fechaInicial.value, fechaFinal.value, tipoDocumentoId,"").subscribe(res => {
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
    } else {
      this.articuloC.nativeElement.value = "";
    }
    this.indexSelect = 0;
    this.valorTotal = 0;
    this.articuloPV = "";
    this.vehiculo = new VehiculoModel();
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

  duplicarOrden(or: DocumentoModel) {
    this.nuevaOrden();
    this.duplicarValores(or);
    $('#buscarModal').modal('hide');
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
          if (this.documentoFactura.tipo_documento_id != this.TIPO_DOCUMENTO_COTIZACION) {
            alert("La orden Seleccionada ya se encuentra asociada a la factura número: " + res[0].documento_id);
            event.target.checked = false;
            return;
          } else {
            this.ordenesBuscarListFacturaSelect.unshift(or);
          }
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
      return cliente.nombre+" "+cliente.apellidos+" "+(cliente.razon_social==null?'':cliente.razon_social);
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

  duplicarValores(documento_id: DocumentoModel) {
    console.log("nueva orden");
    this.limpiar();
    this.documento.tipo_documento_id = this.TIPO_DOCUMENTO_ORDEN_TRABAJO;// SE AGREGA tipo documento =11 orden de trabajo
    this.documento.fecha_registro = this.calculosService.fechaActual();
    this.documento.fecha_entrega = null;
    this.documento.usuario_id = this.usuarioId;
    this.documento.empresa_id = this.empresaId;
    this.clientePV.nativeElement.focus();
    this.documentoService.saveDocumento(this.documento).subscribe(resD => {
      if (resD.code == 200) {
        this.documento.documento_id = resD.documento_id;
        this.documento.detalle_entrada = documento_id.detalle_entrada;
        this.placa.nativeElement.value = documento_id.detalle_entrada;
        this.documento.cliente_id = documento_id.cliente_id;
        this.documento.empresa_id = documento_id.empresa_id;
        this.documento.empleado_id = documento_id.empleado_id;
        this.documento.mac = documento_id.mac;
        this.documento.linea_vehiculo = documento_id.linea_vehiculo;
        let cliente = this.clientes.find(cliente => cliente.cliente_id == documento_id.cliente_id);
        let nombre = "";
        if (cliente != undefined) {
          nombre = (cliente.nombre + ' ' + cliente.apellidos + ' ' + cliente.razon_social + ' - ' + cliente.documento);
        }
        let empleado = this.empleados.find(empleado => empleado.empleado_id == documento_id.empleado_id);
        let nombreEmpleado = "";
        if (empleado != undefined) {
          nombreEmpleado = empleado.nombre;
        }

        let parametros: ParametrosModel = new ParametrosModel;
        if (parametros.ambiente == 'cloud') {
          this.downloadURL = (documento_id.mac == '' ? null : this.afStorage.ref(documento_id.mac).getDownloadURL());
        } else {
          if (documento_id.mac != '') {
            this.usuarioService.getFile(documento_id.mac == '' ? null : documento_id.mac).subscribe(res => {

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

        if (documento_id.linea_vehiculo != "") {
          this.linea.nativeElement.value = this.documento.linea_vehiculo;
        } else {
          this.linea.nativeElement.value = "Seleccione Linea";
        }
        this.clientePV.nativeElement.value = nombre;
        if (this.empleadoOrdenActivo) {
          this.empleadoPV.nativeElement.value = nombreEmpleado;
        }
        this.documento.descripcion_cliente = documento_id.descripcion_cliente;
        this.documento.descripcion_trabajador = documento_id.descripcion_trabajador;
        this.documento.modelo_marca_id = documento_id.modelo_marca_id;
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
        this.documentoDetalleService.getDocumentoDetalleByDocumento(documento_id.documento_id).subscribe(res => {
          let lista: Array<DocumentoDetalleModel> = [];
          for (let deta of res) {
            let docuDeta: DocumentoDetalleModel = new DocumentoDetalleModel();
            docuDeta = deta;
            docuDeta.documento_detalle_id = null;
            docuDeta.documento_id = this.documento.documento_id;
            this.documentoDetalleService.saveDocumentoDetalle(docuDeta).subscribe(res => {
              if (res.code != 200) {
                alert("Error agregando producto: " + res.error);
              } else {
                lista.push(docuDeta);
                this.detallesList = lista;
                this.calcularTOtal();
              }
            });
          }
          console.log("detalles encontrados:" + res.length);
        });
        console.log(this.documento);
        this.documentoService.updateDocumento(this.documento).subscribe(res => {
          if (res.code != 200) {
            alert("error actualizando el documento, por favor inicie nuevamente la creación del documento");
            return;
          }
        });
      } else {
        alert("error creando documento, por favor inicie nuevamente la creación del documento, si persiste consulte a su proveedor");
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
        nombre = (cliente.nombre + ' ' + cliente.apellidos + ' ' + cliente.razon_social + ' - ' + cliente.documento);
        this.numeroCliente = cliente.celular + (cliente.fijo != "" ? "-" + cliente.fijo : "");
      }
      let empleado = this.empleados.find(empleado => empleado.empleado_id == this.documento.empleado_id);
      let nombreEmpleado = "";
      if (empleado != undefined) {
        nombreEmpleado = empleado.apellido + ' ' + empleado.nombre;
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
      this.vehiculo = this.vehiculosEmpresa.find(product => product.placa === this.documento.detalle_entrada.toUpperCase().trim());
      if (this.vehiculo == undefined) {
        this.vehiculo = new VehiculoModel();
      }
    }
  }

  enterTecla(element) {
    if (element.id == "bonos") {
      this.abonoModal.nativeElement.click();
    }
  }

  asignarValoresFactura(documento_id: string) {
    if (documento_id != '') {

      let cliente = this.clientes.find(cliente => cliente.cliente_id == this.documentoFactura.cliente_id);
      let nombre = "";
      if (cliente != undefined) {
        nombre = (cliente.nombre + ' ' + cliente.apellidos + ' ' + cliente.razon_social + ' - ' + cliente.documento);
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
    let empleado = this.empleados.find(empleado => empleado.apellido + ' ' + empleado.nombre == element.value);
    if (empleado == undefined) {
      alert("El Empleado no existe");
      return;
    } else {
      console.log(empleado);
      this.documento.empleado_id = empleado.empleado_id;
      if (this.documento.documento_id == "") {
        alert("Debe pulsar el boton nueva orden");
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
        if (this.activaciones[e].activacion_id == this.ACTIVAR_FACTURACION_ORDEN) {
          console.log("facturacion en orden activo");
          this.facturaOrdenActivo = true;
        }
        if (this.activaciones[e].activacion_id == this.ACTIVAR_REABRIR_ORDEN) {
          console.log("reabir orden activo");
          this.reabirOrdenActivo = true;
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
    this.usuarioService.getEmpleadoByUsuario(this.usuarioId.toString()).subscribe(res => {
      this.empleados = res;
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

  formatearNumber(number: number) {
    let formato: string = "";
    formato = new Intl.NumberFormat().format(number);
    return formato;
  }

  vehiculos() {
    this.clienteService.getVehiculos().subscribe(res => {
      this.vehiculosEmpresa = res;
      console.log("vehiculos:" + res.length);
    });
  }

  public opcionesSubmenu() {
    let usuario_id = localStorage.getItem('usuario_id');
    this.usuarioService.opcionPuntoVentaByUsuario(usuario_id).subscribe((res) => {
      this.opciones = res;
      console.log(this.opciones);
    });
  }

  getEmpresa() {
    this.empresaService.getEmpresaById(this.empresaId.toString()).subscribe(res => {
      this.empresa = res[0];
    });
  }


}
