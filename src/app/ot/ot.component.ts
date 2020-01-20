import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';
import { ClienteModel } from '../model/cliente.model';
import { ClienteService } from '../services/cliente.service';
import { DocumentoModel } from '../model/documento.model';
import { DocumentoService } from '../services/documento.service';
import { DocumentoDetalleService } from '../services/documento-detalle.service';
import { CalculosService } from '../services/calculos.service';

@Component({
  selector: 'app-ot',
  templateUrl: './ot.component.html',
  styleUrls: ['./ot.component.css']
})
export class OtComponent implements OnInit {
  public nombreUsuario: string;
  public clientes: Array<ClienteModel>;
  public empresaId: number;
  public documento: DocumentoModel =new DocumentoModel();
  public ordenesList: Array<DocumentoModel>;
  public usuarioId: number;
  @ViewChild("clientePV") clientePV: ElementRef;
  @ViewChild("placa") placa: ElementRef;
  @ViewChild("descripcionCliente") descripcionCliente: ElementRef;
  @ViewChild("observacion") observacion: ElementRef;
  
  

  constructor(public clienteService: ClienteService,public documentoService: DocumentoService,
    public documentoDetalleService: DocumentoDetalleService, public calculosService: CalculosService) { }

  ngOnInit() {
    this.empresaId = Number(sessionStorage.getItem("empresa_id"));
    this.nombreUsuario = sessionStorage.getItem('nombreUsuario');
    this.getclientes(this.empresaId);
    this.usuarioId = Number(sessionStorage.getItem("usuario_id"));
  }

  getclientes(empresaId: number) {
    this.clienteService.getClientesByEmpresa(empresaId.toString()).subscribe(res => {
      this.clientes = res;
      console.log("lista de clientes cargados: "+this.clientes.length);
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
    if (cliente==undefined) {
      alert("El cliente no existe");
      return;
    } else {  
      console.log(cliente);
      this.documento.cliente_id = cliente.cliente_id;  
      if(this.documento.documento_id==""){
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
  
  nuevaOrden(){
    console.log("nueva orden");
    this.limpiar();
    this.documento.tipo_documento_id  = 11;// SE AGREGA tipo documento =11 orden de trabajo
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

  limpiar(){
    this.documento = new DocumentoModel();
    
    this.placa.nativeElement.value = "";
    this.clientePV.nativeElement.value = "";
    this.descripcionCliente.nativeElement.value = "";
    this.observacion.nativeElement.value = "";
  }
  agregarObservacion(element){
    if(this.documento.documento_id==""){
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

  agregarDescripcionCliente(element){
    if(this.documento.documento_id==""){
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

  agregarPlaca(element){
    if(this.documento.documento_id==""){
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

}
