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
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-ot',
  templateUrl: './ot.component.html',
  styleUrls: ['./ot.component.css']
})
export class OtComponent implements OnInit {
  public ref: AngularFireStorageReference;
  public task: AngularFireUploadTask;
  public downloadURL: Observable<string>;

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
  @ViewChild("clientePV") clientePV: ElementRef;
  @ViewChild("placa") placa: ElementRef;
  @ViewChild("descripcionCliente") descripcionCliente: ElementRef;
  @ViewChild("observacion") observacion: ElementRef;
  @ViewChild("observacion") item: ElementRef;


  constructor(public usuarioService: UsuarioService, public clienteService: ClienteService, public documentoService: DocumentoService,
    public documentoDetalleService: DocumentoDetalleService, public calculosService: CalculosService, public afStorage: AngularFireStorage
  ) { }

  ngOnInit() {
    this.empresaId = Number(sessionStorage.getItem("empresa_id"));
    this.getclientes(this.empresaId);
    this.buscarUsuarios();
    this.usuarioId = Number(sessionStorage.getItem("usuario_id"));
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
     let empresaId: string = sessionStorage.getItem('empresa_id');
     this.usuarioService.getByUsuario(this.usuarioBuscar, empresaId, this.rolSelectBuscar).subscribe(res => {    
       this.usuarioList = res;
     });
   }
 */

  clienteSelectFun(element) {
    console.log(this.clientes);
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

  nuevaOrden() {
    console.log("nueva orden");
    this.limpiar();
    this.documento.tipo_documento_id = 11;// SE AGREGA tipo documento =11 orden de trabajo
    this.documento.fecha_registro = this.calculosService.fechaActual();
    this.documento.fecha_entrega = null;
    this.documento.usuario_id = this.usuarioId;
    this.documento.empresa_id = this.empresaId;
    this.documento.invoice = null;
    this.documentoService.saveDocumento(this.documento).subscribe(res => {
      if (res.code == 200) {
        this.documento.documento_id = res.documento_id;
      } else {
        alert("error creando documento, por favor inicie nuevamente la creación del documento, si persiste consulte a su proveedor");
        return;
      }
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
    this.documentoService.updateDocumento(this.documento).subscribe(res => {
      if (res.code != 200) {
        alert("error actualizando el documento, por favor inicie nuevamente la creación del documento");
        return;
      }
    });
  }

  agregardetalle(element, cantidad) {
    var value = element.value;

    if (value == '') {
      alert("El nombre del repuesto es obligatorio");
      return;
    }
    if (cantidad.value == '') {
      alert("La cantidad del repuesto es obligatorio");
      return;
    }
    if (this.documento.documento_id == '') {
      alert("Debe pulsar el boton nuevo documento");
      return;
    }
    if (this.detalleSelect.documento_detalle_id == null) {
      let docDetalle: DocumentoDetalleModel = new DocumentoDetalleModel();
      docDetalle.descripcion = value;
      docDetalle.estado = 1;
      docDetalle.cantidad = cantidad.value;
      docDetalle.documento_id = this.documento.documento_id;
      this.documentoDetalleService.saveDocumentoDetalle(docDetalle).subscribe(res => {
        if (res.code == 200) {
          docDetalle.documento_detalle_id = res.documento_detalle_id;
          this.detallesList.unshift(docDetalle);
        } else {
          alert("Error agregando repuesto: " + res.error);
        }
      });
    } else {
      this.detalleSelect.descripcion = value;
      this.detalleSelect.cantidad = cantidad.value;
      this.documentoDetalleService.updateDocumentoDetalle(this.detalleSelect).subscribe(res => {
        if (res.code == 200) {
          //this.documentoService.

        } else {
          alert("Error agregando repuesto: " + res.error);
        }
      });
      this.detalleSelect = new DocumentoDetalleModel();
    }

    element.value = "";
    cantidad.value = "";
    this.detalleSelect = new DocumentoDetalleModel();
    $('#exampleModal').modal('hide');
  }

  editarItem(articulo, camtidad, item) {
    camtidad.value = articulo.cantidad;
    item.value = articulo.descripcion;
    this.detalleSelect = articulo;
    $('#exampleModal').modal('show');
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

  asignarValores(documento_id: string) {
    if (documento_id != '') {
      this.placa.nativeElement.value = this.documento.detalle_entrada;
      let cliente = this.clientes.find(cliente => cliente.cliente_id == this.documento.cliente_id);
      let nombre = "";
      if (cliente != undefined) {
        nombre = cliente.nombre;
      }
      let parametros: ParametrosModel = new ParametrosModel;
      if ( parametros.ambiente == 'cloud' ) {
        this.downloadURL = (this.documento.mac == ''? null: this.afStorage.ref(this.documento.mac).getDownloadURL());     
      } else {
       // console.log("local");
       // var reader = new FileReader();
       // reader.readAsDataURL(event.target.files[0]);
       // reader.onload = (_event) => {
       //   $('#blah').attr('src', reader.result);
       // }
      }
      console.log(cliente);
      this.clientePV.nativeElement.value = nombre;
      this.descripcionCliente.nativeElement.value = this.documento.descripcion_cliente;
      this.observacion.nativeElement.value = this.documento.descripcion_trabajador;
      this.documentoDetalleService.getDocumentoDetalleByDocumento(documento_id).subscribe(res => {
        this.detallesList = res;
        console.log("detalles encontrados:" + res.length);
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
  nombreCliente(id) {

    let cliente = this.clientes.find(cliente => cliente.cliente_id == id);
    if (cliente == undefined) {
      return "";
    } else {
      return cliente.nombre;
    }
  }
  buscarUsuarios() {
    let empresaId: string = sessionStorage.getItem('empresa_id');
    this.usuarioService.getByUsuario(null, empresaId, null).subscribe(res => {
      this.usuarioList = res;
    });
  }
  nombreUsuarioFiltro(id) {
    let usuario = this.usuarioList.find(usuario => usuario.usuario_id == id);
    return usuario == undefined ? "" : usuario.nombre;
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
      this.task = this.ref.put(event.target.files[0]);
      this.documento.mac = id;
      this.documentoService.updateDocumento(this.documento).subscribe(res => {
        if (res.code != 200) {
          alert("error actualizando el documento, por favor inicie nuevamente la creación del documento");
          return;
        }
      });
      this.downloadURL = this.ref.getDownloadURL();
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
