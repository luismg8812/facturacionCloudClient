import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { ParametrosModel } from '../model/parametros.model';
import { ClaseModel } from '../model.contabilidad/clase.model';
import { GrupoModel } from '../model.contabilidad/grupo.model';
import { CuentaModel } from '../model.contabilidad/cuenta.model';

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

  public getGrupoByClase(claseId:number){
    return this.http.get<GrupoModel[]>(this.server_api+'/cuentasContables/getGrupoByClase?claseId='+claseId);
  }

  public getCuentaByGrupo(grupoId:number){
    return this.http.get<CuentaModel[]>(this.server_api+'/cuentasContables/getCuentaByGrupo?grupoId='+grupoId);
  }
  
}
