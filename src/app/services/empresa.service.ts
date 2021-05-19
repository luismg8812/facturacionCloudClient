import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PagosEmpresaModel} from '../model/pagosEmpresa.model';
import { EmpresaModel } from '../model/empresa.model';
import { ParametrosModel } from '../model/parametros.model';
import { ResolucionEmpresaModel } from '../model/resolucionEmpresa.model';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  parametros: ParametrosModel = new ParametrosModel;
  public server_api =this.parametros.serverUrl;
  constructor(public http:HttpClient) { }

  public pagosEmpresaByEmpresa(empresa_id:string){
    return this.http.get<PagosEmpresaModel[]>(this.server_api+'/empresa/pagosEmpresaByEmpresa?empresa_id='+empresa_id);
  }

  public getEmpresaById(empresa_id:string){
    return this.http.get<EmpresaModel[]>(this.server_api+'/empresa/getEmpresaById?empresa_id='+empresa_id);
  }

  updateConsecutivoEmpresa(empresaId:ResolucionEmpresaModel){
    return this.http.post<any>(this.server_api+'/empresa/updateConsecutivoEmpresa',empresaId);
  }

  public validarLisencia(){
    return this.http.get<EmpresaModel[]>(this.server_api+'/validarLisencia');
  }
  
}
