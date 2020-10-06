import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { ParametrosModel } from '../model/parametros.model';
import { ClaseModel } from '../model.contabilidad/clase.model';

@Injectable({
  providedIn: 'root'
})
export class CuentasContablesService {

  constructor(public http:HttpClient) { }

  parametros: ParametrosModel = new ParametrosModel;
  public server_api =this.parametros.serverUrl;

  public getClasesContables(empresaId:number){
    return this.http.get<ClaseModel[]>(this.server_api+'/cuentasContables/getClasesContables?empresaId='+empresaId);
  }
}
