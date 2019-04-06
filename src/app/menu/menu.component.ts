import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth/auth';
import { SubMenuModel } from '../model/submenu.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  public nombreUsuario: string;
  public facturacion: Array<SubMenuModel>;;
  public electronica: Array<SubMenuModel>;;
  public funciones: Array<SubMenuModel>;;
  public usuarios: Array<SubMenuModel>;;
  public listados: Array<SubMenuModel>;;
  constructor(public afauth: AngularFireAuth, private router: Router) { }

  ngOnInit() {
    this.observador();
    this.nombreUsuario = sessionStorage.getItem('nombreUsuario');
    this.opcionesSubmenu();
  }

  public opcionesSubmenu() {

  }

  public cerrarSesision() {
    this.afauth.auth.signOut().then(function () {
      console.log("session cerrada");
    }).catch(function (error) {
      console.log("error cerrando sesssion");
    });
    sessionStorage.clear();

  }

  public observador() {
    var user = sessionStorage.getItem('userLogin');
    if (user) {
      // this.router.navigate(['/menu']);
    } else {
      this.router.navigate(['/login']);
    }

  }

}
