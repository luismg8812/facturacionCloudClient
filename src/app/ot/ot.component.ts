import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ClienteModel } from '../model/cliente.model';
import { ClienteService } from '../services/cliente.service';
import { DocumentoModel } from '../model/documento.model';
import { DocumentoService } from '../services/documento.service';
import { DocumentoDetalleService } from '../services/documento-detalle.service';
import { CalculosService } from '../services/calculos.service';
import { DocumentoDetalleModel } from '../model/documentoDetalle.model';
import { UsuarioService } from '../services/usuario.service';
import { UsuarioModel } from '../model/usuario.model';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { ParametrosModel } from '../model/parametros.model';
import { Observable } from 'rxjs';
import { ActivacionModel } from '../model/activacion';
import { ProductoModel } from '../model/producto.model';
import { ProductoService } from '../services/producto.service';
import { MarcasService } from '../services/marcas.service';
import { MarcaVehiculoModel } from '../model/marcaVehiculo.model';
import { ModeloMarcaModel } from '../model/modeloMarca.model';
import { ImpresoraEmpresaModel } from '../model/impresoraEmpresa.model';
import { FacturaModel } from '../vo/factura.model';
import { EmpresaService } from '../services/empresa.service';
import { ImpresionService } from '../services/impresion.service';
import { EmpleadoModel } from '../model/empleado.model';
import { EmpleadoService } from '../services/empleado.service';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-ot',
  templateUrl: './ot.component.html',
  styleUrls: ['./ot.component.css']
})
export class OtComponent implements OnInit {

  readonly PRODUCTOS_FIJOS: string = '21';
  readonly ACTIVAR_EMPLEADOS_ORDEN: string = '18';
  readonly TIPO_IMPRESION_TXT80MM: number = 1;
  readonly TIPO_IMPRESION_TXT50MM: number = 2;
  readonly TIPO_IMPRESION_PDF50MM: number = 5;

  public ref: AngularFireStorageReference;
  public task: AngularFireUploadTask;
  public downloadURL: Observable<string>;
  public downloadURLLocal: any;
  public downloadURL2: Observable<string>;

  public clientes: Array<ClienteModel>;
  public empresaId: number;
  public documento: DocumentoModel = new DocumentoModel();
  public ordenesList: Array<DocumentoModel> = [];
  public ordenesBuscarList: Array<DocumentoModel> = [];
  public usuarioId: number;
  public detallesList: Array<DocumentoDetalleModel> = [];
  public detalleSelect: DocumentoDetalleModel = new DocumentoDetalleModel();
  public indexSelect: number = 0;
  public usuarioList: Array<UsuarioModel> = [];
  public marcaList: Array<MarcaVehiculoModel> = [];
  public modeloList: Array<ModeloMarcaModel> = [];
  public productoFijoActivo: boolean = false;
  public empleadoOrdenActivo: boolean = false;
  public activaciones: Array<ActivacionModel> = [];
  public productosAll: Array<ProductoModel>;
  public productoIdSelect: ProductoModel = null;
  public impresoraEmpresa: Array<ImpresoraEmpresaModel>;
  public articuloPV: string = "";
  public factura: FacturaModel;
  public empleados: Array<EmpleadoModel>;


  @ViewChild("clientePV") clientePV: ElementRef;
  @ViewChild("empleadoPV") empleadoPV: ElementRef;

  @ViewChild("placa") placa: ElementRef;
  @ViewChild("descripcionCliente") descripcionCliente: ElementRef;
  @ViewChild("observacion") observacion: ElementRef;
  @ViewChild("item") item: ElementRef;
  @ViewChild("cantidad") cantidad: ElementRef;
  @ViewChild("articuloC") articuloC: ElementRef;

  @ViewChild("modelo") modelo: ElementRef;
  @ViewChild("marca") marca: ElementRef;
  @ViewChild("linea") linea: ElementRef;
  @ViewChild("downloadZipLink") downloadZipLink: ElementRef;

  constructor(public usuarioService: UsuarioService,
    public clienteService: ClienteService,
    public documentoService: DocumentoService,
    public empresaService: EmpresaService,
    public marcasService: MarcasService,
    public productoService: ProductoService,
    public documentoDetalleService: DocumentoDetalleService,
    public calculosService: CalculosService,
    public afStorage: AngularFireStorage,
    public impresionService: ImpresionService,
    public empleadoService: EmpleadoService
  ) { }

