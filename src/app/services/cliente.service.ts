import { Injectable } from '@angular/core';
import { ClienteModel } from '../model/cliente.model';
import {HttpClient} from '@angular/common/http';
import { TipoPagoModel } from '../model/tipoPago.model';
import { ImpresoraEmpresaModel } from '../model/impresoraEmpresa.model';
import { ParametrosModel } from '../model/parametros.model';
import { TipoIdentificacionModel } from '../model/tipoIdentificacion.model';
import { FactTipoEmpresaModel } from '../model/factTipoEmpresa.model';
import { ResolucionEmpresaModel } from '../model/resolucionEmpresa.model';
import { ResponsabilidadFiscalModel } from '../model/responsabilidadFiscal.model';
import { ResponsabilidadFiscalClienteModelModel } from '../model/responsabilidadFiscalCliente.model';
import { VehiculoModel } from '../model/vehiculo.model';

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

  
  public getById(clienteId:number){
    return this.http.get<ClienteModel[]>(this.server_api+'/cliente/getById?getById='+clienteId);
  }

  public getVehiculos(){
    return this.http.get<VehiculoModel[]>(this.server_api+'/cliente/getVehiculos');
  }

  

  public getConfiguracionByEmpresa(empresaId:string){
    return this.http.get<any>(this.server_api+'/cliente/getConfiguracionByEmpresa?empresaId='+empresaId);
  }

  public getTipoPago(){
    return this.http.get<TipoPagoModel[]>(this.server_api+'/cliente/getTipoPago');
  }

  public getResolucion(empresaId:number){
    return this.http.get<ResolucionEmpresaModel[]>(this.server_api+'/cliente/getResolucion?empresaId='+empresaId);
  }

  public getResolucionById(resolucionEmpresaId:number){
    return this.http.get<ResolucionEmpresaModel[]>(this.server_api+'/cliente/getResolucionById?resolucionEmpresaId='+resolucionEmpresaId);
  }


  public getTipoIdentificacionAll(){
    return this.http.get<TipoIdentificacionModel[]>(this.server_api+'/cliente/getTipoIdentificacionAll');
  }

  public getTipoEmpresa(){
    return this.http.get<FactTipoEmpresaModel[]>(this.server_api+'/cliente/getTipoEmpresa');
  }

  public getResponsabilidades(){
    return this.http.get<ResponsabilidadFiscalModel[]>(this.server_api+'/cliente/getResponsabilidades');
  }

  public getResponsabilidadesByCliente(clienteId:number){
    return this.http.get<ResponsabilidadFiscalModel[]>(this.server_api+'/cliente/getResponsabilidadesByCliente?clienteId='+clienteId);
  }
  
  
  saveCliente(clienteId: ClienteModel) {
    return this.http.post<any>(this.server_api + '/cliente/saveCliente', clienteId);
  }

  saveVehiculo(vehiculoId: VehiculoModel) {
    return this.http.post<any>(this.server_api + '/cliente/saveVehiculo', vehiculoId);
  }

  saveResponsabilidadFiscalCliente(clienteId: ResponsabilidadFiscalClienteModelModel) {
    return this.http.post<any>(this.server_api + '/cliente/saveResponsabilidadFiscalCliente', clienteId);
  }

  

  updateCliente(clienteId: ClienteModel) {
    return this.http.post<any>(this.server_api + '/cliente/updateCliente', clienteId);
  }

  updateVehiculo(vehiculoId: VehiculoModel) {
    return this.http.post<any>(this.server_api + '/cliente/updateVehiculo', vehiculoId);
  }
  
}
