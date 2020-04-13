import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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

  @ViewChild("facturacionPV") facturacionPV: ElementRef;
  @ViewChild("electronicaPV") electronicaPV: ElementRef;
  @ViewChild("funcionesPV") funcionesPV: ElementRef;
  @ViewChild("terceroPV") terceroPV: ElementRef;
  @ViewChild("listadosPV") listadosPV: ElementRef;
  @ViewChild("cerrar") cerrar: ElementRef;
  
  readonly MENU_FACTURACION: string = '1';
  readonly MENU_ELECTRONICA: string = '2';
  readonly MENU_FUNCIONES: string = '3';
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
    if(this.router.url=="/menu"){
      this.facturacionPV.nativeElement.focus();
    }
    
    
  }

  controlTeclas(event, element) {
    if (event.keyCode == 39) { //cuando se presiona la tacla derecha 				
      if (element.id == 'facturacionPV') {
        this.electronicaPV.nativeElement.focus();
        return;
      }
      if (element.id == 'electronicaPV') {
        this.funcionesPV.nativeElement.focus();
        return;
      }
      if (element.id == 'funcionesPV') {
        this.terceroPV.nativeElement.focus();
        return;
      }
      if (element.id == 'terceroPV') {
        this.listadosPV.nativeElement.focus();
        return;
      }
      if (element.id == 'listadosPV') {
        this.cerrar.nativeElement.focus();
        return;
      }

    }
    if (event.keyCode == 37) { //cuando se presiona la tacla izq 		
      if (element.id == 'electronicaPV') {
        this.facturacionPV.nativeElement.focus();
        return;
      }		
      if (element.id == 'funcionesPV') {
        this.electronicaPV.nativeElement.focus();
        return;
      }
      if (element.id == 'terceroPV') {
        this.funcionesPV.nativeElement.focus();
        return;
      }
      if (element.id == 'listadosPV') {
        this.terceroPV.nativeElement.focus();
        return;
      }
      if (element.id == 'cerrar') {
        this.listadosPV.nativeElement.focus();
        return;
      }
     
    }
  }

  public opcionesSubmenu() {
    let usuario_id = localStorage.getItem('usuario_id');
    let menuFacturacionId=this.MENU_FACTURACION;
    let menuUsuariosId=this.MENU_USUARIOS;
    let menuFuncionesId=this.MENU_FUNCIONES;
    let menuListadosId=this.MENU_LISTADOS;
    let menuElectronicaId=this.MENU_ELECTRONICA;
    this.usuarioService.opcionUsuarioByUsuario(usuario_id,menuFacturacionId).subscribe((res) => {
      this.facturacion=res;
    });
    this.usuarioService.opcionUsuarioByUsuario(usuario_id,menuUsuariosId).subscribe((res) => {
      this.usuarios=res;
    });
    this.usuarioService.opcionUsuarioByUsuario(usuario_id,menuFuncionesId).subscribe((res) => {
      this.funciones=res;
    });
    this.usuarioService.opcionUsuarioByUsuario(usuario_id,menuListadosId).subscribe((res) => {
      this.listados=res;
    });
    this.usuarioService.opcionUsuarioByUsuario(usuario_id,menuElectronicaId).subscribe((res) => {
      this.electronica=res;
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