  ngOnInit() {
    this.empresaId = Number(localStorage.getItem("empresa_id"));
    this.getclientes(this.empresaId);
    this.buscarUsuarios();
    this.usuarioId = Number(localStorage.getItem("usuario_id"));
    this.getActivaciones(this.usuarioId);
    this.getProductosByEmpresa(this.empresaId);
    this.marcas();
    this.getImpresorasEmpresa(this.empresaId);
    this.getEmpleados();
    this.factura = new FacturaModel();
  }



  getActivaciones(user: number) {
    this.usuarioService.getActivacionByUsuario(user.toString()).subscribe(res => {
      this.activaciones = res;
      for (var e = 0; e < this.activaciones.length; e++) {
        if (this.activaciones[e].activacion_id == this.PRODUCTOS_FIJOS) {
          console.log("productos fijos activo");
          this.productoFijoActivo = true;
        }
        if (this.activaciones[e].activacion_id == this.ACTIVAR_EMPLEADOS_ORDEN) {
          console.log("empleados en orden activo");
          this.empleadoOrdenActivo = true;
        }

      }
    });
  }

  getProductosByEmpresa(empresaId: number) {
    this.productoService.getProductosByEmpresa(empresaId.toString()).subscribe(res => {
      this.productosAll = res;
    });
  }

  articuloSelect(element) {
    console.log("articulo select:" + element.value);
    let productoNombre: string = element.value;
    this.productoIdSelect = this.productosAll.find(product => product.nombre === productoNombre);
    console.log(this.productoIdSelect);
  }

  nombreUsuario() {
    return this.nombreUsuarioFiltro(this.documento.usuario_id);
  }

  getclientes(empresaId: number) {
    this.clienteService.getClientesByEmpresa(empresaId.toString()).subscribe(res => {
      this.clientes = res;
      console.log("lista de clientes cargados: " + this.clientes.length);
    });
  }

  /* getDetalles() {
     let empresaId: string = localStorage.getItem('empresa_id');
     this.usuarioService.getByUsuario(this.usuarioBuscar, empresaId, this.rolSelectBuscar).subscribe(res => {    
       this.usuarioList = res;
     });
   }
 */

