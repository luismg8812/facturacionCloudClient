import { Injectable } from '@angular/core';
import { ParametrosModel } from '../model/parametros.model';
import {HttpClient} from '@angular/common/http';
import { BonoModel } from '../model/bono.model';
import { AbonoModel } from '../model/abono.model';

@Injectable({
  providedIn: 'root'
})
export class BonoService {

  parametros: ParametrosModel = new ParametrosModel;
  public server_api =this.parametros.serverUrl;
  constructor(public http:HttpClient) { }

  public getBonosByEmpresa(placa:string,cliente,fechaIni,fechaFin,bono:string,estado:string,empresaId:number,documentoId:string){

    return this.http.get<any>(this.server_api+'/bono/getBonosByEmpresa?placa='+placa+'&clienteId='+cliente
    +'&bonoId='+bono +'&estado='+estado+'&fechaIni='+fechaIni+'&fechaFin='+fechaFin+'&empresaId='+empresaId+'&documentoId='+documentoId);
  }

  public getTiposBono(){
    return this.http.get<any>(this.server_api+'/bono/getTiposBono');
  }

  getBonoById(bonoId:number){
    return this.http.get<BonoModel[]>(this.server_api+'/bono/getBonoById?bonoId='+bonoId);
  }

  public saveBono(bono:BonoModel){
    return this.http.post<any>(this.server_api+'/bono/saveBono',bono);
  }

  public updateBono(bono:BonoModel){
    return this.http.post<any>(this.server_api+'/bono/updateBono',bono);
  }
  

  
}
