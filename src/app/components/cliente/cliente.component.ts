import { Component, OnInit } from '@angular/core';
import { ClienteModel } from 'src/app/model/cliente.model';
import { FactTipoEmpresaModel } from 'src/app/model/factTipoEmpresa.model';
import { ResponsabilidadFiscalModel } from 'src/app/model/responsabilidadFiscal.model';
import { ResponsabilidadFiscalClienteModelModel } from 'src/app/model/responsabilidadFiscalCliente.model';
import { TipoIdentificacionModel } from 'src/app/model/tipoIdentificacion.model';
import { ClienteService } from 'src/app/services/cliente.service';
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
  public tipoEmpresaList: Array<FactTipoEmpresaModel> = [];
  public responsabilidadFiscalList: Array<ResponsabilidadFiscalModel> = [];
  public responsabilidadSelect: Array<ResponsabilidadFiscalModel> = [];
  public responsabilidadUnSelect: Array<ResponsabilidadFiscalModel> = [];
  public tipoIdentificacionList: Array<TipoIdentificacionModel> = [];

  public natural:boolean=true;

  constructor(public clienteService:ClienteService) { }

  ngOnInit() {
    this.empresaId = Number(localStorage.getItem("empresa_id"));
    this.getTipoIdentificacion();
    this.getTipoEmpresa();
    this.getResponsabilidades();
  }

  buscar() {
    this.clienteService.getClientesByEmpresa(this.empresaId.toString()).subscribe(res => {
      this.clientes = res;
    });
  }

  limpiar(){
    this.clienteNew = new ClienteModel();
  }

  selectOrdenOne(op,or: FactTipoEmpresaModel, event) {
    console.log(op);
    if (op.id==1) {
      this.clienteNew.fact_tipo_empresa_id=1;
    } else {
      this.clienteNew.fact_tipo_empresa_id=2;
  }
}

responsabilidadPorCliente(cliente: ClienteModel) { 
    this.responsabilidadUnSelect = [];
    //this.usuarioSelect = user;
    this.clienteService.getResponsabilidadesByCliente(cliente.cliente_id).subscribe(res1 => {
      this.responsabilidadSelect = res1;
      console.log(res1);
      console.log(this.responsabilidadFiscalList);
      for (var e = 0; e < this.responsabilidadFiscalList.length; e++) {
        var esta = false;
        for (var i = 0; i < this.responsabilidadSelect.length; i++) {
          if (this.responsabilidadFiscalList[e].responsabilidad_fiscal_id == res1[i].responsabilidad_fiscal_id) {
            esta = true;
            break;
          }
        }
        if (!esta) {
          this.responsabilidadUnSelect.push(this.responsabilidadFiscalList[e]);
        }
      }
    });
  }

  desactivarRuta(submenu1: ResponsabilidadFiscalModel) {
    for (var i = 0; i < this.responsabilidadSelect.length; i++) {
      if (this.responsabilidadSelect[i].responsabilidad_fiscal_id == submenu1.responsabilidad_fiscal_id) {
        this.responsabilidadSelect.splice(i, 1);
        break;
      }
    }
    this.responsabilidadUnSelect.push(submenu1);
  }

  activarRuta(submenu1: ResponsabilidadFiscalModel) {
    for (var i = 0; i < this.responsabilidadUnSelect.length; i++) {
      if (this.responsabilidadUnSelect[i].responsabilidad_fiscal_id == submenu1.responsabilidad_fiscal_id) {
        this.responsabilidadUnSelect.splice(i, 1);
        break;
      }
    }
    this.responsabilidadSelect.push(submenu1);
  }

  CrearCliente() {
    // console.log(this.clienteNew);
    let valido: boolean = true;
    let mensageError: string = "Son obligatorios:\n ";
    if( this.clienteNew.fact_tipo_empresa_id==1){
      this.clienteNew.fact_tipo_empresa_id=1;
      if (this.clienteNew.razon_social == "") {
        mensageError += "Razon social\n";
        valido = false;
      }
    }else{
      if (this.clienteNew.nombre == "") {
        mensageError += "Nombre\n";
        valido = false;
      }
      this.clienteNew.fact_tipo_empresa_id=2;
    }
   
    if (this.clienteNew.documento == "") {
      mensageError += "Identificación\n";
      valido = false;
    }
    if (this.clienteNew.tipo_identificacion_id == null) {
      mensageError += "tipo documento\n";
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

    
  
    if(this.clienteNew.cliente_id==null){
      this.clienteNew.empresa_id = this.empresaId;
      let cliente = this.clientes.find(clien => (clien.documento) == this.clienteNew.documento);
      if (cliente != undefined) {
        alert("El cliente que está intentando crear ya se incuentra registrado bajo el \nnombre: " + cliente.nombre + " " + cliente.apellidos + "\n" + "NIT: " + cliente.documento);
        return;
      }   
      this.clienteService.saveCliente(this.clienteNew).subscribe(res => {
        if (res.code == 200) {
          for(let op of this.responsabilidadSelect){
            let responsabilidadCliente:ResponsabilidadFiscalClienteModelModel=new ResponsabilidadFiscalClienteModelModel();
            responsabilidadCliente.cliente_id=res.cliente_id;
            responsabilidadCliente.responsabilidad_fiscal_id=op.responsabilidad_fiscal_id;
            this.clienteService.saveResponsabilidadFiscalCliente(responsabilidadCliente).subscribe();
          }
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
          for(let op of this.responsabilidadSelect){
            let responsabilidadCliente:ResponsabilidadFiscalClienteModelModel=new ResponsabilidadFiscalClienteModelModel();
            responsabilidadCliente.cliente_id=res.cliente_id;
            responsabilidadCliente.responsabilidad_fiscal_id=op.responsabilidad_fiscal_id;
            this.clienteService.saveResponsabilidadFiscalCliente(responsabilidadCliente).subscribe();
          }
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
    if(this.clienteNew.fact_tipo_empresa_id==1){
      $('#1').attr("checked", true);
      $('#2').attr("checked", false);
      console.log("false");
    }else{
      $('#1').attr("checked", false);
      $('#2').attr("checked", true);
    
      console.log("true");
    }
    this.responsabilidadPorCliente(cliente);
  }

  newCliente(){
    let newc:ClienteModel=new ClienteModel();
    newc.fact_tipo_empresa_id=2;
    this.responsabilidadPorCliente(new ClienteModel());
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

  getResponsabilidades() {
    this.clienteService.getResponsabilidades().subscribe(res => {
      this.responsabilidadFiscalList = res;
      console.log(res);
    });
  }

  

}
