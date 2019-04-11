import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from '../model/usuario.model';
import { RolModel } from '../model/rol.model';
import {UsuarioService} from '../services/usuario.service';
import { from } from 'rxjs';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  constructor(private usuarioService:UsuarioService) { 
    this.usuarioBuscar = new UsuarioModel();
    this.usuarioCrear = new UsuarioModel();
    this.rolListSelect=[];
    this.roles();
  }

  public usuarioBuscar: UsuarioModel;
  public rolList: Array<RolModel>;
  public rolListSelect: Array<RolModel>;
  
  public usuarioList: Array<UsuarioModel>;
  public rolSelectBuscar:string;
  public usuarioCrear: UsuarioModel;

  ngOnInit() {
  }

  crearUsuario(){
    let valido: boolean = true;
    let mensageError: string = "Son obligatorios:\n ";
    if (this.usuarioCrear.nombre == "") {
      mensageError += "nombre\n";
      valido = false;
    }
    if (this.usuarioCrear.correo == "") {
      mensageError += "correo\n";
      valido = false;
    }
    if (this.rolListSelect.length <=0) {
      mensageError += "rol\n";
      valido = false;
    }
    if (this.usuarioCrear.identificacion == "") {
      mensageError += "identificación\n";
      valido = false;
    }
    if (this.usuarioCrear.clave == "") {
      mensageError += "clave\n";
      valido = false;
    }else{
      if(this.usuarioCrear.clave.length<6){
        mensageError += "la clave debe tener mas de 6 caracteres\n";
      valido = false;
      }
    }
    if (valido == false) {
      alert(mensageError);
      return;
    }
    if (this.usuarioCrear.estado) {
      this.usuarioCrear.estado = '1';
    } else {
      this.usuarioCrear.estado = '0';
    }
    let empresaId=sessionStorage.getItem("empresa_id");
    this.usuarioCrear.empresa_id=Number(empresaId);
    let rolId:string[]=[];
    
    for (var i=0 ; i<this.rolListSelect.length; i++) {    
      rolId.push(this.rolListSelect[i].rol_id);
    }
  
    if(this.usuarioCrear.usuario_id!=0){
      this.usuarioService.updateUsuario(this.usuarioCrear,rolId).subscribe(res => {
        if (res.code ==200 ) {
          $('#exampleModal').modal('hide');
        } else {
          alert("Algo salio mal Creando el usuario... Comunicate con soporte");
          return;
        }
      });
    }else{
      this.usuarioService.saveUsuario(this.usuarioCrear,rolId).subscribe(res => {
        if (res.code ==200 ) {
          $('#exampleModal').modal('hide');
        } else {
          alert("Algo salio mal Creando el usuario... Comunicate con soporte");
          return;
        }
      });
    }
    
  }

  editarUsuarios(usuarioSelect: UsuarioModel) {
    this.usuarioCrear = usuarioSelect;
    this.roles();
    this.usuarioService.getRolByUsuario(usuarioSelect.usuario_id).subscribe(res => {
      this.rolListSelect=[];  
      for (var i = 0; i < res.length; i++) {
        let rol:RolModel=new RolModel(); 
        for (var e = 0; e < this.rolList.length; e++) {
          if(this.rolList[e].rol_id==res[i].rol_id){
            rol =this.rolList[e]; 
            this.rolList.splice(e, 1);
            break;
            }
        } 
        this.rolListSelect.push(rol);
        console.log(this.rolListSelect);
      }
      //this.rolListSelect=res;
      
      
    });
   
  }

  opcionesPorUsuario(user: UsuarioModel) {
    
    
  }

  buscarUsuarios() {
    let empresaId:string= sessionStorage.getItem('empresa_id');
    this.usuarioService.getByUsuario(this.usuarioBuscar,empresaId,this.rolSelectBuscar).subscribe(res => {
      //TODO hacer el rool en la busqueda para mandarlo por parametro
      
      this.usuarioList = res;
    });
  }

  roles() {
    let ids:string[]=['1','2','5','6']; //se envia los roles sin develop y propietario
    this.usuarioService.getRolByIds(ids).subscribe(res => {
      this.rolList = res;
    });
  }

  nameRol(usuarioId:string){
    //TODO hacer el metodo que traga la lista de roles por usuario
    return "";
  }
 
  limpiar(){
    this.usuarioCrear=new UsuarioModel();
  }

  seleccionarRol(rol:RolModel){
    for (var i = 0; i < this.rolList.length; i++) {
      if(this.rolList[i].rol_id==rol.rol_id){
        this.rolList.splice(i, 1);
        break;
      }  
    }
    this.rolListSelect.push(rol);
  }
  unSeleccionarRol(rol:RolModel){
    for (var i = 0; i < this.rolListSelect.length; i++) {
      if(this.rolListSelect[i].rol_id==rol.rol_id){
        this.rolListSelect.splice(i, 1);
        break;
      }  
    }
    this.rolList.push(rol);
  }


}
