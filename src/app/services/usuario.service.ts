import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth/auth';
import {HttpClient} from '@angular/common/http';
import { UsuarioModel } from '../model/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public server_api ='https://facturacioncloud2019.herokuapp.com';
  constructor(public afauth: AngularFireAuth, public http:HttpClient) { }

  loginUsuario(usuario: string, clave: string) {
    return new Promise((resolve, reject) => {
      console.log(usuario);
      this.afauth.auth.signInWithEmailAndPassword(usuario, clave).then(userData => resolve(userData), err => reject(err))
    });
  }

  public usuarioByMail(mail:string){   
    return this.http.get<UsuarioModel>(this.server_api+'/usuario/usuarioByMail?mail='+mail);
  }

  
  
}
