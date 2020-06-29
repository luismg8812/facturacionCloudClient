import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { ParametrosModel } from '../model/parametros.model';
import { AbonoModel } from '../model/abono.model';

@Injectable({
  providedIn: 'root'
})
export class AbonoService {

  constructor(public http:HttpClient) { }
  parametros: ParametrosModel = new ParametrosModel;
  public server_api =this.parametros.serverUrl;

  saveAbono(abonoId: AbonoModel) { 
    return this.http.post<any>(this.server_api + '/abono/saveAbono', abonoId);
  }

  public getAbonosByDocumento(documentoId:string){
    return this.http.get<AbonoModel[]>(this.server_api+'/abono/getAbonosByDocumento?documentoId='+documentoId);
  }
  
}
