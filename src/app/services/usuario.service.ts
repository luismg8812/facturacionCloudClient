import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth/auth';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../model/usuario.model';
import { SubMenuModel } from '../model/submenu.model';
import { RolModel } from '../model/rol.model';
import { RolUsuarioModel } from '../model/rolUsuario.model';
import { ActivacionModel } from '../model/activacion';
import { ParametrosModel } from '../model/parametros.model';
import { Observable } from 'rxjs';
import { FotoOrdenVoModel } from '../model/fotoOrdenVo.model';
import { ProporcionModel } from '../model/proporcion.model';
import { ActivacionUsuarioModel } from '../model/activacionUsuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  parametros: ParametrosModel = new ParametrosModel;
  public server_api = this.parametros.serverUrl;
  constructor(public afauth: AngularFireAuth, public http: HttpClient) { }

  loginUsuario(usuario: string, clave: string) {
    return new Promise((resolve, reject) => {
      console.log(usuario);
      this.afauth.auth.signInWithEmailAndPassword(usuario, clave).then(userData => resolve(userData), err => reject(err))
    });
  }

  saveUsuarioFireBase(usuario: string, clave: string) {
    return new Promise((resolve, reject) => {
      console.log(usuario);
      this.afauth.auth.createUserWithEmailAndPassword(usuario, clave).then(userData => resolve(userData), err => reject(err))
    });
  }

  

  public usuarioByMail(mail: string) {
    return this.http.get<UsuarioModel[]>(this.server_api + '/usuario/usuarioByMail?mail=' + mail);
  }

  public getProporcion(empresaId: number) {
    return this.http.get<ProporcionModel[]>(this.server_api + '/usuario/getProporcion?empresaId=' + empresaId);
  }

  public getLiberarCuadre(empresaId: number) {
    return this.http.get<ProporcionModel[]>(this.server_api + '/usuario/getLiberarCuadre?empresaId=' + empresaId);
  }
  
  

  public usuarioByRol(rolId:string,empresaId:number,tipoDocumentoId:string,fechaInicial,fechaFinal) {
    return this.http.get<any>(this.server_api + '/usuario/usuarioByRol?rolId=' + rolId+ '&empresaId=' + empresaId+ '&tipoDocumentoId=' + tipoDocumentoId+ '&fechaInicial=' + fechaInicial+ '&fechaFinal=' + fechaFinal);
  }

  public opcionUsuarioByUsuario(usuarioId: string, menuId: string) {
    return this.http.get<SubMenuModel[]>(this.server_api + '/usuario/opcionUsuarioByUsuario?usuarioId=' + usuarioId + '&menuId=' + menuId);
  }

  public opcionPuntoVentaByUsuario(usuarioId: string) {
    return this.http.get<SubMenuModel[]>(this.server_api + '/usuario/opcionPuntoVentaByUsuario?usuarioId=' + usuarioId);
  }




  public opcionUsuarioByUsuarioSinMenu(usuarioId: string) {
    return this.http.get<SubMenuModel[]>(this.server_api + '/usuario/opcionUsuarioByUsuarioSinMenu?usuarioId=' + usuarioId);
  }

  public getActivacionByUsuario(usuarioId: string) {
    return this.http.get<ActivacionModel[]>(this.server_api + '/usuario/getActivacionByUsuario?usuarioId=' + usuarioId);
  }



  public getRolByIds(ids: string[]) {
    console.log(this.server_api + '/usuario/getRolByIds?ids=' + ids);
    return this.http.get<RolModel[]>(this.server_api + '/usuario/getRolByIds?ids=' + ids);
  }

  getByUsuario(usuario: UsuarioModel, empresaId: string, rolId: string) {
    console.log(usuario);
    return this.http.get<UsuarioModel[]>(this.server_api + '/usuario/getByUsuario?usuario=' + usuario + '&empresaId=' + empresaId + '&rolId=' + rolId);
  }

  saveUsuario(usuario: UsuarioModel, rolId: Array<number>) {
    return this.http.post<any>(this.server_api + '/usuario/createUsuario?rolId=' + rolId, usuario);
  }

  saveActivacionUsuario(activacion: ActivacionUsuarioModel) {
    return this.http.post<any>(this.server_api + '/usuario/saveActivacionUsuario', activacion);
  }

  deleteActivacionUsuario(activacion: ActivacionUsuarioModel) {
    return this.http.post<any>(this.server_api + '/usuario/deleteActivacionUsuario', activacion);
  }
 
  saveUsuarioMasive(usuario: UsuarioModel){
    return this.http.post<any>(this.server_api + '/usuario/createUsuarioMasivo', usuario);
  }

  updateUsuario(usuario: UsuarioModel, rolId: Array<number>) {
    return this.http.put<any>(this.server_api + '/usuario/updateUsuario?rolId=' + rolId, usuario);
  }

  updateProporcion(proporcion: ProporcionModel) {
    return this.http.put<any>(this.server_api + '/usuario/updateProporcion', proporcion);
  }

  public getRolByUsuario(usuarioId: number) {
    return this.http.get<RolUsuarioModel[]>(this.server_api + '/usuario/getRolByUsuario?usuarioId=' + usuarioId);
  }

  getSubMenuAll() {
    return this.http.get<SubMenuModel[]>(this.server_api + '/usuario/getSubMenuAll');
  }

  getActivacioAll() {
    return this.http.get<ActivacionModel[]>(this.server_api + '/usuario/getActivacionAll');
  }

  guardarActivaciones(usuarioId: UsuarioModel, activacionId: Array<string>) {
    return this.http.get<any>(this.server_api + '/usuario/guardarActivaciones?activacionId=' + activacionId + '&usuarioId=' + usuarioId.usuario_id);
  }

  guardarRutas(usuarioId: UsuarioModel, subMenuId: Array<string>) {
    return this.http.get<any>(this.server_api + '/usuario/guardarRutas?subMenuId=' + subMenuId + '&usuarioId=' + usuarioId.usuario_id);
  }

  postFile(fileToUpload, name: string) {
    let fotoOrden: FotoOrdenVoModel = new FotoOrdenVoModel();
    fotoOrden.foto = fileToUpload;
    fotoOrden.nombre = name;
    //console.log(URL.createObjectURL(fileToUpload));
    return this.http.post<any>(this.server_api + '/usuario/postFile', fotoOrden);

  }

  getFile(nombre:string){
    return this.http.get<any>(this.server_api + '/usuario/getFile?nombre=' + nombre );
  }

  getPrincipalImage(nombre:string){
    return this.http.get<any>('assets/images/logoempresa.jpg');
  }


}
