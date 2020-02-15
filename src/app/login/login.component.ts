import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth/auth';
import { Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { UsuarioModel } from '../model/usuario.model';
import { EmpresaService } from '../services/empresa.service';
import { PagosEmpresaModel } from '../model/pagosEmpresa.model';
import { ParametrosModel } from '../model/parametros.model';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(public afauth: AngularFireAuth, private router: Router, public usuarioService: UsuarioService
    , public empresaService: EmpresaService) { }

  public nombreUsuario: UsuarioModel;

  ngOnInit() {
    this.observador();
  }

  public loginUsuario(usuario: string, clave: string): void {
    if (usuario == "" || clave == "") {
      alert("Usuario y contraseña requerida");
      return;
    }
    let parametros: ParametrosModel = new ParametrosModel;
    if (parametros.ambiente == 'cloud') {

      this.usuarioService.loginUsuario(usuario, clave).then(res => {
        sessionStorage.setItem("userLogin", usuario);
        this.usuarioService.usuarioByMail(usuario).subscribe((res) => {
          console.log(res);
          this.nombreUsuario = res[0];
          let empresa_id = "" + this.nombreUsuario.empresa_id;
          this.empresaService.pagosEmpresaByEmpresa(empresa_id).subscribe((res) => {
            let hoy: Date = new Date();
            hoy.setDate(new Date().getDate() + 5);
            console.log(res);
            if ((res.length === 0) || res[0].fecha_vencimiento < hoy) {
              alert("Existe un inconveniente con su Pago, por favor contacte a su proveedor");
              this.router.navigate(['/login']);
            } else {
              sessionStorage.setItem("nombreUsuario", this.nombreUsuario.nombre);
              sessionStorage.setItem("usuario_id", "" + this.nombreUsuario.usuario_id);
              sessionStorage.setItem("empresa_id", empresa_id);
              this.router.navigate(['/menu']);
            }
          });
        }, (err) => {
          console.error("Error buscando usuario by mail");
        });
      }).catch(err => {
        var errorCode = err.code;
        var errorEspanol = "";
        switch (errorCode) {
          case 'auth/wrong-password':
          case 'auth/user-not-found':
            errorEspanol = 'Error, clave o usuario invalidos';
            break;
          default:
            errorEspanol = 'Error en autenticación, usuario o contraseña invalidos'
            break;
        }
        alert(errorEspanol);
      });
      console.log(usuario);
    } else {
      console.log("conexion local");
      sessionStorage.setItem("userLogin", usuario);
      this.usuarioService.usuarioByMail(usuario).subscribe((res1) => {
        //console.log(res1);
        if(res1.length==0){
          alert("usuario no valido");
          return;
        }
        if(clave!=res1[0].clave){
          alert("clave no valida");
          return;
        }
        
        this.nombreUsuario = res1[0];
        let empresa_id = "" + this.nombreUsuario.empresa_id;
        sessionStorage.setItem("nombreUsuario", this.nombreUsuario.nombre);
        sessionStorage.setItem("usuario_id", "" + this.nombreUsuario.usuario_id);
        sessionStorage.setItem("empresa_id", empresa_id);
        this.router.navigate(['/menu']);
      }, (err) => {
        console.error("Error buscando usuario by mail");
      });
      console.log(usuario);
    }
  }

  public validarEntrada(empresa_id: string) {
    let valido: boolean = true;

    //return valido;
  }

  public observador() {
    var user = sessionStorage.getItem('userLogin');
    if (user) {
      this.router.navigate(['/menu']);
    } else {
      this.router.navigate(['/login']);
    }
  }


}
