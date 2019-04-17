import { Injectable } from '@angular/core';
import { ClienteModel } from '../model/cliente.model';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(public http:HttpClient) { }

  public server_api ='https://facturacioncloud2019.herokuapp.com';
  public getClientesByEmpresa(empresaId:string){
    return this.http.get<ClienteModel[]>(this.server_api+'/cliente/getClientesByEmpresa?empresaId='+empresaId);
  }
}
