import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from '../model/usuario.model';
import { RolModel } from '../model/rol.model';
import { UsuarioService } from '../services/usuario.service';
import { from } from 'rxjs';
import { SubMenuModel } from '../model/submenu.model';
import { ActivacionModel } from '../model/activacion';
import { AngularFireAuth } from '@angular/fire/auth/auth';
import { ParametrosModel } from '../model/parametros.model';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  constructor(private usuarioService: UsuarioService, public afauth: AngularFireAuth, ) {
    this.usuarioBuscar = new UsuarioModel();
    this.usuarioCrear = new UsuarioModel();
    this.rolListSelect = [];
    this.roles();
    this.submenus();
    this.activaciones();

  }

  public usuarioBuscar: UsuarioModel;
  public rolList: Array<RolModel>;
  public rolListSelect: Array<RolModel>;

  public usuarioList: Array<UsuarioModel>;
  public rolSelectBuscar: string;
  public usuarioCrear: UsuarioModel;
  public subMenuAll: Array<SubMenuModel>;
  public submenuSelect: Array<SubMenuModel>;
  public opusuarioUnSelect: Array<SubMenuModel>;
  public usuarioSelect: UsuarioModel;
  public activacionSelect: Array<ActivacionModel>;
  public activacionUnSelect: Array<ActivacionModel>;
  public activacionAll: Array<ActivacionModel>;

  ngOnInit() {
  }

  crearUsuario() {
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
    if (this.rolListSelect.length <= 0) {
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
    } else {
      if (this.usuarioCrear.clave.length < 6) {
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
    let empresaId = localStorage.getItem("empresa_id");
    this.usuarioCrear.empresa_id = Number(empresaId);
    let rolId: number[] = [];

    for (var i = 0; i < this.rolListSelect.length; i++) {
      rolId.push(this.rolListSelect[i].rol_id);
    }

    if (this.usuarioCrear.usuario_id != 0) {
      this.usuarioService.updateUsuario(this.usuarioCrear, rolId).subscribe(res => {
        if (res.code == 200) {
          $('#exampleModal').modal('hide');
        } else {
          alert("Algo salio mal modificando el usuario el usuario... Comunicate con soporte");
          return;
        }
      });
    } else {
      let parametros: ParametrosModel = new ParametrosModel;
      if (parametros.ambiente == 'cloud') {
        this.usuarioService.saveUsuarioFireBase(this.usuarioCrear.correo, this.usuarioCrear.clave).then(user=>{
          console.log("guardo usuario");
        }).catch(error => {
          var errorCode = error.code;
          var errorMessage = error.message;
          alert(errorCode+":"+errorMessage);
        });
      }
      this.usuarioService.saveUsuario(this.usuarioCrear, rolId).subscribe(res => {
        if (res.code == 200) {
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
      this.rolListSelect = [];
      for (var i = 0; i < res.length; i++) {
        let rol: RolModel = new RolModel();
        for (var e = 0; e < this.rolList.length; e++) {
          if (this.rolList[e].rol_id == res[i].rol_id) {
            rol = this.rolList[e];
            this.rolList.splice(e, 1);
            break;
          }
        }
        this.rolListSelect.push(rol);
        console.log(this.rolListSelect);
      }
    });

  }


  buscarUsuarios() {
    let empresaId: string = localStorage.getItem('empresa_id');
    this.usuarioService.getByUsuario(this.usuarioBuscar, empresaId, this.rolSelectBuscar).subscribe(res => {
      //TODO hacer el rool en la busqueda para mandarlo por parametro

      this.usuarioList = res;
    });
  }

  roles() {
    let ids: string[] = ['1', '2', '5', '6']; //se envia los roles sin develop y propietario
    this.usuarioService.getRolByIds(ids).subscribe(res => {
      this.rolList = res;
    });
  }

  submenus() {
    this.usuarioService.getSubMenuAll().subscribe(res => {
      this.subMenuAll = res;
    });
  }
  activaciones() {
    this.usuarioService.getActivacioAll().subscribe(res => {
      this.activacionAll = res;
    });
  }

  aplicarActivacion(activacion: ActivacionModel) {
    for (var i = 0; i < this.activacionSelect.length; i++) {
      if (this.activacionSelect[i].activacion_id == activacion.activacion_id) {
        this.activacionSelect.splice(i, 1);
        break;
      }
    }
    this.activacionUnSelect.push(activacion);
  }

  desaplicarActivacion(activacion: ActivacionModel) {
    for (var i = 0; i < this.activacionUnSelect.length; i++) {
      if (this.activacionUnSelect[i].activacion_id == activacion.activacion_id) {
        this.activacionUnSelect.splice(i, 1);
        break;
      }
    }
    this.activacionSelect.push(activacion);
  }

  nameRol(usuarioId: string) {
    //TODO hacer el metodo que traga la lista de roles por usuario
    return "";
  }

  limpiar() {
    this.usuarioCrear = new UsuarioModel();
  }

  seleccionarRol(rol: RolModel) {
    for (var i = 0; i < this.rolList.length; i++) {
      if (this.rolList[i].rol_id == rol.rol_id) {
        this.rolList.splice(i, 1);
        break;
      }
    }
    this.rolListSelect.push(rol);
  }
  unSeleccionarRol(rol: RolModel) {
    for (var i = 0; i < this.rolListSelect.length; i++) {
      if (this.rolListSelect[i].rol_id == rol.rol_id) {
        this.rolListSelect.splice(i, 1);
        break;
      }
    }
    this.rolList.push(rol);
  }

  desactivarRuta(submenu1: SubMenuModel) {
    for (var i = 0; i < this.submenuSelect.length; i++) {
      if (this.submenuSelect[i].sub_menu_id == submenu1.sub_menu_id) {
        this.submenuSelect.splice(i, 1);
        break;
      }
    }
    this.opusuarioUnSelect.push(submenu1);
  }

  activarRuta(submenu1: SubMenuModel) {
    for (var i = 0; i < this.opusuarioUnSelect.length; i++) {
      if (this.opusuarioUnSelect[i].sub_menu_id == submenu1.sub_menu_id) {
        this.opusuarioUnSelect.splice(i, 1);
        break;
      }
    }
    this.submenuSelect.push(submenu1);
  }

  opcionesPorUsuario(user: UsuarioModel) {
    this.activacionPorUsuario(user);
    this.opusuarioUnSelect = [];
    this.usuarioSelect = user;
    this.usuarioService.opcionUsuarioByUsuarioSinMenu(user.usuario_id.toString()).subscribe(res1 => {
      console.log(res1);
      this.submenuSelect = res1;
      for (var e = 0; e < this.subMenuAll.length; e++) {
        var esta = false;
        for (var i = 0; i < res1.length; i++) {
          if (this.subMenuAll[e].sub_menu_id == res1[i].sub_menu_id) {
            esta = true;
            break;
          }
        }
        if (!esta) {
          this.opusuarioUnSelect.push(this.subMenuAll[e]);
        }
      }
    });






  }

  activacionPorUsuario(user: UsuarioModel) {
    console.log("aqui llega");
    this.activacionUnSelect = [];
    this.usuarioSelect = user;
    this.usuarioService.getActivacionByUsuario(user.usuario_id.toString()).subscribe(res1 => {
      this.activacionSelect = res1;
      for (var e = 0; e < this.activacionAll.length; e++) {
        var esta = false;
        for (var i = 0; i < res1.length; i++) {
          if (this.activacionAll[e].activacion_id == res1[i].activacion_id) {
            esta = true;
            break;
          }
        }
        if (!esta) {
          this.activacionUnSelect.push(this.activacionAll[e]);
        }
      }
    });


  }

  guardarRutas() {
    let idSubmenu: Array<string> = [];
    let idActivacion: Array<string> = [];
    for (var i = 0; i < this.submenuSelect.length; i++) {
      idSubmenu.push(this.submenuSelect[i].sub_menu_id.toString());
    }
    for (var i = 0; i < this.activacionSelect.length; i++) {
      idActivacion.push(this.activacionSelect[i].activacion_id);
    }
    this.usuarioService.guardarActivaciones(this.usuarioSelect, idActivacion).subscribe(res => {

      if (res.code == 200) {
        console.log("Activaciones guardadas");
      } else {
        alert("Algo salio mal Creando activa... " + res.message + "\nComunicate con soporte");
        return;
      }
    });
    this.usuarioService.guardarRutas(this.usuarioSelect, idSubmenu).subscribe(res => {
      if (res.code == 200) {
        $('#exampleModal2').modal('hide');
      } else {
        alert("Algo salio mal Creando rutas... " + res.message + "\nComunicate con soporte");
      }
    });
  }

}
