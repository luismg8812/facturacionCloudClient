import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../services/cliente.service';
import { ClienteModel } from '../model/cliente.model';
import { TipoIdentificacionModel } from '../model/tipoIdentificacion.model';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {

  public empresaId: number;
  public clientes: Array<ClienteModel>;
  public clienteNew: ClienteModel = new ClienteModel();
  public tipoIdentificacionList: Array<TipoIdentificacionModel> = [];

  constructor(public clienteService:ClienteService) { }

  ngOnInit() {
    this.empresaId = Number(localStorage.getItem("empresa_id"));
    this.getTipoIdentificacion();
  }

  buscar() {
    this.clienteService.getClientesByEmpresa(this.empresaId.toString()).subscribe(res => {
      this.clientes = res;
    });
  }

  limpiar(){
    this.clienteNew = new ClienteModel();
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
    if(this.clienteNew.cliente_id==null){
      this.clienteNew.empresa_id = this.empresaId;
      this.clienteService.saveCliente(this.clienteNew).subscribe(res => {
        if (res.code == 200) {
          this.clienteNew = new ClienteModel();
          $('#crearClienteModal').modal('hide');
        } else {
          alert("error creando cliente, por favor inicie nuevamente la creación del cliente, si persiste consulte a su proveedor");
          return;
        }
      });
    }else{     
      this.clienteService.updateCliente(this.clienteNew).subscribe(res => {
        if (res.code == 200) {
          this.clienteNew = new ClienteModel();
          $('#crearClienteModal').modal('hide');
        } else {
          alert("error creando cliente, por favor inicie nuevamente la creación del cliente, si persiste consulte a su proveedor");
          return;
        }
      });
    }
   

  }

  editarCliente(cliente:ClienteModel){
    this.clienteNew = cliente;
  }

  getTipoIdentificacion() {
    this.clienteService.getTipoIdentificacionAll().subscribe(res => {
      this.tipoIdentificacionList = res;
    });
  }

}
