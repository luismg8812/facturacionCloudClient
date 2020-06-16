import { Injectable } from '@angular/core';
import { ParametrosModel } from '../model/parametros.model';
import { ProveedorModel } from '../model/proveedor.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  constructor(public http:HttpClient) { }

  parametros: ParametrosModel = new ParametrosModel;
  public server_api =this.parametros.serverUrl;

  public getProveedoresByEmpresa(empresaId:string){
    return this.http.get<ProveedorModel[]>(this.server_api+'/proveedor/getProveedoresByEmpresa?empresaId='+empresaId);
  }

  saveProveedor(proveedorId: ProveedorModel) {
    return this.http.post<any>(this.server_api + '/proveedor/saveProveedor', proveedorId);
  }

  updateProveedor(proveedorId: ProveedorModel) {
    return this.http.post<any>(this.server_api + '/proveedor/updateProveedor', proveedorId);
  }
}