  clienteSelectFun(element) {
    //console.log(this.clientes);
    let cliente = this.clientes.find(cliente => cliente.nombre == element.value);
    if (cliente == undefined) {
      alert("El cliente no existe");
      return;
    } else {
      console.log(cliente);
      this.documento.cliente_id = cliente.cliente_id;
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

  nuevaOrden() {
    console.log("nueva orden");
    this.limpiar();
    this.documento.tipo_documento_id = 11;// SE AGREGA tipo documento =11 orden de trabajo
    this.documento.fecha_registro = this.calculosService.fechaActual();
    this.documento.fecha_entrega = null;
    this.documento.usuario_id = this.usuarioId;
    this.documento.empresa_id = this.empresaId;
    this.placa.nativeElement.focus();
    this.documentoService.saveDocumento(this.documento).subscribe(res => {
      if (res.code == 200) {
        this.documento.documento_id = res.documento_id;
      } else {
        alert("error creando documento, por favor inicie nuevamente la creación del documento, si persiste consulte a su proveedor");
        return;
      }
    });

  }

  imprimirOrden(impresora) {
    let parametros: ParametrosModel = new ParametrosModel;
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
      if (parametros.ambiente != 'cloud') {
        this.factura.empresa.url_logo = "assets/images/logoempresa.jpg";
      }
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
          alert("no tiene un tipo impresion");
          //Impresion.imprimirPDF(getDocumento(), getProductos(), usuario(), configuracion, impresora,
          //    enPantalla, e);
          break;
      }
      $('#imprimirModal').modal('hide');
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

  limpiar() {
    this.documento = new DocumentoModel();
    this.detallesList = [];
    this.placa.nativeElement.value = "";
    this.clientePV.nativeElement.value = "";
    this.empleadoPV.nativeElement.value = "";
    this.descripcionCliente.nativeElement.value = "";
    this.observacion.nativeElement.value = "";
    if (!this.productoFijoActivo) {
      this.item.nativeElement.value = "";
    }
    this.articuloPV = "";
    this.indexSelect = 0;
    $('#blah').attr('src', '');
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

  agregardetalle() {
    //console.log(this.item.nativeElement.value);

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
    if (this.documento.documento_id == '') {
      alert("Debe pulsar el boton nuevo documento");
      return;
    }
    if (this.cantidad.nativeElement.value > 1500) {
      alert("La cantidad no puede ser mayor a 1500");
      return;
    }
    if (this.detalleSelect.documento_detalle_id == null) {
      let docDetalle: DocumentoDetalleModel = new DocumentoDetalleModel();
      docDetalle.descripcion = (this.productoFijoActivo ? this.productoIdSelect.nombre : this.item.nativeElement.value);
      docDetalle.estado = 1;
      docDetalle.cantidad = this.cantidad.nativeElement.value;
      docDetalle.documento_id = this.documento.documento_id;
      if (this.productoFijoActivo) {
        docDetalle.impuesto_producto = Number(this.productoIdSelect.impuesto);
        docDetalle.producto_id = this.productoIdSelect.producto_id;
        docDetalle.parcial = docDetalle.cantidad * this.productoIdSelect.costo_publico;
        docDetalle.unitario = this.productoIdSelect.costo_publico;
      }
      if ($('#fotoRepuesto')[0].files[0] != undefined) {
        docDetalle.url_foto = this.cargarFotoRepuesto(docDetalle);
      }
      this.documentoDetalleService.saveDocumentoDetalle(docDetalle).subscribe(res => {
        if (res.code == 200) {
          docDetalle.documento_detalle_id = res.documento_detalle_id;
          this.detallesList.unshift(docDetalle);
          this.documento = this.calculosService.calcularExcento(this.documento, this.detallesList);
          console.log(this.detallesList);
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
      if (this.productoFijoActivo) {
        this.detalleSelect.producto_id = this.productoIdSelect.producto_id;
        this.detalleSelect.parcial = this.detalleSelect.cantidad * this.productoIdSelect.costo_publico;
        this.detalleSelect.unitario = this.productoIdSelect.costo_publico;
        this.detalleSelect.impuesto_producto = Number(this.productoIdSelect.impuesto);
      }
      if ($('#fotoRepuesto')[0].files[0] != undefined) {
        this.detalleSelect.url_foto = this.cargarFotoRepuesto(this.detalleSelect);
      }
      this.documentoDetalleService.updateDocumentoDetalle(this.detalleSelect).subscribe(res => {
        if (res.code == 200) {
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

        } else {
          alert("Error agregando repuesto: " + res.error);
        }
      });
      this.detalleSelect = new DocumentoDetalleModel();
    }

    this.productoIdSelect = null;
    if (!this.productoFijoActivo) {
      this.item.nativeElement.value = "";
    } else {
      this.articuloC.nativeElement.value = "";
    }
    this.articuloPV = "";

    this.cantidad.nativeElement.value = 1;
    this.cantidad.nativeElement.value = 1;
    this.downloadURL2 = null;
    this.detalleSelect = new DocumentoDetalleModel();
    $('#exampleModal').modal('hide');
  }

  marcaSelect(marca) {
    console.log(marca.value);
    let marcaId = this.marcaList.find(ma => ma.nombre == marca.value);
    this.marcasService.getModeloByMarca(marcaId.marca_vehiculo_id).subscribe(res => {
      this.modeloList = res;
      console.log(res);
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

  editarItem(articulo) {
    this.cantidad.nativeElement.value = articulo.cantidad;
    if (this.productoFijoActivo) {
      let productoNombre: string = articulo.descripcion;
      this.productoIdSelect = this.productosAll.find(product => product.nombre === productoNombre);
      this.articuloPV = articulo.descripcion;
    } else {
      this.item.nativeElement.value = articulo.descripcion;
    }

    this.detalleSelect = articulo;
    $('#exampleModal').modal('show');
  }

  teclaAnteriorSiguiente(apcion: string) {
    if (this.ordenesList.length == 0) {
      let tipoDocumentoId: Array<number> = [11];
      this.documentoService.getDocumentoByTipo(tipoDocumentoId, this.empresaId.toString(), this.usuarioId.toString(), '', '').subscribe(res => {
        this.ordenesList = res;
        console.log("lista de docuemntos cargados: " + this.ordenesList.length);
        if (this.ordenesList.length == 0) {
          alert("No existen documentos");
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
        this.downloadURL = (this.documento.mac == '' ? null : this.afStorage.ref(this.documento.mac).child('').getDownloadURL());
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
      this.empleadoPV.nativeElement.value = nombreEmpleado;
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
        console.log("detalles encontrados:" + res.length);
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
    }
  }

  eliminarItem(articulo) {

    this.detalleSelect = articulo;

  }

  isBigEnough(element, index, array) {

    return (element != this.detalleSelect);
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



  buscarOrdenesHoy(placa, clien) {
    let idCliente = "";
    let tipoDocumentoId = 11;
    if (clien.value != "") {
      let cliente = this.clientes.find(cliente => cliente.nombre == clien.value);
      idCliente = cliente.cliente_id.toString();
    }
    this.documentoService.getOrdenesTrabajo(this.empresaId.toString(), placa.value, idCliente, this.calculosService.fechaInicial(this.calculosService.fechaActual()).toLocaleString(), this.calculosService.fechaFinal(this.calculosService.fechaActual()).toLocaleString(), tipoDocumentoId,"").subscribe(res => {
      this.ordenesBuscarList = res;
    });
  }

  buscarOrdenes(placa, clien, fechaInicial, fechaFinal) {
    let idCliente = "";
    let tipoDocumentoId = 11;
    if (clien.value != "") {
      let cliente = this.clientes.find(cliente => cliente.nombre == clien.value);
      idCliente = cliente.cliente_id.toString();
    }
    this.documentoService.getOrdenesTrabajo(this.empresaId.toString(), placa.value, idCliente, fechaInicial.value, fechaFinal.value, tipoDocumentoId,"").subscribe(res => {
      this.ordenesBuscarList = res;
    });
  }

  nombreCliente(id) {
    let cliente = this.clientes.find(cliente => cliente.cliente_id == id);
    if (cliente == undefined) {
      return "";
    } else {
      return cliente.nombre;
    }
  }

  buscarUsuarios() {
    let empresaId: string = localStorage.getItem('empresa_id');
    this.usuarioService.getByUsuario(null, empresaId, null).subscribe(res => {
      this.usuarioList = res;
    });
  }

  marcas() {
    this.marcasService.getMarcas().subscribe(res => {
      this.marcaList = res;
    });
  }


  nombreUsuarioFiltro(id) {
    let usuario = this.usuarioList.find(usuario => usuario.usuario_id == id);
    return usuario == undefined ? "" : usuario.nombre;
  }

  getEmpleados() {
    this.usuarioService.getEmpleadoByUsuario(this.usuarioId.toString()).subscribe(res => {
      this.empleados = res;
    });
  }





  cargarFotoOrden(event) {
    if (this.documento.documento_id == "") {
      alert("Debe pulsar el boton nuevo documento");
      return;
    }
    let parametros: ParametrosModel = new ParametrosModel;
    if (parametros.ambiente == 'cloud') {
      const id = this.documento.mac == '' ? Math.random().toString(36).substring(2) : this.documento.mac;
      this.ref = this.afStorage.ref(id);
      this.ref.put(event.target.files[0]).then(res => {
        this.downloadURL = this.ref.getDownloadURL();
      });
      this.documento.mac = id;
      this.documentoService.updateDocumento(this.documento).subscribe(res => {
        if (res.code != 200) {
          alert("error actualizando el documento, por favor inicie nuevamente la creación del documento");
          return;
        }
      });

    } else {
      console.log("local");
      this.toBase64(event.target.files[0]).then(data => {
        this.usuarioService.postFile(data, event.target.files[0].name).subscribe(res => {
          if (res.code != 200) {
            alert("error subiendo la imagen, por favor intentelo nuevamente");
            return;
          }
        });
      });
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (_event) => {
        this.downloadURLLocal = reader.result;
      }
      this.documento.mac = event.target.files[0].name;
      this.documentoService.updateDocumento(this.documento).subscribe(res => {
        if (res.code != 200) {
          alert("error actualizando el documento, por favor inicie nuevamente la creación del documento");
          return;
        }
      });
    }
  }

  toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

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

  editarOrden(orden: DocumentoModel) {
    this.documento = orden;
    this.asignarValores(orden.documento_id);
    $('#buscarModal').modal('hide');

  }
}
