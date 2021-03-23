import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { ParametrosModel } from '../model/parametros.model';
import { ControlInventarioModel } from '../model/controlInventario.model';

@Injectable({
  providedIn: 'root'
})
export class ControlInventarioService {

  constructor(public http:HttpClient) { }

  parametros: ParametrosModel = new ParametrosModel;
  public server_api =this.parametros.serverUrl;


  public getControlInventario(empresaId:number){
    return this.http.get<ControlInventarioModel[]>(this.server_api+'/controlInventario/getControlInventario?empresaId='+empresaId);
  }

  public getControlInventarioByProductoId(productoId:number){
    return this.http.get<ControlInventarioModel[]>(this.server_api+'/controlInventario/getControlInventarioByProductoId?productoId='+productoId);
  }
  
  updateControlInventario(controlInventario: ControlInventarioModel) {
    return this.http.post<any>(this.server_api + '/controlInventario/updateControlInventario', controlInventario);
  }

}
