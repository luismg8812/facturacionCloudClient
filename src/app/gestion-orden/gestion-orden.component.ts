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

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-gestion-orden',
  templateUrl: './gestion-orden.component.html',
  styleUrls: ['./gestion-orden.component.css']
})
export class GestionOrdenComponent implements OnInit {

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

  @ViewChild("clientePV") clientePV: ElementRef;
  @ViewChild("placa") placa: ElementRef;
  @ViewChild("descripcionCliente") descripcionCliente: ElementRef;
  @ViewChild("observacion") observacion: ElementRef;
  @ViewChild("item") item: ElementRef;

  constructor(public documentoDetalleService: DocumentoDetalleService, public afStorage: AngularFireStorage, public calculosService: CalculosService, public documentoService: DocumentoService, public usuarioService: UsuarioService, public clienteService: ClienteService) { }

  ngOnInit() {
    this.usuarioId = Number(sessionStorage.getItem("usuario_id"));
    this.empresaId = Number(sessionStorage.getItem("empresa_id"));
    this.buscarUsuarios();
    this.getclientes(this.empresaId);

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

  clienteSelectFun(element) {
    console.log(this.clientes);
    let cliente = this.clientes.find(cliente => cliente.nombre == element.value);
    if (cliente == undefined) {
      alert("El cliente no existe modal de crear cliente");
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

  entregar(){
    if (this.documento.documento_id == '') {
      alert("Debe pulsar el boton nuevo documento");
      return;
    }
    this.documento.fecha_entrega=this.calculosService.fechaActual();
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
      this.documentoService.getDocumentoByTipo(tipoDocumentoId, this.empresaId.toString(), this.usuarioId.toString(), '').subscribe(res => {
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

  agregardetalle(nombre, cantidad, compra, venta) {

    if (this.documento.documento_id == '') {
      alert("Debe pulsar el boton nuevo documento");
      return;
    }
    if (nombre.value == '') {
      alert("El nombre del repuesto es obligatorio");
      return;
    }
    if (cantidad.value == '') {
      alert("La cantidad del repuesto es obligatorio");
      return;
    }
    if (compra.value == '') {
      alert("El valor compra del repuesto es obligatorio");
      return;
    }
    if (venta.value == '') {
      alert("El valor venta del repuesto es obligatorio");
      return;
    }

    if (this.detalleSelect.documento_detalle_id == null) {
      let docDetalle: DocumentoDetalleModel = new DocumentoDetalleModel();
      docDetalle.descripcion = nombre.value;
      docDetalle.estado = 1;
      docDetalle.cantidad = cantidad.value;
      docDetalle.unitario = venta.value;
      docDetalle.parcial = docDetalle.cantidad * docDetalle.unitario;
      docDetalle.impresoComanda = compra.value;
      docDetalle.documento_id = this.documento.documento_id;
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
      this.detalleSelect.descripcion = nombre.value;
      this.detalleSelect.cantidad = cantidad.value;
      this.detalleSelect.unitario = venta.value;
      this.detalleSelect.parcial = this.detalleSelect.cantidad * this.detalleSelect.unitario;
      this.detalleSelect.impresoComanda = compra.value;
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
    nombre.value = "";
    cantidad.value = "";
    venta.value = "";
    compra.venta = "";
    this.downloadURL2 = null;
    this.detalleSelect = new DocumentoDetalleModel();

    $('#exampleModal').modal('hide');
  }

  editarItem(articulo, camtidad, nombre, venta, compra) {
    camtidad.value = articulo.cantidad;
    nombre.value = articulo.descripcion;
    venta.value = articulo.unitario;
    compra.value = articulo.impresoComanda;
    this.detalleSelect = articulo;
    this.calcularTOtal() ;
    $('#exampleModal').modal('show');
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

  buscarOrdenes(placa, cliente, fechaInicial, fechaFinal) {
    this.documentoService.getOrdenesTrabajo(this.empresaId.toString(), placa.value, cliente.value, fechaInicial.value, fechaFinal.value).subscribe(res => {
      this.ordenesBuscarList = res;
    });
  }

  limpiar() {
    this.documento = new DocumentoModel();
    this.detallesList = [];
    this.placa.nativeElement.value = "";
    this.clientePV.nativeElement.value = "";
    this.descripcionCliente.nativeElement.value = "";
    this.observacion.nativeElement.value = "";
    this.item.nativeElement.value = "";
    this.indexSelect = 0;
    this.valorTotal = 0;
  }

  nombreCliente(id) {
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
        if(this.documento.mac != ''){
          this.usuarioService.getFile(this.documento.mac == '' ? null : this.documento.mac).subscribe(res => {
            console.log(res);
            const imageBlob = this.dataURItoBlob(res);
            var reader = new FileReader();
            reader.readAsDataURL(imageBlob);
            reader.onload = (_event) => {
              this.downloadURLLocal = reader.result;
            }
          });
        }else{
          this.downloadURLLocal = null;
        }
      }
      console.log(cliente);
      this.clientePV.nativeElement.value = nombre;
      this.descripcionCliente.nativeElement.value = this.documento.descripcion_cliente;
      this.observacion.nativeElement.value = this.documento.descripcion_trabajador;
      this.documentoDetalleService.getDocumentoDetalleByDocumento(documento_id).subscribe(res => {
        this.detallesList = res;
        this.calcularTOtal();
        console.log("detalles encontrados:" + res.length);
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
