import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth/auth';
import {HttpClient} from '@angular/common/http';
import { UsuarioModel } from '../model/usuario.model';
import { SubMenuModel } from '../model/submenu.model';
import { RolModel } from '../model/rol.model';

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

  public opcionUsuarioByUsuario(usuarioId:string,menuId:string){
    return this.http.get<SubMenuModel[]>(this.server_api+'/usuario/opcionUsuarioByUsuario?usuarioId='+usuarioId+'&menuId='+menuId);
  }

  public getRolByIds(ids:string[]){
    console.log(this.server_api+'/usuario/getRolByIds?ids='+ids);
    return this.http.get<RolModel[]>(this.server_api+'/usuario/getRolByIds?ids='+ids);
  }

  getByUsuario(usuario:UsuarioModel, empresaId:string,rolId:string){
    return this.http.get<UsuarioModel[]>(this.server_api+'/usuario/getByUsuario?usuario='+usuario+'&empresaId='+empresaId+'&rolId='+rolId);
  }

  saveUsuario(usuario:UsuarioModel,rolId:Array<string>){
    return this.http.post<any>(this.server_api+'/usuario/createUsuario?rolId='+rolId,usuario);
  }
  
}
