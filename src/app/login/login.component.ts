import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth/auth';
import { Router } from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';

 
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(public afauth: AngularFireAuth,private router: Router, public usuarioService:UsuarioService) { }

  ngOnInit() {
    this.observador();
  }

  public loginUsuario(usuario:string, clave:string): void {
    if (usuario == ""|| clave == "") {
      alert("Usuario y contraseña requerida");
      return;
    }
    this.usuarioService.loginUsuario(usuario,clave).then(res =>{
      sessionStorage.setItem("userLogin",usuario);  
      console.log(res);
      this.router.navigate(['/menu']);
    }).catch(err =>{
      var errorCode = err.code;
      var errorEspanol="";
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
