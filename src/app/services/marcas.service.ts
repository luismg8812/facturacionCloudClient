import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { ParametrosModel } from '../model/parametros.model';
import { MarcaVehiculoModel } from '../model/marcaVehiculo.model';
import { ModeloMarcaModel } from '../model/modeloMarca.model';

@Injectable({
  providedIn: 'root'
})
export class MarcasService {

  constructor(public http:HttpClient) { }

  parametros: ParametrosModel = new ParametrosModel;
  public server_api =this.parametros.serverUrl;

  public getMarcas(){
    return this.http.get<MarcaVehiculoModel[]>(this.server_api+'/marca/getMarcas');
  }

  public getModeloByMarca(marcaId:string){
    return this.http.get<ModeloMarcaModel[]>(this.server_api+'/marca/getModeloByMarca?marcaId='+marcaId);
  }

  public getModeloById(modeloId){
    return this.http.get<ModeloMarcaModel>(this.server_api+'/marca/getModeloById?modeloId='+modeloId);
  }

}
