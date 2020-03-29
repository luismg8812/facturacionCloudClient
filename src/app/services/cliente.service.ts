import { Injectable } from '@angular/core';
import { ClienteModel } from '../model/cliente.model';
import {HttpClient} from '@angular/common/http';
import { TipoPagoModel } from '../model/tipoPago.model';
import { ImpresoraEmpresaModel } from '../model/impresoraEmpresa.model';
import { ParametrosModel } from '../model/parametros.model';
import { TipoIdentificacionModel } from '../model/tipoIdentificacion.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(public http:HttpClient) { }
  parametros: ParametrosModel = new ParametrosModel;
  public server_api =this.parametros.serverUrl;
  public getClientesByEmpresa(empresaId:string){
    return this.http.get<ClienteModel[]>(this.server_api+'/cliente/getClientesByEmpresa?empresaId='+empresaId);
  }

  public getImpresorasEmpresa(empresaId:string){
    return this.http.get<ImpresoraEmpresaModel[]>(this.server_api+'/cliente/getImpresorasEmpresa?empresaId='+empresaId);
  }

  

  public getConfiguracionByEmpresa(empresaId:string){
    return this.http.get<any>(this.server_api+'/cliente/getConfiguracionByEmpresa?empresaId='+empresaId);
  }

  public getTipoPago(){
    return this.http.get<TipoPagoModel[]>(this.server_api+'/cliente/getTipoPago');
  }

  public getTipoIdentificacionAll(){
    return this.http.get<TipoIdentificacionModel[]>(this.server_api+'/cliente/getTipoIdentificacionAll');
  }
  
  saveCliente(clienteId: ClienteModel) {
    return this.http.post<any>(this.server_api + '/cliente/saveCliente', clienteId);
  }

  updateCliente(clienteId: ClienteModel) {
    return this.http.post<any>(this.server_api + '/cliente/updateCliente', clienteId);
  }
  
  
}
