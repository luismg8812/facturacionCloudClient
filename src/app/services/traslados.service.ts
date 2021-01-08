import { Injectable } from '@angular/core';
import { RequerimientoModel } from '../model/requerimiento.model';
import {HttpClient} from '@angular/common/http';
import { ParametrosModel } from '../model/parametros.model';
import { RequerimientoDetalleModel } from '../model/requerimientoDetalle.model';
import { TrasladoModel } from '../model/traslado.model';
import { TrasladoDetalleModel } from '../model/trasladoDetalle.model';

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

  public saveTraslado(traslado:TrasladoModel){
    return this.http.put<any>(this.server_api+'/traslados/saveTraslado',traslado);
  }
  

  public saveRequerimientoDetalle(requerimiento:RequerimientoDetalleModel){
    return this.http.put<any>(this.server_api+'/traslados/saveRequerimientoDetalle',requerimiento);
  }

  public saveTrasladoDetalle(requerimiento:TrasladoDetalleModel){
    return this.http.put<any>(this.server_api+'/traslados/saveTrasladoDetalle',requerimiento);
  }

  public updateRequerimiento(requerimiento:RequerimientoModel){
    return this.http.put<any>(this.server_api+'/traslados/updateRequerimiento',requerimiento);
  }

  public updateTraslado(requerimiento:TrasladoModel){
    return this.http.put<any>(this.server_api+'/traslados/updateTraslado',requerimiento);
  }

  public deleteRequerimientoDetalle(requerimiento:RequerimientoModel){
    return this.http.put<any>(this.server_api+'/traslados/deleteRequerimientoDetalle',requerimiento);
  }

  public deleteTrasladoDetalle(requerimiento:TrasladoModel){
    return this.http.put<any>(this.server_api+'/traslados/deleteTrasladoDetalle',requerimiento);
  }
  

  public getRequerimientos(empresaId:string,fechaIni,fechaFin,estado){
    return this.http.get<RequerimientoModel[]>(this.server_api+'/traslados/getRequerimientos?empresaId='+empresaId+'&fechaIni='+fechaIni+'&fechaFin='+fechaFin+'&estado='+estado);
  }

  public getTraslados(empresaOrigenId:string,empresaDestinoId:string,fechaIni,fechaFin,estado){
    return this.http.get<TrasladoModel[]>(this.server_api+'/traslados/getTraslados?empresaOrigenId='+empresaOrigenId+'&empresaDestinoId='+empresaDestinoId+'&fechaIni='+fechaIni+'&fechaFin='+fechaFin+'&estado='+estado);
  }

  public getRequerimientoDetalleByRequerimientoId(requerimientoId:number){
    return this.http.get<RequerimientoDetalleModel[]>(this.server_api+'/traslados/getRequerimientoDetalleByRequerimientoId?requerimientoId='+requerimientoId);
  }

  public getTrasladoDetalleByTrasladoId(traslado:number){
    return this.http.get<TrasladoDetalleModel[]>(this.server_api+'/traslados/getTrasladoDetalleByTrasladoId?trasladoId='+traslado);
  }

  

  
  
  
}
