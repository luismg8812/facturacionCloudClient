import { Injectable } from '@angular/core';
import { ParametrosModel } from '../model/parametros.model';
import {HttpClient} from '@angular/common/http';
import { InformeDiarioModel } from '../model/informeDiario.model';

@Injectable({
  providedIn: 'root'
})
export class CierreService {

  constructor(public http:HttpClient) { }
  parametros: ParametrosModel = new ParametrosModel;
  public server_api =this.parametros.serverUrl;
  
  public getCierreDiario(empresaId:number) { 
    return this.http.get<any>(this.server_api + '/informeDiario/getCierreDiario?empresaId=' + empresaId );
  }
  

  public getInfoDiarioByDate(empresaId:number,fechaInforme, fechaFin) { 
    return this.http.get<InformeDiarioModel[]>(this.server_api + '/informeDiario/getInfoDiarioByDate?empresaId=' + empresaId+"&fechaInforme="+fechaInforme+"&fechaFin="+fechaFin);
  }

  updateInformeDiario(infoDiario: InformeDiarioModel) { 
    return this.http.post<any>(this.server_api + '/informeDiario/updateInformeDiario', infoDiario);
  }

  saveInformeDiario(infoDiario: InformeDiarioModel) { 
    return this.http.post<any>(this.server_api + '/informeDiario/saveInformeDiario', infoDiario);
  }

  hacerCierreDiario(empresaId:number) {
    console.log(empresaId);
    return this.http.get<any>(this.server_api + '/informeDiario/hacerCierreDiario?empresaId=' + empresaId );
  }
}
