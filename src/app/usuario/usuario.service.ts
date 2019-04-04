import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth/auth';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(public afauth: AngularFireAuth) { }

  loginUsuario(usuario: string, clave: string) {
    return new Promise((resolve, reject) => {
      console.log(usuario);
      this.afauth.auth.signInWithEmailAndPassword(usuario, clave).then(userData => resolve(userData), err => reject(err))
    });
  }
  
}
