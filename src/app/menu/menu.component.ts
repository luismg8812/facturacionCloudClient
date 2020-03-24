import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth/auth';
import { SubMenuModel } from '../model/submenu.model';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  readonly MENU_FACTURACION: string = '1';
  readonly MENU_USUARIOS: string = '4';
  readonly MENU_LISTADOS: string = '5';
  public nombreUsuario: string;
  public facturacion: Array<SubMenuModel>;
  public electronica: Array<SubMenuModel>;
  public funciones: Array<SubMenuModel>;
  public usuarios: Array<SubMenuModel>;
  public listados: Array<SubMenuModel>;
  constructor(public afauth: AngularFireAuth, private router: Router,private usuarioService:UsuarioService) { }

  ngOnInit() {
    this.observador();
    this.nombreUsuario = localStorage.getItem('nombreUsuario');
    this.opcionesSubmenu();
  }

  public opcionesSubmenu() {
    let usuario_id = localStorage.getItem('usuario_id');
    let menuFacturacionId=this.MENU_FACTURACION;
    let menuUsuariosId=this.MENU_USUARIOS;
    let menuListadosId=this.MENU_LISTADOS;
    this.usuarioService.opcionUsuarioByUsuario(usuario_id,menuFacturacionId).subscribe((res) => {
      this.facturacion=res;
      console.log(this.facturacion);
    });
    this.usuarioService.opcionUsuarioByUsuario(usuario_id,menuUsuariosId).subscribe((res) => {
      this.usuarios=res;
    });
    this.usuarioService.opcionUsuarioByUsuario(usuario_id,menuListadosId).subscribe((res) => {
      this.listados=res;
    });
  }

  public cerrarSesision() {
    this.afauth.auth.signOut().then(function () {
      console.log("session cerrada");
    }).catch(function (error) {
      console.log("error cerrando sesssion");
    });
    localStorage.clear();

  }

  public observador() {
    var user = localStorage.getItem('userLogin');
    if (user) {
      // this.router.navigate(['/menu']);
    } else {
      this.router.navigate(['/login']);
    }

  }

}
