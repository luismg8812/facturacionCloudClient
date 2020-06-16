import { Component, OnInit } from '@angular/core';
import { ProveedorModel } from '../model/proveedor.model';
import { ProveedorService } from '../services/proveedor.service';
import { TipoIdentificacionModel } from '../model/tipoIdentificacion.model';
import { ClienteService } from '../services/cliente.service';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css']
})
export class ProveedorComponent implements OnInit {

  public proveedorNew: ProveedorModel = new ProveedorModel();
  public empresaId: number;
  public proveedores: Array<ProveedorModel>;
  public tipoIdentificacionList: Array<TipoIdentificacionModel> = [];
  

  constructor(public proveedorService:ProveedorService,
    public clienteService:ClienteService) { }

  ngOnInit() {
    this.empresaId = Number(localStorage.getItem("empresa_id"));
    this.getTipoIdentificacion();
  }

  editarCliente(cliente:ProveedorModel){
    this.proveedorNew = cliente;
  }

  CrearCliente() {
    // console.log(this.proveedorNew);
    let valido: boolean = true;
    let mensageError: string = "Son obligatorios:\n ";
    if (this.proveedorNew.nombre == "") {
      mensageError += "nombre\n";
      valido = false;
    }
    if (this.proveedorNew.documento == "") {
      mensageError += "documento\n";
      valido = false;
    }
    if (this.proveedorNew.tipo_identificacion_id == null) {
      mensageError += "tipo documento\n";
      valido = false;
    }
    if (valido == false) {
      alert(mensageError);
      return;
    }
    if(this.proveedorNew.proveedor_id==null){
      this.proveedorNew.empresa_id = this.empresaId;
      this.proveedorService.saveProveedor(this.proveedorNew).subscribe(res => {
        if (res.code == 200) {
          this.proveedorNew = new ProveedorModel();
          $('#crearProveedorModal').modal('hide');
        } else {
          alert("error creando cliente, por favor inicie nuevamente la creación del cliente, si persiste consulte a su proveedor");
          return;
        }
      });
    }else{     
      this.proveedorService.updateProveedor(this.proveedorNew).subscribe(res => {
        if (res.code == 200) {
          this.proveedorNew = new ProveedorModel();
          $('#crearProveedorModal').modal('hide');
        } else {
          alert("error creando cliente, por favor inicie nuevamente la creación del cliente, si persiste consulte a su proveedor");
          return;
        }
      });
    }
   

  }

  limpiar(){
    this.proveedorNew = new ProveedorModel();
  }


  buscar() {
    this.proveedorService.getProveedoresByEmpresa(this.empresaId.toString()).subscribe(res => {
      this.proveedores = res;
    });
  }

  getTipoIdentificacion() {
    this.clienteService.getTipoIdentificacionAll().subscribe(res => {
      this.tipoIdentificacionList = res;
    });
  }

}
