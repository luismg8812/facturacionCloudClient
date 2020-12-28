import { Injectable } from '@angular/core';
import { RequerimientoModel } from '../model/requerimiento.model';
import {HttpClient} from '@angular/common/http';
import { ParametrosModel } from '../model/parametros.model';
import { RequerimientoDetalleModel } from '../model/requerimientoDetalle.model';

@Injectable({
  providedIn: 'root'
})
export class TrasladosService {

  constructor(public http:HttpClient) { }

  parametros: ParametrosModel = new ParametrosModel;
  public server_api =this.parametros.serverUrl;

  public saveRequerimiento(requerimiento:RequerimientoModel){
    return this.http.put<any>(this.server_api+'/traslados/saveRequerimiento',requerimiento);
  }

  public saveRequerimientoDetalle(requerimiento:RequerimientoDetalleModel){
    return this.http.put<any>(this.server_api+'/traslados/saveRequerimientoDetalle',requerimiento);
  }

  public getRequerimientos(empresaId:string,fechaIni,fechaFin){
    return this.http.get<RequerimientoModel[]>(this.server_api+'/traslados/getRequerimientos?empresaId='+empresaId+'&fechaIni='+fechaIni+'&fechaFin='+fechaFin);
  }

  public getRequerimientoDetalleByRequerimientoId(requerimientoId:number){
    return this.http.get<RequerimientoDetalleModel[]>(this.server_api+'/traslados/getRequerimientoDetalleByRequerimientoId?requerimientoId='+requerimientoId);
  }

  
  
  
}
