import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PagosEmpresaModel} from '../model/pagosEmpresa.model';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  public server_api ='https://facturacioncloud2019.herokuapp.com';
  constructor(public http:HttpClient) { }

  public pagosEmpresaByEmpresa(empresa_id:string){
    return this.http.get<PagosEmpresaModel[]>(this.server_api+'/empresa/pagosEmpresaByEmpresa?empresa_id='+empresa_id);
  }
}
